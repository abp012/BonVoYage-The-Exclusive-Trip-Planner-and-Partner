import React, { useRef, useEffect, useState } from 'react';
import { useNearbyPlaces, useDestinationCoordinates } from '../hooks/useGoogleMaps';
import { googleMapsService } from '../services/googleMapsService';

interface PlacesMapProps {
  destination: string;
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  className?: string;
  selectedPlaces?: any[];
  selectedPlace?: any;
  onPlaceClick?: (place: any) => void;
}

const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090
};

const MapComponent: React.FC<{
  center: { lat: number; lng: number };
  zoom: number;
  places: any[];
  onPlaceClick: (place: any) => void;
  selectedPlace?: any;
}> = ({ center, zoom, places, onPlaceClick, selectedPlace }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
      });
      setMap(newMap);
    }
  }, [ref, map]);

  useEffect(() => {
    if (map) {
      map.setCenter(center);
    }
  }, [map, center]);  useEffect(() => {
    if (map) {
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null));
      const newMarkers: google.maps.Marker[] = [];

      // Add main destination marker
      const destinationMarker = new google.maps.Marker({
        position: center,
        map,
        title: 'Destination',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          scaledSize: new google.maps.Size(40, 40),
        },
      });
      newMarkers.push(destinationMarker);

      // Add numbered markers for places
      places.forEach((place, index) => {
        const isSelected = selectedPlace && selectedPlace.id === place.id;
        const markerNumber = index + 1;
        
        // Create custom numbered marker using Google's numbered markers
        let iconUrl;
        if (markerNumber <= 10) {
          iconUrl = `https://maps.google.com/mapfiles/kml/paddle/${markerNumber}-lv.png`;
        } else {
          // For numbers > 10, use a simple colored marker
          iconUrl = 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
        }
        
        const marker = new google.maps.Marker({
          position: place.coordinates,
          map,
          title: `${markerNumber}. ${place.name}`,
          icon: {
            url: iconUrl,
            scaledSize: isSelected ? new google.maps.Size(40, 40) : new google.maps.Size(32, 32),
          },
          zIndex: isSelected ? 1000 : 100,
        });

        // Add info window on marker click
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 200px;">
              <h3 style="font-weight: 600; font-size: 14px; margin-bottom: 4px; color: #1f2937;">
                ${markerNumber}. ${place.name}
              </h3>
              <p style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">
                ${place.description}
              </p>
              <span style="padding: 2px 6px; background-color: #dbeafe; color: #1e40af; font-size: 10px; border-radius: 8px;">
                ${place.category}
              </span>
            </div>
          `,
        });

        marker.addListener('click', () => {
          // Close any existing info windows
          newMarkers.forEach(m => {
            if (m.get('infoWindow')) {
              (m.get('infoWindow') as google.maps.InfoWindow).close();
            }
          });
          
          infoWindow.open(map, marker);
          onPlaceClick(place);
        });

        marker.set('infoWindow', infoWindow);
        newMarkers.push(marker);
      });

      setMarkers(newMarkers);
    }
  }, [map, center, places, onPlaceClick, selectedPlace]);

  // Zoom to selected place when it changes
  useEffect(() => {
    if (map && selectedPlace && selectedPlace.coordinates) {
      map.panTo(selectedPlace.coordinates);
      map.setZoom(15); // Zoom in when a place is selected
    }
  }, [map, selectedPlace]);

  return <div ref={ref} style={{ width: '100%', height: '400px' }} />;
};

export const PlacesMap: React.FC<PlacesMapProps> = ({
  destination,
  center,
  zoom = 12,
  className = "",
  selectedPlaces = [],
  selectedPlace: parentSelectedPlace,
  onPlaceClick: parentOnPlaceClick
}) => {
  const [localSelectedPlace, setLocalSelectedPlace] = useState<any>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  
  // Get dynamic coordinates for the destination
  const { coordinates: destinationCoordinates, isLoading: coordsLoading } = useDestinationCoordinates(destination);
  const mapCenter = center || destinationCoordinates || defaultCenter;
  
  // Use provided selected places or fall back to nearby places from API
  const { places: nearbyPlaces, isLoading: placesLoading, error } = useNearbyPlaces(mapCenter, 'tourist_attraction');
  const placesToShow = selectedPlaces.length > 0 ? selectedPlaces : nearbyPlaces;

  const apiKey = googleMapsService.getApiKey();  const handlePlaceClick = (place: any) => {
    setLocalSelectedPlace(place);
    
    // Call parent handler if provided
    if (parentOnPlaceClick) {
      parentOnPlaceClick(place);
    }
    
    // Close any existing info windows managed by this component
    if (infoWindow) {
      infoWindow.close();
    }
  };

  if (!apiKey) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <p className="text-gray-600">Google Maps API key not found. Please check your environment configuration.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <p className="text-red-600">Error loading places: {error}</p>
      </div>
    );
  }

  if (coordsLoading || placesLoading) {
    return (
      <div className={`bg-gray-50 rounded-lg p-8 text-center ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading places...</p>
      </div>
    );
  }  return (
    <div className={className}>
      <MapComponent
        center={mapCenter}
        zoom={zoom}
        places={placesToShow || []}
        onPlaceClick={handlePlaceClick}
        selectedPlace={parentSelectedPlace || localSelectedPlace}
      />
    </div>
  );
};

export default PlacesMap;