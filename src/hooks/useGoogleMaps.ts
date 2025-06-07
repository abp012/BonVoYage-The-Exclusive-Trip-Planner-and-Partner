import { useState, useEffect, useCallback } from 'react';
import { googleMapsService, PlaceDetails, Coordinates } from '../services/googleMapsService';

export interface UseGoogleMapsResult {
  isLoading: boolean;
  error: string | null;
  coordinates: Coordinates | null;
  attractions: PlaceDetails[];
  restaurants: PlaceDetails[];
  hotels: PlaceDetails[];
  museums: PlaceDetails[];
  searchPlaces: (query: string) => Promise<PlaceDetails[]>;
  getPlaceDetails: (placeId: string) => Promise<PlaceDetails | null>;
  refetch: () => void;
}

export const useGoogleMaps = (destination: string): UseGoogleMapsResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [attractions, setAttractions] = useState<PlaceDetails[]>([]);
  const [restaurants, setRestaurants] = useState<PlaceDetails[]>([]);
  const [hotels, setHotels] = useState<PlaceDetails[]>([]);
  const [museums, setMuseums] = useState<PlaceDetails[]>([]);

  const fetchDestinationData = useCallback(async () => {
    if (!destination || !googleMapsService.isGoogleMapsAvailable()) {
      setError('Google Maps API not available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await googleMapsService.getDestinationPlaces(destination);
      setCoordinates(data.coordinates);
      setAttractions(data.attractions);
      setRestaurants(data.restaurants);
      setHotels(data.hotels);
      setMuseums(data.museums);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch destination data');
      console.error('Error fetching destination data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [destination]);

  const searchPlaces = useCallback(async (query: string): Promise<PlaceDetails[]> => {
    if (!googleMapsService.isGoogleMapsAvailable()) {
      throw new Error('Google Maps API not available');
    }

    try {
      return await googleMapsService.searchPlacesByText(query, coordinates || undefined);
    } catch (err) {
      console.error('Error searching places:', err);
      return [];
    }
  }, [coordinates]);

  const getPlaceDetails = useCallback(async (placeId: string): Promise<PlaceDetails | null> => {
    if (!googleMapsService.isGoogleMapsAvailable()) {
      throw new Error('Google Maps API not available');
    }

    try {
      return await googleMapsService.getPlaceDetails(placeId);
    } catch (err) {
      console.error('Error getting place details:', err);
      return null;
    }
  }, []);

  const refetch = useCallback(() => {
    fetchDestinationData();
  }, [fetchDestinationData]);

  useEffect(() => {
    if (destination) {
      fetchDestinationData();
    }
  }, [destination, fetchDestinationData]);

  return {
    isLoading,
    error,
    coordinates,
    attractions,
    restaurants,
    hotels,
    museums,
    searchPlaces,
    getPlaceDetails,
    refetch
  };
};

// Hook for getting just coordinates
export const useDestinationCoordinates = (destination: string) => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!destination) return;

    const fetchCoordinates = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const coords = await googleMapsService.getDestinationCoordinates(destination);
        setCoordinates(coords);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch coordinates');
        console.error('Error fetching coordinates:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoordinates();
  }, [destination]);

  return { coordinates, isLoading, error };
};

// Hook for nearby places
export const useNearbyPlaces = (coordinates: Coordinates | null, type: string = 'tourist_attraction') => {
  const [places, setPlaces] = useState<PlaceDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!coordinates) return;

    const fetchPlaces = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const nearbyPlaces = await googleMapsService.getNearbyPlaces(coordinates, type);
        setPlaces(nearbyPlaces);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch nearby places');
        console.error('Error fetching nearby places:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaces();
  }, [coordinates, type]);

  return { places, isLoading, error };
};
