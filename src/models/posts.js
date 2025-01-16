const pool = require('../bd/cnn');

const getAllPosts = async () => {
  const { rows } = await pool.query('SELECT * FROM posts');
  return rows;
};

const getPostById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
  return rows[0];
};

const createPost = async (userId, title, content) => {
  const { rows } = await pool.query(
    'INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
    [userId, title, content]
  );
  return rows[0];
};


const deletePost = async (userId, postId) => {
    const { rows } = await pool.query(
      'DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING *',
      [postId, userId]
    );
  
    return rows[0]; // Devuelve el post eliminado si se encontró
  };
  

const updatePost = async (userId, postId, title, content) => {

    const { rows } = await pool.query(
        'UPDATE posts SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 AND user_id = $4 RETURNING *',
        [title, content, postId, userId]
);

return rows[0]; // Devuelve el post actualizado si se encuentra
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  deletePost,
  updatePost
};
