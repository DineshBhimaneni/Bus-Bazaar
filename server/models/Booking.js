const db = require('../config/db');

const createBookingsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      bus_id INT NOT NULL,
      route_id INT NOT NULL,
      seat_numbers VARCHAR(255) NOT NULL,
      passenger_name VARCHAR(255) NOT NULL,
      passenger_age INT NOT NULL,
      passenger_gender VARCHAR(20) NOT NULL,
      passenger_email VARCHAR(255) NOT NULL,
      passenger_phone VARCHAR(20) NOT NULL,
      total_fare DECIMAL(10, 2) NOT NULL,
      status ENUM('Confirmed', 'Cancelled', 'Completed') DEFAULT 'Confirmed',
      booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
      FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
    )
  `;
  try {
    await db.query(query);
    console.log('Bookings table ready');
  } catch (error) {
    console.error('Error creating bookings table:', error);
  }
};

const createBooking = async ({
  user_id, bus_id, route_id, seat_numbers,
  passenger_name, passenger_age, passenger_gender,
  passenger_email, passenger_phone, total_fare
}) => {
  const [result] = await db.query(
    `INSERT INTO bookings 
     (user_id, bus_id, route_id, seat_numbers, passenger_name, passenger_age, passenger_gender, passenger_email, passenger_phone, total_fare)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [user_id, bus_id, route_id, seat_numbers, passenger_name, passenger_age, passenger_gender, passenger_email, passenger_phone, total_fare]
  );
  return result.insertId;
};

const getBookingsByUser = async (user_id) => {
  const [rows] = await db.query(
    `SELECT bk.id, bk.seat_numbers, bk.passenger_name, bk.passenger_email, bk.passenger_phone,
            bk.total_fare, bk.status, bk.booked_at,
            b.bus_name, b.bus_number, b.bus_type,
            r.source, r.destination, r.journey_date, r.departure_time, r.arrival_time, r.fare
     FROM bookings bk
     JOIN buses b ON bk.bus_id = b.id
     JOIN routes r ON bk.route_id = r.id
     WHERE bk.user_id = ?
     ORDER BY bk.booked_at DESC`,
    [user_id]
  );
  return rows;
};

const getBookingById = async (booking_id) => {
  const [rows] = await db.query(
    `SELECT bk.id, bk.seat_numbers, bk.passenger_name, bk.passenger_age, bk.passenger_gender,
            bk.passenger_email, bk.passenger_phone, bk.total_fare, bk.status, bk.booked_at,
            b.bus_name, b.bus_number, b.bus_type,
            r.source, r.destination, r.journey_date, r.departure_time, r.arrival_time, r.fare
     FROM bookings bk
     JOIN buses b ON bk.bus_id = b.id
     JOIN routes r ON bk.route_id = r.id
     WHERE bk.id = ?`,
    [booking_id]
  );
  return rows[0];
};

const cancelBooking = async (booking_id, user_id) => {
  const [result] = await db.query(
    `UPDATE bookings SET status = 'Cancelled' 
     WHERE id = ? AND user_id = ? AND status IN ('Confirmed', 'Booked')`,
    [booking_id, user_id]
  );
  return result.affectedRows > 0;
};

// Admin function to get all bookings
const getAllBookings = async () => {
  const [rows] = await db.query(
    `SELECT b.id, b.status, b.seat_numbers, b.passenger_name, b.total_fare, b.booked_at,
            r.source, r.destination, r.journey_date, r.departure_time, r.arrival_time,
            bus.bus_name, bus.bus_type, u.name as user_name, u.email as user_email
     FROM bookings b
     JOIN routes r ON b.route_id = r.id
     JOIN buses bus ON b.bus_id = bus.id
     JOIN users u ON b.user_id = u.id
     ORDER BY b.booked_at DESC`
  );
  return rows;
};

const getBookedSeats = async (route_id) => {
  const [rows] = await db.query(
    `SELECT seat_numbers FROM bookings 
     WHERE route_id = ? AND status != 'Cancelled'`,
    [route_id]
  );
  // Flatten all seat numbers into one array
  const bookedSeats = [];
  rows.forEach(row => {
    const seats = row.seat_numbers.split(',').map(s => s.trim());
    bookedSeats.push(...seats);
  });
  return bookedSeats;
};

module.exports = {
  createBookingsTable,
  createBooking,
  getBookingsByUser,
  getBookingById,
  cancelBooking,
  getBookedSeats,
  getAllBookings
};
