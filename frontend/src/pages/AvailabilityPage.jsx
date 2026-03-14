import React, { useState } from 'react';
import Calendar from '../components/Calendar';
import { saveAvailability, generateLink } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { formatTo12Hour } from '../utils/timeUtils';

const AvailabilityPage = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [savedAvailabilities, setSavedAvailabilities] = useState([]); // Managed offline/local state
  const [bookingLink, setBookingLink] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSaveAvailability = async () => {
    if (!selectedDate || !startTime || !endTime) {
      setError('Please fill in all fields');
      return;
    }
    if (startTime >= endTime) {
      setError('Start time must be before end time');
      return;
    }

    setLoading(true);
    try {
      const response = await saveAvailability({ 
        date: selectedDate, 
        startTime, 
        endTime 
      });
      
      // Update the local list from the API response (offline management)
      setSavedAvailabilities([...savedAvailabilities, {
        id: response.data.id,
        date: response.data.date,
        startTime: response.data.startTime,
        endTime: response.data.endTime
      }]);
      
      // Reset inputs
      setSelectedDate('');
      setStartTime('');
      setEndTime('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save availability');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLink = async () => {
    if (savedAvailabilities.length === 0) {
      setError('Save at least one availability slot first');
      return;
    }

    setLoading(true);
    try {
      const response = await generateLink();
      const link = `${window.location.origin}/book/${response.data.bookingLink}`;
      setBookingLink(link);
      setSavedAvailabilities([]); // Clear the list after generating
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate booking link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Define Your Availability</h1>
        <button onClick={handleLogout} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      {error && <p style={{ color: 'red', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px' }}>{error}</p>}
      
      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9' }}>
        <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Start Time:</label>
            <input 
              type="time" 
              value={startTime} 
              onChange={(e) => setStartTime(e.target.value)} 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>End Time:</label>
            <input 
              type="time" 
              value={endTime} 
              onChange={(e) => setEndTime(e.target.value)} 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
        </div>
        <button 
          onClick={handleSaveAvailability}
          disabled={loading}
          style={{ 
            width: '100%',
            padding: '10px', 
            cursor: loading ? 'not-allowed' : 'pointer', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Saving...' : 'Save Slot'}
        </button>
      </div>

      {savedAvailabilities.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Recently Saved Availabilities:</h3>
          <ul style={{ padding: 0, listStyle: 'none' }}>
            {savedAvailabilities.map((avail, index) => (
              <li key={index} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                <span><strong>Date:</strong> {avail.date}</span>
                <span><strong>Time:</strong> {formatTo12Hour(avail.startTime)} - {formatTo12Hour(avail.endTime)}</span>
              </li>
            ))}
          </ul>
          <button 
            onClick={handleGenerateLink}
            disabled={loading}
            style={{ 
              width: '100%',
              padding: '12px', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 'bold',
              marginTop: '10px'
            }}
          >
            {loading ? 'Generating...' : 'Generate Booking Link'}
          </button>
        </div>
      )}

      {bookingLink && (
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#e2f3f5', borderRadius: '8px', border: '1px solid #bee5eb' }}>
          <h3 style={{ marginTop: 0 }}>Your Booking Link:</h3>
          <p style={{ wordBreak: 'break-all', fontSize: '1.1rem', backgroundColor: 'white', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}>
            <a href={bookingLink} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>{bookingLink}</a>
          </p>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(bookingLink);
              alert('Link copied to clipboard!');
            }}
            style={{ padding: '8px 15px', cursor: 'pointer', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Copy Link
          </button>
        </div>
      )}
    </div>
  );
};

export default AvailabilityPage;
