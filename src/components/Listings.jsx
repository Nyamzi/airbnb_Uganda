import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { sampleProperties } from '../data/sampleProperties';
import './Listings.css';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';

const MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your real key
const MAP_CONTAINER_STYLE = { width: '100%', height: '400px' };
const MAP_CENTER = { lat: 1.3733, lng: 32.2903 }; // Center of Uganda

const Listings = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    priceRange: '',
    propertyType: ''
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'properties'));
        let propertiesList = [];
        
        if (querySnapshot.empty) {
          // If no data in Firebase, use sample data
          propertiesList = sampleProperties;
        } else {
          propertiesList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        }
        
        setProperties(propertiesList);
        setFilteredProperties(propertiesList);
      } catch (err) {
        setError('Error fetching properties');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    let filtered = [...properties];

    if (filters.location) {
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(property => {
        const price = property.price;
        if (max) {
          return price >= min && price <= max;
        }
        return price >= min;
      });
    }

    if (filters.propertyType) {
      filtered = filtered.filter(property => 
        property.type.toLowerCase() === filters.propertyType.toLowerCase()
      );
    }

    setFilteredProperties(filtered);
  }, [filters, properties]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePropertyClick = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return <div className="loading">Loading properties...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="listings-container">
      <div className="filters">
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleFilterChange}
        />
        <select
          name="priceRange"
          value={filters.priceRange}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">Price Range</option>
          <option value="0-200000">UGX 0 - UGX 200,000</option>
          <option value="200001-500000">UGX 200,001 - UGX 500,000</option>
          <option value="500001-1000000">UGX 500,001 - UGX 1,000,000</option>
          <option value="1000001-9999999">UGX 1,000,001+</option>
        </select>
        <select
          name="propertyType"
          value={filters.propertyType}
          onChange={handleFilterChange}
        >
          <option value="">Property Type</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="villa">Villa</option>
        </select>
      </div>

      <div className="properties-grid">
        {filteredProperties.map((property) => (
          <div 
            key={property.id} 
            className="property-card"
            onClick={() => handlePropertyClick(property.id)}
          >
            <div className="property-image">
              <img 
                src={property.images?.[0] || 'https://via.placeholder.com/300x200'} 
                alt={property.title}
                loading="lazy"
              />
            </div>
            <div className="property-info">
              <h3>{property.title}</h3>
              <p className="location">
                <i className="fas fa-map-marker-alt"></i>
                {property.location}
              </p>
              <div className="property-details">
                <span><i className="fas fa-bed"></i> {property.bedrooms} beds</span>
                <span><i className="fas fa-bath"></i> {property.bathrooms} baths</span>
                <span><i className="fas fa-users"></i> {property.maxGuests} guests</span>
              </div>
              <p className="price">{formatPrice(property.price)} <span>per night</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Listings; 