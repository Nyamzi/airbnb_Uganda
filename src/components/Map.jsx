import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import './Map.css';

const Map = ({ properties, onPropertyClick, selectedProperty }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Uganda center coordinates
  const center = {
    lat: 1.3733,
    lng: 32.2903
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY'
  });

  const onLoad = useCallback((map) => {
    const bounds = new window.google.maps.LatLngBounds();
    properties.forEach(property => {
      if (property.coordinates) {
        bounds.extend(property.coordinates);
      }
    });
    map.fitBounds(bounds);
  }, [properties]);

  const onUnmount = useCallback(() => {
    // Cleanup if needed
  }, []);

  const handleMarkerClick = (property) => {
    setSelectedMarker(property);
    if (onPropertyClick) {
      onPropertyClick(property);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!isLoaded) {
    return (
      <div className="map-loading">
        <div className="loading-spinner"></div>
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <div className="map-container">
      <GoogleMap
        mapContainerClassName="map"
        center={center}
        zoom={7}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: true,
        }}
      >
        {properties.map((property) => (
          <Marker
            key={property.id}
            position={property.coordinates || center}
            onClick={() => handleMarkerClick(property)}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: new window.google.maps.Size(30, 30)
            }}
          />
        ))}

        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.coordinates || center}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="info-window">
              <img 
                src={selectedMarker.images[0]} 
                alt={selectedMarker.title}
                className="info-window-image"
              />
              <h3>{selectedMarker.title}</h3>
              <p className="info-window-location">{selectedMarker.location}</p>
              <p className="info-window-price">{formatPrice(selectedMarker.price)} / night</p>
              <div className="info-window-details">
                <span>{selectedMarker.bedrooms} bed</span>
                <span>{selectedMarker.bathrooms} bath</span>
                <span>{selectedMarker.maxGuests} guests</span>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default Map; 