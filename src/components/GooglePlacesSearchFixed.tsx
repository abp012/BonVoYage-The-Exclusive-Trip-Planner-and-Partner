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

function GooglePlacesSearchFixed({
  onSelect,
  placeholder = "Search destinations...",
  className = "",
  value = ""
}: GooglePlacesSearchProps) {  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);
  const [justSelected, setJustSelected] = useState(false); // Flag to prevent search after selection
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Google Places API
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 30;

    const initAPI = () => {
      if (typeof window !== 'undefined' && window.google?.maps?.places?.AutocompleteService) {
        try {
          autocompleteService.current = new window.google.maps.places.AutocompleteService();
          setIsApiReady(true);
          console.log('✅ Google Places API initialized successfully');
        } catch (error) {
          console.error('❌ Error initializing AutocompleteService:', error);
        }
      } else {
        retryCount++;
        if (retryCount < maxRetries) {
          setTimeout(initAPI, 200);
        } else {
          console.error('❌ Failed to initialize Google Maps API after maximum retries');
        }
      }
    };

    initAPI();
  }, []);
  // Search for place predictions
  const searchPlaces = useCallback((searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setPredictions([]);
      setIsOpen(false);
      return;
    }

    if (!isApiReady || !autocompleteService.current) {
      return;
    }

    setIsLoading(true);
    
    const request: google.maps.places.AutocompletionRequest = {
      input: searchQuery,
      types: ['(cities)'],
      componentRestrictions: { country: [] } // Allow all countries
    };
    
    autocompleteService.current.getPlacePredictions(request, (predictions, status) => {
      setIsLoading(false);
      
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions && predictions.length > 0) {
        const formattedPredictions: PlacePrediction[] = predictions.map(prediction => ({
          description: prediction.description,
          placeId: prediction.place_id,
          types: prediction.types
        }));
        
        setPredictions(formattedPredictions.slice(0, 5));
        // Only open if input is focused and has sufficient length
        if (document.activeElement === inputRef.current && searchQuery.length >= 2) {
          setIsOpen(true);
        }
        setSelectedIndex(-1);
      } else {
        setPredictions([]);
        setIsOpen(false);
      }
    });
  }, [isApiReady]);
  // Debounced search
  useEffect(() => {
    // Don't search if we just selected a place
    if (justSelected) {
      setJustSelected(false);
      return;
    }
    
    const timeoutId = setTimeout(() => {
      searchPlaces(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, searchPlaces, justSelected]);
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onSelect(newValue);
    
    // Reset predictions if input is cleared
    if (!newValue.trim()) {
      setPredictions([]);
      setIsOpen(false);
    }
  };  // Handle suggestion selection
  const handleSuggestionClick = (prediction: PlacePrediction) => {
    setJustSelected(true); // Prevent immediate search
    setQuery(prediction.description);
    setIsOpen(false);
    setSelectedIndex(-1);
    setPredictions([]); // Clear predictions to prevent re-opening
    onSelect(prediction.description);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || predictions.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        onSelect(query.trim());
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => prev < predictions.length - 1 ? prev + 1 : 0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : predictions.length - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < predictions.length) {
        handleSuggestionClick(predictions[selectedIndex]);
      } else {
        setIsOpen(false);
        onSelect(query.trim());
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };
  // Handle input focus
  const handleInputFocus = () => {
    if (predictions.length > 0 && query.length >= 2) {
      setIsOpen(true);
    }
  };

  // Handle input blur with improved logic
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Check if the focus is moving to a suggestion
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget && containerRef.current?.contains(relatedTarget)) {
      return; // Don't close if focus is moving within our component
    }
    
    // Delay closing to allow for click events on suggestions
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    }, 150);
  };
  // Clear input
  const clearInput = () => {
    setQuery('');
    setIsOpen(false);
    setPredictions([]);
    setSelectedIndex(-1);
    setJustSelected(false); // Reset flag
    onSelect('');
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
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
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100 z-10"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Suggestions dropdown with higher z-index */}
      {isOpen && (
        <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              Searching places...
            </div>
          ) : predictions.length > 0 ? (
            predictions.map((prediction, index) => (
              <div
                key={prediction.placeId}
                onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking
                onClick={() => handleSuggestionClick(prediction)}
                className={`px-4 py-3 cursor-pointer text-sm hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                  index === selectedIndex ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="font-medium text-gray-900 truncate">
                  {prediction.description}
                </div>
              </div>
            ))
          ) : query.length >= 2 && isApiReady ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              No places found
            </div>
          ) : null}
        </div>
      )}

      {/* API not ready indicator */}
      {!isApiReady && query.trim() && (
        <div className="absolute z-[9999] w-full mt-1 bg-white border border-amber-200 rounded-md shadow-lg p-3">
          <div className="text-sm text-amber-600 text-center">
            Loading Google Maps API...
          </div>
        </div>
      )}
    </div>
  );
}

export default GooglePlacesSearchFixed;
