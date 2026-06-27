const db = require('../config/db');

const createBusTables = async () => {
  const createBusesQuery = `
    CREATE TABLE IF NOT EXISTS buses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      bus_name VARCHAR(255) NOT NULL,
      bus_number VARCHAR(50) NOT NULL UNIQUE,
      bus_type VARCHAR(100) NOT NULL,
      total_seats INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createRoutesQuery = `
    CREATE TABLE IF NOT EXISTS routes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      bus_id INT NOT NULL,
      source VARCHAR(100) NOT NULL,
      destination VARCHAR(100) NOT NULL,
      journey_date DATE NOT NULL,
      departure_time TIME NOT NULL,
      arrival_time TIME NOT NULL,
      fare DECIMAL(10, 2) NOT NULL,
      FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
    )
  `;

  try {
    await db.query(createBusesQuery);
    await db.query(createRoutesQuery);
    console.log('Buses and Routes tables ready');

    // Insert dummy data if empty
    const [buses] = await db.query('SELECT COUNT(*) as count FROM buses');
    if (buses[0].count === 0) {
      console.log('Inserting dummy bus data...');
      const insertBus1 = await db.query(
        'INSERT INTO buses (bus_name, bus_number, bus_type, total_seats) VALUES (?, ?, ?, ?)',
        ['Super Luxury', 'AP09 TA 1234', 'A/C Seater', 40]
      );
      const insertBus2 = await db.query(
        'INSERT INTO buses (bus_name, bus_number, bus_type, total_seats) VALUES (?, ?, ?, ?)',
        ['Garuda Plus', 'AP16 X 9876', 'A/C Sleeper', 30]
      );
      const insertBus3 = await db.query(
        'INSERT INTO buses (bus_name, bus_number, bus_type, total_seats) VALUES (?, ?, ?, ?)',
        ['Express', 'AP39 Z 5678', 'Non A/C Seater', 50]
      );

      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

      await db.query(
        'INSERT INTO routes (bus_id, source, destination, journey_date, departure_time, arrival_time, fare) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [insertBus1[0].insertId, 'Hyderabad', 'Vijayawada', today, '22:00:00', '05:00:00', 600.00]
      );
      await db.query(
        'INSERT INTO routes (bus_id, source, destination, journey_date, departure_time, arrival_time, fare) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [insertBus1[0].insertId, 'Hyderabad', 'Vijayawada', tomorrow, '22:00:00', '05:00:00', 600.00]
      );
      await db.query(
        'INSERT INTO routes (bus_id, source, destination, journey_date, departure_time, arrival_time, fare) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [insertBus2[0].insertId, 'Hyderabad', 'Vizag', today, '19:30:00', '08:00:00', 1200.00]
      );
      await db.query(
        'INSERT INTO routes (bus_id, source, destination, journey_date, departure_time, arrival_time, fare) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [insertBus3[0].insertId, 'Vijayawada', 'Tirupati', today, '18:00:00', '04:00:00', 450.00]
      );
      console.log('Dummy data inserted successfully');
    }
  } catch (error) {
    console.error('Error creating bus tables:', error);
  }
};

const getAllBuses = async () => {
  const query = `
    SELECT b.id as bus_id, b.bus_name, b.bus_number, b.bus_type, b.total_seats,
           r.id as route_id, r.source, r.destination, r.journey_date, r.departure_time, r.arrival_time, r.fare
    FROM routes r
    JOIN buses b ON r.bus_id = b.id
    ORDER BY r.journey_date ASC, r.departure_time ASC
  `;
  const [rows] = await db.query(query);
  return rows;
};

const searchBuses = async (source, destination, date) => {
  let query = `
    SELECT b.id as bus_id, b.bus_name, b.bus_number, b.bus_type, b.total_seats,
           r.id as route_id, r.source, r.destination, r.journey_date, r.departure_time, r.arrival_time, r.fare
    FROM routes r
    JOIN buses b ON r.bus_id = b.id
    WHERE 1=1
  `;
  const params = [];

  if (source) {
    query += ' AND r.source = ?';
    params.push(source);
  }
  if (destination) {
    query += ' AND r.destination = ?';
    params.push(destination);
  }
  if (date) {
    query += ' AND r.journey_date = ?';
    params.push(date);
  }

  query += ' ORDER BY r.departure_time ASC';

  const [rows] = await db.query(query, params);
  return rows;
};

const getBusById = async (route_id) => {
  const query = `
    SELECT b.id as bus_id, b.bus_name, b.bus_number, b.bus_type, b.total_seats,
           r.id as route_id, r.source, r.destination, r.journey_date, r.departure_time, r.arrival_time, r.fare
    FROM routes r
    JOIN buses b ON r.bus_id = b.id
    WHERE r.id = ?
  `;
  const [rows] = await db.query(query, [route_id]);
  return rows[0];
};

const createRoute = async (busData) => {
  const { bus_name, bus_number, bus_type, total_seats, source, destination, journey_date, departure_time, arrival_time, fare } = busData;
  
  // 1. Insert into buses table
  const [busResult] = await db.query(
    'INSERT INTO buses (bus_name, bus_number, bus_type, total_seats) VALUES (?, ?, ?, ?)',
    [bus_name, bus_number, bus_type, total_seats]
  );
  
  const bus_id = busResult.insertId;

  // 2. Insert into routes table
  const [routeResult] = await db.query(
    'INSERT INTO routes (bus_id, source, destination, journey_date, departure_time, arrival_time, fare) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [bus_id, source, destination, journey_date, departure_time, arrival_time, fare]
  );

  return routeResult.insertId;
};

const updateRoute = async (route_id, busData) => {
  const { bus_name, bus_number, bus_type, total_seats, source, destination, journey_date, departure_time, arrival_time, fare } = busData;
  
  // Get bus_id for this route
  const [rows] = await db.query('SELECT bus_id FROM routes WHERE id = ?', [route_id]);
  if (rows.length === 0) return false;
  const bus_id = rows[0].bus_id;

  // Update bus
  await db.query(
    'UPDATE buses SET bus_name = ?, bus_number = ?, bus_type = ?, total_seats = ? WHERE id = ?',
    [bus_name, bus_number, bus_type, total_seats, bus_id]
  );

  // Update route
  await db.query(
    'UPDATE routes SET source = ?, destination = ?, journey_date = ?, departure_time = ?, arrival_time = ?, fare = ? WHERE id = ?',
    [source, destination, journey_date, departure_time, arrival_time, fare, route_id]
  );

  return true;
};

const deleteRoute = async (route_id) => {
  const [result] = await db.query('DELETE FROM routes WHERE id = ?', [route_id]);
  return result.affectedRows > 0;
};

module.exports = {
  createBusTables,
  getAllBuses,
  searchBuses,
  getBusById,
  createRoute,
  updateRoute,
  deleteRoute
};
