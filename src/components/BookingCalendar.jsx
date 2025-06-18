import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import 'react-datepicker/dist/react-datepicker.css';
import './BookingCalendar.css';

const BookingCalendar = ({ property, onBookingComplete }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookedDates, setBookedDates] = useState([]);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchBookedDates();
  }, [property.id]);

  const fetchBookedDates = async () => {
    try {
      const q = query(
        collection(db, 'bookings'),
        where('propertyId', '==', property.id)
      );
      const querySnapshot = await getDocs(q);
      const dates = [];
      querySnapshot.forEach((doc) => {
        const booking = doc.data();
        const start = new Date(booking.startDate.toDate());
        const end = new Date(booking.endDate.toDate());
        
        // Add all dates in the range to booked dates
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          dates.push(new Date(d));
        }
      });
      setBookedDates(dates);
    } catch (error) {
      console.error('Error fetching booked dates:', error);
    }
  };

  const isDateBooked = (date) => {
    return bookedDates.some(bookedDate => 
      bookedDate.toDateString() === date.toDateString()
    );
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    setError('');
  };

  const calculateNights = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotalPrice = () => {
    const nights = calculateNights();
    const basePrice = nights * property.price;
    const serviceFee = basePrice * 0.12;
    return basePrice + serviceFee;
  };

  const handleBooking = async () => {
    console.log('Booking button clicked');
    console.log('Current user:', currentUser);
    console.log('User ID:', currentUser?.uid);
    console.log('User email:', currentUser?.email);
    
    if (!currentUser) {
      console.log('No current user found');
      setError('Please log in to make a booking');
      return;
    }

    console.log('User is authenticated, proceeding with booking...');

    if (!startDate || !endDate) {
      setError('Please select check-in and check-out dates');
      return;
    }

    if (guests > property.maxGuests) {
      setError(`Maximum ${property.maxGuests} guests allowed`);
      return;
    }

    // Check if selected dates are available
    const selectedDates = [];
    for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
      selectedDates.push(new Date(d));
    }

    const hasConflict = selectedDates.some(date => isDateBooked(date));
    if (hasConflict) {
      setError('Selected dates are not available');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const bookingData = {
        propertyId: property.id,
        propertyTitle: property.title,
        propertyLocation: property.location,
        propertyImage: property.images[0],
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email,
        startDate: startDate,
        endDate: endDate,
        guests: guests,
        nights: calculateNights(),
        pricePerNight: property.price,
        totalPrice: calculateTotalPrice(),
        status: 'pending',
        createdAt: new Date()
      };

      console.log('Creating booking with data:', bookingData);

      await addDoc(collection(db, 'bookings'), bookingData);
      
      // Reset form
      setStartDate(null);
      setEndDate(null);
      setGuests(1);
      
      // Refresh booked dates
      await fetchBookedDates();
      
      if (onBookingComplete) {
        onBookingComplete(bookingData);
      }
      
      alert('Booking submitted successfully! The host will contact you soon.');
    } catch (error) {
      console.error('Error creating booking:', error);
      setError('Error creating booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      maximumFractionDigits: 0
    }).format(price);
  };

  const nights = calculateNights();
  const totalPrice = calculateTotalPrice();

  return (
    <div className="booking-calendar">
      {/* Debug info - remove this in production */}
      <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
        Debug: {currentUser ? `Logged in as ${currentUser.email}` : 'Not logged in'}
      </div>

      <div className="booking-header">
        <h3>{formatPrice(property.price)}</h3>
        <span>per night</span>
      </div>

      <div className="date-picker-container">
        <label>Check-in / Check-out</label>
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
          minDate={new Date()}
          filterDate={(date) => !isDateBooked(date)}
          placeholderText="Select dates"
          className="date-picker"
        />
      </div>

      <div className="guests-selector">
        <label>Guests</label>
        <div className="guests-control">
          <button
            type="button"
            onClick={() => setGuests(Math.max(1, guests - 1))}
            disabled={guests <= 1}
          >
            -
          </button>
          <span>{guests} guest{guests !== 1 ? 's' : ''}</span>
          <button
            type="button"
            onClick={() => setGuests(Math.min(property.maxGuests, guests + 1))}
            disabled={guests >= property.maxGuests}
          >
            +
          </button>
        </div>
        <small>Maximum {property.maxGuests} guests</small>
      </div>

      {nights > 0 && (
        <div className="price-breakdown">
          <div className="price-row">
            <span>{formatPrice(property.price)} × {nights} night{nights !== 1 ? 's' : ''}</span>
            <span>{formatPrice(property.price * nights)}</span>
          </div>
          <div className="price-row">
            <span>Service fee</span>
            <span>{formatPrice(property.price * nights * 0.12)}</span>
          </div>
          <div className="price-row total">
            <span>Total</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
        </div>
      )}

      {error && <div className="booking-error">{error}</div>}

      <button
        className="book-button"
        onClick={handleBooking}
        disabled={loading || !startDate || !endDate}
      >
        {loading ? 'Processing...' : 'Book Now'}
      </button>

      <div className="booking-info">
        <p>You won't be charged yet</p>
        <div className="info-items">
          <div className="info-item">
            <span>✓</span>
            <span>Free cancellation for 48 hours</span>
          </div>
          <div className="info-item">
            <span>✓</span>
            <span>Host will respond within 24 hours</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar; 