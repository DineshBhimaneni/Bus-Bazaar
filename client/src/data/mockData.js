export const mockLocations = ['Hyderabad', 'Vijayawada', 'Visakhapatnam', 'Tirupati', 'Bangalore', 'Chennai'];

export const mockBuses = [
  {
    id: 1,
    operator: 'APSRTC Garuda Plus',
    type: 'Volvo A/C Semi Sleeper',
    departureTime: '22:30',
    arrivalTime: '06:15',
    duration: '07h 45m',
    price: 850,
    rating: 4.5,
    seatsAvailable: 24,
    from: 'Hyderabad',
    to: 'Vijayawada'
  },
  {
    id: 2,
    operator: 'Orange Travels',
    type: 'A/C Sleeper (2+1)',
    departureTime: '21:00',
    arrivalTime: '05:00',
    duration: '08h 00m',
    price: 1200,
    rating: 4.8,
    seatsAvailable: 12,
    from: 'Hyderabad',
    to: 'Vijayawada'
  },
  {
    id: 3,
    operator: 'APSRTC Super Luxury',
    type: 'Non-A/C Seater',
    departureTime: '09:00',
    arrivalTime: '16:30',
    duration: '07h 30m',
    price: 450,
    rating: 4.1,
    seatsAvailable: 35,
    from: 'Hyderabad',
    to: 'Vijayawada'
  }
];

// Generate 40 seats (10 rows, 4 columns)
export const mockSeats = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  number: `${Math.floor(i / 4) + 1}${String.fromCharCode(65 + (i % 4))}`, // 1A, 1B, 1C, 1D etc.
  status: Math.random() > 0.7 ? 'booked' : 'available', // randomly book ~30% of seats
}));
