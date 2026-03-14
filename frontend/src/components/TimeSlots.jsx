import React from 'react';
import { formatTo12Hour } from '../utils/timeUtils';

const TimeSlots = ({ slots, selectedSlot, setSelectedSlot }) => {
  if (!slots || slots.length === 0) {
    return <p>No slots defined for this date.</p>;
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
      {slots.map((slotObj) => {
        const { time, isBooked } = slotObj;
        const isSelected = selectedSlot === time;

        return (
          <button
            key={time}
            disabled={isBooked}
            onClick={() => setSelectedSlot(time)}
            title={isBooked ? "This slot is already booked" : "Click to select"}
            style={{
              padding: '10px 20px',
              borderRadius: '20px',
              border: '1px solid #007bff',
              backgroundColor: isBooked ? '#f8f9fa' : (isSelected ? '#007bff' : 'white'),
              color: isBooked ? '#6c757d' : (isSelected ? 'white' : '#007bff'),
              cursor: isBooked ? 'not-allowed' : 'pointer',
              transition: '0.3s',
              fontWeight: '500',
              opacity: isBooked ? 0.7 : 1,
              textDecoration: isBooked ? 'line-through' : 'none'
            }}
          >
            {formatTo12Hour(time)}
            {isBooked && <span style={{ display: 'block', fontSize: '10px', marginTop: '2px' }}>Booked</span>}
          </button>
        );
      })}
    </div>
  );
};

export default TimeSlots;
