import React, { useRef, useEffect, useState } from 'react';
import { useDestinationCoordinates } from '../hooks/useGoogleMaps';
import { googleMapsService } from '../services/googleMapsService';

interface MapProps {
  destination: string;
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  className?: string;
}

const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090
};

const MapComponent: React.FC<{
  center: { lat: number; lng: number };
  zoom: number;
}> = ({ center, zoom }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

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
      
      // Add marker for the destination
      new google.maps.Marker({
        position: center,
        map,
        title: 'Destination',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          scaledSize: new google.maps.Size(40, 40),
        },
      });
    }
  }, [map, center]);

  return <div ref={ref} style={{ width: '100%', height: '400px' }} />;
};

export const Map: React.FC<MapProps> = ({
  destination,
  center,
  zoom = 12,
  className = ""
}) => {
  // Get dynamic coordinates for the destination
  const { coordinates: destinationCoordinates, isLoading, error } = useDestinationCoordinates(destination);
  const mapCenter = center || destinationCoordinates || defaultCenter;

  const apiKey = googleMapsService.getApiKey();

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
        <p className="text-red-600">Error loading map: {error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`bg-gray-50 rounded-lg p-8 text-center ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <MapComponent center={mapCenter} zoom={zoom} />
    </div>
  );
};

export default Map;