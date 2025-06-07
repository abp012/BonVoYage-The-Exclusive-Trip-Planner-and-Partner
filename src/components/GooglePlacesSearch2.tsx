import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface GooglePlacesSearchProps {
  onSelect: (value: string) => void;
  placeholder?: string;
  className?: string;
  value?: string;
}

interface PlacePrediction {
  description: string;
  placeId: string;
  types: string[];
}

function GooglePlacesSearch({
  onSelect,
  placeholder = "Search destinations...",
  className = "",
  value = ""
}: GooglePlacesSearchProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [useNewAPI, setUseNewAPI] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  // Initialize Google Places API
  useEffect(() => {
    const initAPI = () => {
      console.log('Initializing Google Places API...');
      if (typeof window !== 'undefined' && window.google?.maps?.places) {
        console.log('Google Maps Places API detected');
        // Check if new AutocompleteSuggestion API is available
        if (window.google.maps.places.AutocompleteSuggestion) {
          console.log('Using new AutocompleteSuggestion API');
          setUseNewAPI(true);
        } else if (window.google.maps.places.AutocompleteService) {
          console.log('Using legacy AutocompleteService API');
          autocompleteService.current = new window.google.maps.places.AutocompleteService();
          setUseNewAPI(false);
        } else {
          console.error('No Google Places API available');
        }
      } else {
        console.log('Google Maps not yet loaded, retrying...');
        // Retry until Google Maps is loaded
        setTimeout(initAPI, 500);
      }
    };

    initAPI();
  }, []);  // Search for place predictions using new AutocompleteSuggestion API
  const searchPlacesWithNewAPI = useCallback(async (searchQuery: string) => {
    console.log('New API search called with:', searchQuery);
    if (!searchQuery.trim()) {
      setPredictions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Making new API request for:', searchQuery);
      const { suggestions } = await window.google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input: searchQuery,
        includedPrimaryTypes: ['locality', 'administrative_area_level_1', 'country'],
        locationBias: {
          radius: 100000,
          center: { lat: 40.7128, lng: -74.0060 } // Default to NYC
        }
      });

      console.log('New API response:', suggestions);
      const formattedPredictions: PlacePrediction[] = suggestions.map(suggestion => ({
        description: suggestion.placePrediction.text.text,
        placeId: suggestion.placePrediction.placeId,
        types: suggestion.placePrediction.types || []
      }));

      console.log('Formatted predictions:', formattedPredictions);
      setPredictions(formattedPredictions.slice(0, 5));
      setIsOpen(formattedPredictions.length > 0);
      setSelectedIndex(-1);
      setIsLoading(false);
    } catch (error) {
      console.error('AutocompleteSuggestion API error:', error);
      setIsLoading(false);
      setPredictions([]);
      setIsOpen(false);
      // Fallback to legacy API on error
      console.log('Falling back to legacy API');
      searchPlacesWithLegacyAPI(searchQuery);
    }
  }, []);
  // Search for place predictions using legacy AutocompleteService API
  const searchPlacesWithLegacyAPI = useCallback((searchQuery: string) => {
    console.log('Legacy API search called with:', searchQuery);
    if (!searchQuery.trim() || !autocompleteService.current) {
      console.log('Search cancelled: empty query or no service');
      setPredictions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    
    const request: google.maps.places.AutocompletionRequest = {
      input: searchQuery,
      types: ['(cities)']
    };

    console.log('Making legacy API request:', request);
    autocompleteService.current.getPlacePredictions(request, (predictions, status) => {
      console.log('Legacy API response:', { status, predictions });
      setIsLoading(false);
      
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
        const formattedPredictions: PlacePrediction[] = predictions.map(prediction => ({
          description: prediction.description,
          placeId: prediction.place_id,
          types: prediction.types
        }));
        
        console.log('Formatted predictions:', formattedPredictions);
        setPredictions(formattedPredictions.slice(0, 5));
        setIsOpen(formattedPredictions.length > 0);
        setSelectedIndex(-1);
      } else {
        console.error('Legacy API error:', status);
        setPredictions([]);
        setIsOpen(false);
      }
    });
  }, []);

  // Main search function that chooses API based on availability
  const searchPlaces = useCallback((searchQuery: string) => {
    if (useNewAPI) {
      searchPlacesWithNewAPI(searchQuery);
    } else {
      searchPlacesWithLegacyAPI(searchQuery);
    }
  }, [useNewAPI, searchPlacesWithNewAPI, searchPlacesWithLegacyAPI]);  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        console.log('Starting search for:', query);
        searchPlaces(query);
      } else {
        console.log('Query is empty, clearing suggestions');
        setPredictions([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, searchPlaces]);
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('Input changed:', newValue);
    setQuery(newValue);
    onSelect(newValue);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (prediction: PlacePrediction) => {
    setQuery(prediction.description);
    setIsOpen(false);
    setSelectedIndex(-1);
    onSelect(prediction.description);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => prev < predictions.length - 1 ? prev + 1 : prev);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < predictions.length) {
        handleSuggestionClick(predictions[selectedIndex]);
      } else if (query.trim()) {
        setIsOpen(false);
        onSelect(query.trim());
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  // Clear input
  const clearInput = () => {
    setQuery('');
    setIsOpen(false);
    setPredictions([]);
    setSelectedIndex(-1);
    onSelect('');
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-10"
          autoComplete="off"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearInput}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {isOpen && predictions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {predictions.map((prediction, index) => (
            <div
              key={prediction.placeId}
              onClick={() => handleSuggestionClick(prediction)}
              className={`px-4 py-2 cursor-pointer text-sm hover:bg-gray-50 ${
                index === selectedIndex ? 'bg-blue-50 border-l-2 border-blue-500' : ''
              }`}
            >
              <div className="font-medium text-gray-900">
                {prediction.description}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4">
          <div className="text-sm text-gray-500 text-center">
            Searching...
          </div>
        </div>
      )}
    </div>
  );
}

export default GooglePlacesSearch;
