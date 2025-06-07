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
  const [isApiReady, setIsApiReady] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);

  // Initialize Google Places API with better error handling
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 50; // Try for 5 seconds

    const initAPI = () => {
      console.log(`🔍 Initializing Google Places API (attempt ${retryCount + 1}/${maxRetries})...`);
      
      if (typeof window !== 'undefined' && window.google?.maps?.places?.AutocompleteService) {
        try {
          autocompleteService.current = new window.google.maps.places.AutocompleteService();
          setIsApiReady(true);
          console.log('✅ Google Places AutocompleteService initialized successfully');
        } catch (error) {
          console.error('❌ Error initializing AutocompleteService:', error);
        }
      } else {
        retryCount++;
        if (retryCount < maxRetries) {
          console.log('⏳ Google Maps not yet loaded, retrying...');
          setTimeout(initAPI, 100);
        } else {
          console.error('❌ Failed to initialize Google Maps API after maximum retries');
        }
      }
    };

    initAPI();
  }, []);

  // Search for place predictions
  const searchPlaces = useCallback((searchQuery: string) => {
    console.log('🔍 Search called with query:', searchQuery);
    console.log('🔍 API Ready:', isApiReady);
    console.log('🔍 Autocomplete Service:', !!autocompleteService.current);
    
    if (!searchQuery.trim()) {
      console.log('🔍 Empty query, clearing suggestions');
      setPredictions([]);
      setIsOpen(false);
      return;
    }

    if (!isApiReady || !autocompleteService.current) {
      console.log('🔍 API not ready or service not available');
      return;
    }

    setIsLoading(true);
    console.log('🔍 Starting search...');
    
    const request: google.maps.places.AutocompletionRequest = {
      input: searchQuery,
      types: ['(cities)']
    };

    console.log('🔍 Making API request:', request);
    
    autocompleteService.current.getPlacePredictions(request, (predictions, status) => {
      console.log('🔍 API Response Status:', status);
      console.log('🔍 API Response Predictions:', predictions);
      
      setIsLoading(false);
      
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
        const formattedPredictions: PlacePrediction[] = predictions.map(prediction => ({
          description: prediction.description,
          placeId: prediction.place_id,
          types: prediction.types
        }));
        
        console.log('🔍 Formatted predictions:', formattedPredictions);
        setPredictions(formattedPredictions.slice(0, 5));
        setIsOpen(formattedPredictions.length > 0);
        setSelectedIndex(-1);
      } else {
        console.error('🔍 API Error Status:', status);
        console.error('🔍 Available statuses:', google.maps.places.PlacesServiceStatus);
        setPredictions([]);
        setIsOpen(false);
      }
    });
  }, [isApiReady]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        console.log('🔍 Debounced search triggered for:', query);
        searchPlaces(query);
      } else {
        console.log('🔍 Query empty, clearing suggestions');
        setPredictions([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, searchPlaces]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('🔍 Input changed:', newValue);
    setQuery(newValue);
    onSelect(newValue);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (prediction: PlacePrediction) => {
    console.log('🔍 Suggestion clicked:', prediction.description);
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
      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 mb-2">
          API Ready: {isApiReady ? '✅' : '❌'} | 
          Predictions: {predictions.length} | 
          Loading: {isLoading ? '⏳' : '✅'}
        </div>
      )}
      
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
            Searching places...
          </div>
        </div>
      )}

      {/* Error message when API is not ready */}
      {!isApiReady && query.trim() && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-red-200 rounded-md shadow-lg p-4">
          <div className="text-sm text-red-600 text-center">
            Google Maps API not ready. Please wait...
          </div>
        </div>
      )}
    </div>
  );
}

export default GooglePlacesSearch;
