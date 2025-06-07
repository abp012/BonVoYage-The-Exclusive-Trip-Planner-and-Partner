import { useState, useEffect } from 'react';
import { geminiService, DestinationInfo, Testimonial, PlaceDetail, ComprehensiveTripDetails } from '../services/geminiService';

interface UseGeminiDataProps {
  destination: string;
  days: number;
  budget: string;
  activities: string[];
  travelWith: string;
  people?: number;
  startDate?: string;
  endDate?: string;
}

interface GeminiData {
  destinationInfo: DestinationInfo | null;
  testimonials: Testimonial[] | null;
  itinerary: string[] | null;
  weatherAdvice: string | null;
  cuisineRecommendations: string[] | null;
  placesDetails: PlaceDetail[] | null;
  tripDetails: ComprehensiveTripDetails | null;
  isLoading: boolean;
  error: string | null;
}

// Simple in-memory cache to avoid duplicate API calls
const cache = new Map<string, any>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

function getCacheKey(type: string, destination: string, ...params: any[]): string {
  return `${type}-${destination}-${params.join('-')}`.toLowerCase();
}

function getCachedData(key: string): any | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedData(key: string, data: any): void {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

export function useGeminiData({
  destination,
  days,
  budget,
  activities,
  travelWith,
  people = 1,
  startDate,
  endDate
}: UseGeminiDataProps): GeminiData {  const [data, setData] = useState<GeminiData>({
    destinationInfo: null,
    testimonials: null,
    itinerary: null,
    weatherAdvice: null,
    cuisineRecommendations: null,
    placesDetails: null,
    tripDetails: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    let isMounted = true;

    const fetchGeminiData = async () => {
      if (!destination) return;

      try {
        setData(prev => ({ ...prev, isLoading: true, error: null }));        // Generate cache keys
        const destinationInfoKey = getCacheKey('destination-info', destination, days);
        const testimonialsKey = getCacheKey('testimonials', destination);
        const itineraryKey = getCacheKey('itinerary', destination, days, budget, activities.join(','), travelWith);
        const weatherKey = getCacheKey('weather', destination, startDate, endDate);
        const cuisineKey = getCacheKey('cuisine', destination);
        const placesKey = getCacheKey('places', destination);
        const tripDetailsKey = getCacheKey('trip-details', destination, days, budget, activities.join(','), travelWith, people.toString());        // Check cache first
        const cachedDestinationInfo = getCachedData(destinationInfoKey);
        const cachedTestimonials = getCachedData(testimonialsKey);
        const cachedItinerary = getCachedData(itineraryKey);
        const cachedWeatherAdvice = getCachedData(weatherKey);
        const cachedCuisineRecommendations = getCachedData(cuisineKey);
        const cachedPlacesDetails = getCachedData(placesKey);
        const cachedTripDetails = getCachedData(tripDetailsKey);

        // Prepare promises for non-cached data
        const promises: Promise<any>[] = [];
        const promiseKeys: string[] = [];

        if (!cachedDestinationInfo) {
          promises.push(geminiService.getDestinationInfo(destination, days));
          promiseKeys.push('destinationInfo');
        }

        if (!cachedTestimonials) {
          promises.push(geminiService.generateTestimonials(destination, 3));
          promiseKeys.push('testimonials');
        }        if (!cachedItinerary) {
          promises.push(geminiService.generateItinerary(destination, days, budget, activities));
          promiseKeys.push('itinerary');
        }

        if (!cachedWeatherAdvice && startDate && endDate) {
          promises.push(geminiService.getWeatherAdvice(destination, startDate, endDate));
          promiseKeys.push('weatherAdvice');
        }        if (!cachedCuisineRecommendations) {
          promises.push(geminiService.getCuisineRecommendations(destination));
          promiseKeys.push('cuisineRecommendations');
        }        if (!cachedPlacesDetails) {
          // Get basic place names from activities if available, otherwise let Gemini suggest
          const placesToEnhance = activities.filter(activity => 
            activity.toLowerCase().includes('visit') || 
            activity.toLowerCase().includes('explore')
          ).map(activity => activity.replace(/visit|explore/gi, '').trim()) || [];
          
          promises.push(geminiService.getPlacesDetails(destination, placesToEnhance));
          promiseKeys.push('placesDetails');
        }

        if (!cachedTripDetails) {
          promises.push(geminiService.generateTripDetails({
            destination,
            days,
            budget,
            activities,
            travelWith,
            people
          }));
          promiseKeys.push('tripDetails');
        }

        // Execute API calls for non-cached data
        const results = await Promise.allSettled(promises);

        if (!isMounted) return;

        // Process results and update cache
        const newData: Partial<GeminiData> = {};
        
        let resultIndex = 0;
        if (!cachedDestinationInfo) {
          const result = results[resultIndex];
          if (result.status === 'fulfilled' && result.value) {
            newData.destinationInfo = result.value;
            setCachedData(destinationInfoKey, result.value);
          }
          resultIndex++;
        } else {
          newData.destinationInfo = cachedDestinationInfo;
        }

        if (!cachedTestimonials) {
          const result = results[resultIndex];
          if (result.status === 'fulfilled' && result.value) {
            newData.testimonials = result.value;
            setCachedData(testimonialsKey, result.value);
          }
          resultIndex++;
        } else {
          newData.testimonials = cachedTestimonials;
        }

        if (!cachedItinerary) {
          const result = results[resultIndex];
          if (result.status === 'fulfilled' && result.value) {
            newData.itinerary = result.value;
            setCachedData(itineraryKey, result.value);
          }
          resultIndex++;
        } else {
          newData.itinerary = cachedItinerary;
        }

        if (!cachedWeatherAdvice && startDate && endDate) {
          const result = results[resultIndex];
          if (result.status === 'fulfilled' && result.value) {
            newData.weatherAdvice = result.value;
            setCachedData(weatherKey, result.value);
          }
          resultIndex++;
        } else if (cachedWeatherAdvice) {
          newData.weatherAdvice = cachedWeatherAdvice;
        }        if (!cachedCuisineRecommendations) {
          const result = results[resultIndex];
          if (result.status === 'fulfilled' && result.value) {
            newData.cuisineRecommendations = result.value;
            setCachedData(cuisineKey, result.value);
          }
          resultIndex++;
        } else {
          newData.cuisineRecommendations = cachedCuisineRecommendations;
        }        if (!cachedPlacesDetails) {
          const result = results[resultIndex];
          if (result.status === 'fulfilled' && result.value) {
            newData.placesDetails = result.value;
            setCachedData(placesKey, result.value);
          }
          resultIndex++;
        } else {
          newData.placesDetails = cachedPlacesDetails;
        }

        if (!cachedTripDetails) {
          const result = results[resultIndex];
          if (result.status === 'fulfilled' && result.value) {
            newData.tripDetails = result.value;
            setCachedData(tripDetailsKey, result.value);
          }
          resultIndex++;
        } else {
          newData.tripDetails = cachedTripDetails;
        }

        setData(prev => ({
          ...prev,
          ...newData,
          isLoading: false
        }));

      } catch (error) {
        console.error('Error fetching Gemini data:', error);
        if (isMounted) {
          setData(prev => ({
            ...prev,
            error: 'Failed to load AI-generated content',
            isLoading: false
          }));
        }
      }
    };

    fetchGeminiData();

    return () => {
      isMounted = false;
    };
  }, [destination, days, budget, activities.join(','), travelWith, people, startDate, endDate]);

  return data;
}
