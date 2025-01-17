// db/cnn.js
const { Pool } = require('pg');

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: 'postgres', // Usuario
  host: 'localhost',
  database: 'users_bd', // Base de datos
  password: '1234', // Contraseña
  port: 5432, // Puerto
});

module.exports = pool;
