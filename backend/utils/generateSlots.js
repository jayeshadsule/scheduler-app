const generateSlots = (startTime, endTime) => {
  const slots = [];
  
  // startTime and endTime are in HH:mm:ss format
  const startParts = String(startTime).split(':');
  const endParts = String(endTime).split(':');
  
  if (startParts.length < 2 || endParts.length < 2) return [];

  let currentMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
  const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);

  while (currentMinutes < endMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;
    
    const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    slots.push(timeStr);
    
    currentMinutes += 30;
  }

  return slots;
};

module.exports = generateSlots;
