const { Pool } = require('pg');
require('dotenv').config(); // Cargar las variables de entorno

const pool = new Pool({
  user: process.env.DB_USER,      // Usuario de la base de datos
  host: process.env.DB_HOST,      // Dirección del contenedor de la base de datos
  database: process.env.DB_NAME,  // Nombre de la base de datos
  password: process.env.DB_PASSWORD, // Contraseña de la base de datos
  port: process.env.DB_PORT,      // Puerto de conexión a PostgreSQL
});


//PARA VERIFICAR CONEXIÓN A LA BD
pool.connect()
  .then(client => {
    console.log('Conexión a la base de datos exitosa');
    client.release(); // Importante liberar el cliente después de verificar la conexión
  })
  .catch(err => {
    console.error('Error de conexión a la base de datos:', err.stack);
  });

module.exports = pool;
