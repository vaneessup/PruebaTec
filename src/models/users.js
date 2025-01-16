const pool = require('../bd/cnn');
const bcrypt = require('bcrypt'); 

const getAllUsers = async () => {
  const { rows } = await pool.query('SELECT * FROM users');
  return rows;
};

const getUserById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0];
};

// Función para crear un usuario
const createUser = async (name, email, password) => {
  // Verifica si el correo electrónico ya está en uso
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error('El correo electrónico ya está en uso');
  }

  // Hashea la contraseña antes de guardarla
  const hashedPassword = await bcrypt.hash(password, 10);

  // Inserta el usuario en la base de datos
  const { rows } = await pool.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
    [name, email, hashedPassword]
  );

  // Retorna el usuario creado
  return rows[0];
};

const getUserByEmail = async (email) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0];
};

// Actualizar un usuario
const updateUser = async (userId, { name, email, password }) => {
  let query = 'UPDATE users SET';
  const values = [];
  let setClause = [];

  if (name) {
    values.push(name);
    setClause.push(`name = $${values.length}`);
  }
  if (email) {
    values.push(email);
    setClause.push(`email = $${values.length}`);
  }
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    values.push(hashedPassword);
    setClause.push(`password = $${values.length}`);
  }

  if (setClause.length === 0) {
    throw new Error('No se proporcionaron campos para actualizar');
  }

  query += ` ${setClause.join(', ')} WHERE id = $${values.length + 1} RETURNING *`;
  values.push(userId);

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Eliminar un usuario
const deleteUser = async (userId) => {
  const { rows } = await pool.query(
    'DELETE FROM users WHERE id = $1 RETURNING *',
    [userId]
  );
  return rows[0];
};


module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  getUserByEmail,
  updateUser,
  deleteUser
};

