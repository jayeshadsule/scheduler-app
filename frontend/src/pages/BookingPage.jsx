import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Calendar from '../components/Calendar';
import TimeSlots from '../components/TimeSlots';
import { getAvailabilityByLink, bookSlot } from '../api/api';
import { formatTo12Hour } from '../utils/timeUtils';

const BookingPage = () => {
  const { link } = useParams();
  const [availabilities, setAvailabilities] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [is404, setIs404] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await getAvailabilityByLink(link);
        setAvailabilities(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 404) {
          setIs404(true);
        } else {
          setError(err.response?.data?.error || 'Failed to load availability');
        }
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [link]);

  const handleBooking = async () => {
    if (!selectedDate || !selectedSlot) {
      setError('Please select a date and time slot');
      return;
    }

    try {
      await bookSlot({
        bookingLink: link,
        date: selectedDate,
        time: selectedSlot
      });
      setMessage('Booking successful!');
      setError('');
      
      // Update local state to mark the slot as booked
      setAvailabilities(prev => 
        prev.map(avail => {
          if (String(avail.date).trim().substring(0, 10) === selectedDate) {
            return {
              ...avail,
              slots: avail.slots.map(s => 
                s.time === selectedSlot ? { ...s, isBooked: true } : s
              )
            };
          }
          return avail;
        })
      );
      setSelectedSlot('');
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed');
    }
  };

  const currentDaySlots = availabilities.find(
    avail => {
      // Robust matching: trim and compare only the first 10 characters (YYYY-MM-DD)
      const availDate = String(avail.date).trim().substring(0, 10);
      const selectedDateClean = String(selectedDate).trim().substring(0, 10);
      return availDate === selectedDateClean;
    }
  )?.slots || [];

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}><h2>Loading...</h2></div>;
  
  if (is404) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', padding: '20px' }}>
        <h1 style={{ fontSize: '4rem', color: '#dc3545', margin: 0 }}>404</h1>
        <h2>Invalid Booking Link</h2>
        <p>This link has not been generated or is no longer valid.</p>
        <Link to="/" style={{ color: '#007bff' }}>Go to Home</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '40px 20px' }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>Book an Appointment</h1>
        
        {message && <p style={{ color: '#155724', backgroundColor: '#d4edda', padding: '15px', borderRadius: '4px', textAlign: 'center' }}>{message}</p>}
        {error && <p style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '15px', borderRadius: '4px', textAlign: 'center' }}>{error}</p>}

        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px', display: 'inline-block' }}>1. Select a Date</h3>
          <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div>
        
        {selectedDate && (
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px', display: 'inline-block' }}>2. Select a Time Slot</h3>
            <p style={{ color: '#666', marginBottom: '15px' }}>Showing available 30-minute slots for <strong>{selectedDate}</strong></p>
            <TimeSlots 
              slots={currentDaySlots} 
              selectedSlot={selectedSlot} 
              setSelectedSlot={setSelectedSlot} 
            />
          </div>
        )}

        {selectedSlot && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button 
              onClick={handleBooking}
              style={{ 
                padding: '12px 40px', 
                fontSize: '1.2rem',
                backgroundColor: '#007bff', 
                color: 'white', 
                border: 'none', 
                borderRadius: '30px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(0,123,255,0.3)',
                transition: '0.3s'
              }}
            >
              Confirm Booking for {formatTo12Hour(selectedSlot)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
