// Google Maps API Service for dynamic location data
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PlaceDetails {
  placeId: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  types: string[];
  rating?: number;
  userRatingsTotal?: number;
  photoUrl?: string;
  priceLevel?: number;
  isOpen?: boolean;
  vicinity?: string;
}

export interface WeatherData {
  temperature: string;
  condition: string;
  humidity: string;
  windSpeed: string;
  description: string;
}

class GoogleMapsService {
  private apiKey: string;
  private geocoder?: google.maps.Geocoder;
  private placesService?: google.maps.places.PlacesService;
  private isInitialized: boolean = false;

  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  }
  private async waitForGoogleMaps(): Promise<void> {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 100; // 10 seconds timeout

      const checkGoogleMaps = () => {
        attempts++;
        
        if (attempts > maxAttempts) {
          reject(new Error('Google Maps API failed to load within timeout'));
          return;
        }

        if (typeof window !== 'undefined' && 
            window.google && 
            window.google.maps && 
            window.google.maps.Geocoder && 
            window.google.maps.places &&
            window.google.maps.places.PlacesService) {
          resolve();
          return;
        }

        setTimeout(checkGoogleMaps, 100);
      };
      
      checkGoogleMaps();
    });
  }
  private async initializeServices() {
    if (this.isInitialized) return;

    try {
      await this.waitForGoogleMaps();
      
      if (window.google && window.google.maps) {
        this.geocoder = new window.google.maps.Geocoder();
        // Create a dummy div for PlacesService
        const dummyDiv = document.createElement('div');
        const map = new window.google.maps.Map(dummyDiv, {
          center: { lat: 0, lng: 0 },
          zoom: 1
        });
        this.placesService = new window.google.maps.places.PlacesService(map);
        this.isInitialized = true;
        console.log('Google Maps services initialized successfully');
      } else {
        throw new Error('Google Maps API not available after waiting');
      }
    } catch (error) {
      console.error('Error initializing Google Maps services:', error);
      // Don't throw the error, just mark as failed and continue with fallbacks
      this.isInitialized = false;
    }
  }
  // Get coordinates for a destination using Geocoding API
  async getDestinationCoordinates(destination: string): Promise<Coordinates> {
    try {
      await this.initializeServices();
      
      if (!this.geocoder) {
        throw new Error('Geocoder not initialized');
      }

      return new Promise((resolve, reject) => {
        this.geocoder!.geocode(
          { address: destination },
          (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
              const location = results[0].geometry.location;
              resolve({
                lat: location.lat(),
                lng: location.lng()
              });
            } else {
              // Fallback to default coordinates if geocoding fails
              console.warn(`Geocoding failed for ${destination}, using default coordinates`);
              resolve({ lat: 28.6139, lng: 77.2090 }); // Default to Delhi
            }
          }
        );
      });
    } catch (error) {
      console.error('Error in getDestinationCoordinates:', error);
      // Return default coordinates if initialization fails
      return { lat: 28.6139, lng: 77.2090 };
    }
  }
  // Get nearby places using Places API
  async getNearbyPlaces(
    coordinates: Coordinates, 
    type: string = 'tourist_attraction',
    radius: number = 10000
  ): Promise<PlaceDetails[]> {
    try {
      await this.initializeServices();
      
      if (!this.placesService) {
        throw new Error('Places service not initialized');
      }

      return new Promise((resolve, reject) => {
        const request: google.maps.places.PlaceSearchRequest = {
          location: new google.maps.LatLng(coordinates.lat, coordinates.lng),
          radius: radius,
          type: type as any
        };

        this.placesService!.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const places: PlaceDetails[] = results.slice(0, 10).map(place => ({
              placeId: place.place_id || '',
              name: place.name || '',
              address: place.vicinity || '',
              coordinates: {
                lat: place.geometry?.location?.lat() || coordinates.lat,
                lng: place.geometry?.location?.lng() || coordinates.lng
              },
              types: place.types || [],
              rating: place.rating,
              userRatingsTotal: place.user_ratings_total,
              photoUrl: this.getPhotoUrl(place.photos?.[0]),
              priceLevel: place.price_level,
              isOpen: place.opening_hours?.isOpen(),
              vicinity: place.vicinity
            }));
            resolve(places);
          } else {
            console.warn(`Places search failed: ${status}`);
            resolve([]);
          }
        });
      });
    } catch (error) {
      console.error('Error in getNearbyPlaces:', error);
      return [];
    }
  }
  // Get place details by place ID
  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    try {
      await this.initializeServices();
      
      if (!this.placesService) {
        throw new Error('Places service not initialized');
      }

      return new Promise((resolve, reject) => {
        const request: google.maps.places.PlaceDetailsRequest = {
          placeId: placeId,
          fields: [
            'place_id', 'name', 'formatted_address', 'geometry', 'types',
            'rating', 'user_ratings_total', 'photos', 'price_level',
            'opening_hours', 'vicinity'
          ]
        };

        this.placesService!.getDetails(request, (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            const placeDetails: PlaceDetails = {
              placeId: place.place_id || '',
              name: place.name || '',
              address: place.formatted_address || '',
              coordinates: {
                lat: place.geometry?.location?.lat() || 0,
                lng: place.geometry?.location?.lng() || 0
              },
              types: place.types || [],
              rating: place.rating,
              userRatingsTotal: place.user_ratings_total,
              photoUrl: this.getPhotoUrl(place.photos?.[0]),
              priceLevel: place.price_level,
              isOpen: place.opening_hours?.isOpen(),
              vicinity: place.vicinity
            };
            resolve(placeDetails);
          } else {
            console.warn(`Place details request failed: ${status}`);
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error('Error in getPlaceDetails:', error);
      return null;
    }
  }
  // Search for places by text query
  async searchPlacesByText(query: string, coordinates?: Coordinates): Promise<PlaceDetails[]> {
    try {
      await this.initializeServices();
      
      if (!this.placesService) {
        throw new Error('Places service not initialized');
      }

      return new Promise((resolve, reject) => {
        const request: google.maps.places.TextSearchRequest = {
          query: query,
          location: coordinates ? new google.maps.LatLng(coordinates.lat, coordinates.lng) : undefined,
          radius: coordinates ? 50000 : undefined
        };

        this.placesService!.textSearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const places: PlaceDetails[] = results.slice(0, 10).map(place => ({
              placeId: place.place_id || '',
              name: place.name || '',
              address: place.formatted_address || '',
              coordinates: {
                lat: place.geometry?.location?.lat() || 0,
                lng: place.geometry?.location?.lng() || 0
              },
              types: place.types || [],
              rating: place.rating,
              userRatingsTotal: place.user_ratings_total,
              photoUrl: this.getPhotoUrl(place.photos?.[0]),
              priceLevel: place.price_level,
              isOpen: place.opening_hours?.isOpen(),
              vicinity: place.vicinity
            }));
            resolve(places);
          } else {
            console.warn(`Text search failed: ${status}`);
            resolve([]);
          }
        });
      });
    } catch (error) {
      console.error('Error in searchPlacesByText:', error);
      return [];
    }
  }

  // Get photo URL from Google Places photo reference
  private getPhotoUrl(photo?: google.maps.places.PlacePhoto): string | undefined {
    if (!photo) return undefined;
    
    return photo.getUrl({
      maxWidth: 400,
      maxHeight: 250
    });
  }

  // Get multiple types of places for a destination
  async getDestinationPlaces(destination: string): Promise<{
    coordinates: Coordinates;
    attractions: PlaceDetails[];
    restaurants: PlaceDetails[];
    hotels: PlaceDetails[];
    museums: PlaceDetails[];
  }> {
    try {
      const coordinates = await this.getDestinationCoordinates(destination);
      
      const [attractions, restaurants, hotels, museums] = await Promise.all([
        this.getNearbyPlaces(coordinates, 'tourist_attraction', 15000),
        this.getNearbyPlaces(coordinates, 'restaurant', 10000),
        this.getNearbyPlaces(coordinates, 'lodging', 10000),
        this.getNearbyPlaces(coordinates, 'museum', 15000)
      ]);

      return {
        coordinates,
        attractions,
        restaurants,
        hotels,
        museums
      };
    } catch (error) {
      console.error('Error fetching destination places:', error);
      // Return default coordinates and empty arrays if API fails
      return {
        coordinates: { lat: 28.6139, lng: 77.2090 },
        attractions: [],
        restaurants: [],
        hotels: [],
        museums: []
      };
    }
  }

  // Get destination image using Google Places API
  async getDestinationImage(destination: string): Promise<string> {
    try {
      await this.initializeServices();
      
      if (!this.placesService) {
        // Fallback to a generic placeholder
        return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop";
      }

      // Search for the destination to get photos
      const places = await this.searchPlacesByText(`${destination} landmarks attractions`);
      
      if (places.length > 0 && places[0].photoUrl) {
        return places[0].photoUrl;
      }
      
      // If no photo found, try searching for more general terms
      const generalPlaces = await this.searchPlacesByText(destination);
      if (generalPlaces.length > 0 && generalPlaces[0].photoUrl) {
        return generalPlaces[0].photoUrl;
      }
      
      // Final fallback to a placeholder image
      return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop";
    } catch (error) {
      console.error('Error getting destination image:', error);
      return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop";
    }
  }

  // Check if Google Maps API is available
  isGoogleMapsAvailable(): boolean {
    return !!(typeof window !== 'undefined' && window.google && window.google.maps && this.apiKey);
  }

  // Get API key for external use
  getApiKey(): string {
    return this.apiKey;
  }
}

// Export singleton instance
export const googleMapsService = new GoogleMapsService();
export default googleMapsService;
