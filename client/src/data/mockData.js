// Generate 40 seats (10 rows, 4 columns)
export const mockSeats = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  number: `${Math.floor(i / 4) + 1}${String.fromCharCode(65 + (i % 4))}`, // 1A, 1B, 1C, 1D etc.
  status: Math.random() > 0.7 ? 'booked' : 'available', // randomly book ~30% of seats
}));
