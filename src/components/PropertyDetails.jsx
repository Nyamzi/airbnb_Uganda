import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { sampleProperties } from '../data/sampleProperties';
import { hosts } from '../data/hosts';
import ContactHostModal from './ContactHostModal';
import Reviews from './Reviews';
import BookingCalendar from './BookingCalendar';
import './PropertyDetails.css';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        console.log('Fetching property with ID:', id);
        
        // First try to get from sample data
        const sampleProperty = sampleProperties.find(p => p.id === id);
        if (sampleProperty) {
          console.log('Property found in sample data:', sampleProperty);
          setProperty(sampleProperty);
          setLoading(false);
          return;
        }

        // If not in sample data, try Firebase
        try {
          const docRef = doc(db, 'properties', id);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            console.log('Property found in Firebase:', docSnap.data());
            setProperty({ id: docSnap.id, ...docSnap.data() });
          } else {
            console.log('Property not found in Firebase');
            setError('Property not found');
          }
        } catch (firebaseError) {
          console.error('Firebase error:', firebaseError);
          // If Firebase fails, use sample data as fallback
          if (sampleProperty) {
            console.log('Using sample data as fallback');
            setProperty(sampleProperty);
          } else {
            setError('Error loading property details');
          }
        }
      } catch (err) {
        console.error('Error in fetchProperty:', err);
        setError('Error loading property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const nextImage = () => {
    if (!property?.images) return;
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!property?.images) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleContactClick = () => {
    setShowContactModal(true);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading property details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="back-button">
          Return to Listings
        </button>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="error">
        <p>Property not found</p>
        <button onClick={() => navigate('/')} className="back-button">
          Return to Listings
        </button>
      </div>
    );
  }

  return (
    <div className="property-details-container">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Listings
      </button>

      <div className="property-header">
        <h1>{property.title}</h1>
        <p className="location">{property.location}</p>
      </div>

      <div className="property-layout">
        <div className="property-main">
          {property.images && property.images.length > 0 && (
            <div className="image-gallery">
              <div className="main-image-container">
                <img 
                  src={property.images[currentImageIndex]} 
                  alt={property.title}
                  className="main-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/800x500?text=Image+Not+Available';
                  }}
                />
                <button className="nav-button prev" onClick={prevImage}>←</button>
                <button className="nav-button next" onClick={nextImage}>→</button>
              </div>
              <div className="thumbnail-container">
                {property.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${property.title} - Image ${index + 1}`}
                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/100x70?text=Image+Not+Available';
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="property-content">
            {/* Property Overview Section */}
            <div className="property-overview-section">
              <h2 className="section-title">Property Overview</h2>
              <div className="property-info-grid">
                <div className="info-item">
                  <h3>Bedrooms</h3>
                  <p>{property.bedrooms}</p>
                </div>
                <div className="info-item">
                  <h3>Bathrooms</h3>
                  <p>{property.bathrooms}</p>
                </div>
                <div className="info-item">
                  <h3>Max Guests</h3>
                  <p>{property.maxGuests}</p>
                </div>
                <div className="info-item">
                  <h3>Size</h3>
                  <p>{property.size}</p>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="description-section">
              <h2 className="section-title">About this place</h2>
              <div className="description-content">
                <p>{property.description}</p>
              </div>
            </div>

            {/* Amenities Section */}
            {property.amenities && (
              <div className="amenities-section">
                <h2 className="section-title">Amenities</h2>
                <div className="amenities-content">
                  <div className="amenities-grid">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="amenity-item">
                        <span>✓</span> {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Host Information Section */}
            <div className="host-section">
              <h2 className="section-title">Meet your host</h2>
              <div className="host-content">
                {property.id && hosts[property.id] ? (
                  <>
                    <div className="host-profile">
                      <div className="host-header">
                        <img 
                          src={hosts[property.id].image} 
                          alt={hosts[property.id].name}
                          className="host-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/150x150?text=Host+Image';
                          }}
                        />
                        <div className="host-basic-info">
                          <h3>{hosts[property.id].name}</h3>
                          <p className="host-status">{hosts[property.id].status}</p>
                          <p>Member since {hosts[property.id].memberSince}</p>
                        </div>
                      </div>
                      
                      <div className="host-stats">
                        <div className="stat">
                          <span>{hosts[property.id].rating}</span>
                          <p>Rating</p>
                        </div>
                        <div className="stat">
                          <span>{hosts[property.id].reviews}+</span>
                          <p>Reviews</p>
                        </div>
                        <div className="stat">
                          <span>{hosts[property.id].responseRate}%</span>
                          <p>Response rate</p>
                        </div>
                      </div>
                      
                      <div className="host-details">
                        <p className="response-time">
                          <span>Response time:</span> {hosts[property.id].responseTime}
                        </p>
                        <p className="languages">
                          <span>Languages:</span> {hosts[property.id].languages.join(', ')}
                        </p>
                        {hosts[property.id].verified && (
                          <p className="verified">
                            <span>✓</span> Identity verified
                          </p>
                        )}
                      </div>
                      
                      <p className="host-description">
                        {hosts[property.id].description}
                      </p>
                      
                      <button className="contact-button" onClick={handleContactClick}>
                        Contact Host
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="host-info">
                    <p>Host details are not available at the moment.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Location Section */}
            <div className="location-section">
              <h2 className="section-title">Location</h2>
              <div className="location-content">
                <div className="map-placeholder">
                  <p>Map will be displayed here</p>
                </div>
                <div className="location-details">
                  <h3>Getting around</h3>
                  <ul>
                    <li>5 min walk to public transport</li>
                    <li>10 min drive to city center</li>
                    <li>15 min walk to nearest restaurant</li>
                  </ul>
                  <h3>Nearby attractions</h3>
                  <ul>
                    <li>Local market - 5 min walk</li>
                    <li>Park - 10 min walk</li>
                    <li>Shopping mall - 15 min drive</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="reviews-section">
              <h2 className="section-title">Reviews</h2>
              <div className="reviews-content">
                <Reviews propertyId={property.id} />
              </div>
            </div>
          </div>
        </div>

        <div className="property-sidebar">
          <BookingCalendar 
            property={property}
            onBookingComplete={(booking) => {
              console.log('Booking completed:', booking);
            }}
          />
        </div>
      </div>

      {showContactModal && hosts[property.id] && (
        <ContactHostModal
          host={hosts[property.id]}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </div>
  );
};

export default PropertyDetails; 