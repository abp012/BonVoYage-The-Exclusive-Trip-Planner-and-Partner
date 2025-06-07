import React, { useRef, useEffect, useState } from 'react';
import { useDestinationCoordinates, useNearbyPlaces } from '../hooks/useGoogleMaps';
import { googleMapsService } from '../services/googleMapsService';

interface ModernMapProps {
  destination: string;
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  className?: string;
  showNearbyPlaces?: boolean;
}

const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090
};

const ModernMapComponent: React.FC<{
  center: { lat: number; lng: number };
  zoom: number;
  places?: any[];
  showNearbyPlaces?: boolean;
}> = ({ center, zoom, places = [], showNearbyPlaces = false }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: true,
        fullscreenControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });
      setMap(newMap);
    }
  }, [ref, map]);

  useEffect(() => {
    if (map) {
      map.setCenter(center);
      
      // Clear existing markers by creating a new map bounds
      const bounds = new google.maps.LatLngBounds();
      
      // Add main destination marker
      const mainMarker = new google.maps.Marker({
        position: center,
        map,
        title: 'Destination',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          scaledSize: new google.maps.Size(45, 45),
        },
      });
      bounds.extend(center);

      // Add nearby places markers if enabled
      if (showNearbyPlaces && places.length > 0) {
        places.forEach((place, index) => {
          const marker = new google.maps.Marker({
            position: place.coordinates,
            map,
            title: place.name,
            icon: {
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new google.maps.Size(35, 35),
            },
          });

          // Add info window
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 12px; max-width: 280px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <h3 style="font-weight: 600; font-size: 18px; margin-bottom: 8px; color: #1f2937;">
                  ${place.name}
                </h3>
                ${place.address ? `
                  <p style="font-size: 14px; color: #6b7280; margin-bottom: 12px; line-height: 1.4;">
                    ${place.address}
                  </p>
                ` : ''}
                ${place.rating ? `
                  <div style="display: flex; align-items: center; margin-bottom: 12px;">
                    <span style="color: #fbbf24; font-size: 16px;">★</span>
                    <span style="margin-left: 6px; font-size: 14px; font-weight: 500;">
                      ${place.rating} ${place.userRatingsTotal ? `(${place.userRatingsTotal} reviews)` : ''}
                    </span>
                  </div>
                ` : ''}
                ${place.types && place.types.length > 0 ? `
                  <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px;">
                    ${place.types.slice(0, 3).map((type: string) => `
                      <span style="padding: 4px 12px; background-color: #e0f2fe; color: #0369a1; font-size: 12px; border-radius: 16px; font-weight: 500;">
                        ${type.replace(/_/g, ' ').toLowerCase()}
                      </span>
                    `).join('')}
                  </div>
                ` : ''}
                ${place.isOpen !== undefined ? `
                  <p style="font-size: 14px; font-weight: 600; color: ${place.isOpen ? '#059669' : '#dc2626'};">
                    ${place.isOpen ? '🟢 Open now' : '🔴 Closed'}
                  </p>
                ` : ''}
              </div>
            `,
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });

          bounds.extend(place.coordinates);
        });

        // Fit map to show all markers
        if (places.length > 0) {
          map.fitBounds(bounds);
          map.setZoom(Math.min(map.getZoom() || zoom, 15));
        }
      }
    }
  }, [map, center, places, showNearbyPlaces, zoom]);

  return (
    <div 
      ref={ref} 
      style={{ 
        width: '100%', 
        height: '500px',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }} 
    />
  );
};

export const ModernMap: React.FC<ModernMapProps> = ({
  destination,
  center,
  zoom = 13,
  className = "",
  showNearbyPlaces = true
}) => {
  // Get dynamic coordinates for the destination
  const { coordinates: destinationCoordinates, isLoading: coordsLoading, error: coordsError } = useDestinationCoordinates(destination);
  const mapCenter = center || destinationCoordinates || defaultCenter;
  
  // Get nearby places if enabled
  const { places, isLoading: placesLoading, error: placesError } = useNearbyPlaces(
    showNearbyPlaces ? mapCenter : null, 
    'tourist_attraction'
  );

  const apiKey = googleMapsService.getApiKey();
  const isLoading = coordsLoading || (showNearbyPlaces && placesLoading);
  const error = coordsError || placesError;

  if (!apiKey) {
    return (
      <div className={`bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-12 text-center border border-gray-200 ${className}`}>
        <div className="text-6xl mb-4">🗺️</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Maps Not Available</h3>
        <p className="text-gray-600">Google Maps API key not found. Please check your environment configuration.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-8 text-center ${className}`}>
        <div className="text-4xl mb-3">⚠️</div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Map Error</h3>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-12 text-center border border-blue-200 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Loading Map</h3>
        <p className="text-blue-600">Fetching location data...</p>
      </div>
    );
  }
  return (
    <div className={`relative ${className}`}>
      <ModernMapComponent
        center={mapCenter}
        zoom={zoom}
        places={places}
        showNearbyPlaces={showNearbyPlaces}
      />
      
      {/* Map overlay info */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
        <h3 className="font-semibold text-gray-800 text-sm">{destination}</h3>
        {showNearbyPlaces && places.length > 0 && (
          <p className="text-xs text-gray-600 mt-1">
            {places.length} nearby attractions
          </p>
        )}
      </div>
    </div>
  );
};

export default ModernMap;