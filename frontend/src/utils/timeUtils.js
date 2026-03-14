export const formatTo12Hour = (time24h) => {
  if (!time24h) return '';
  const [hours, minutes] = time24h.split(':');
  let h = parseInt(hours);
  const m = minutes;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
};
