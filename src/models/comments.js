const pool = require('../bd/cnn');

const getCommentsByPostId = async (postId) => {
  const { rows } = await pool.query('SELECT * FROM comments WHERE post_id = $1', [postId]);
  return rows;
};

const createComment = async (postId, userId, text) => {
    try {
      const { rows } = await pool.query(
        'INSERT INTO comments (post_id, user_id, text) VALUES ($1, $2, $3) RETURNING *',
        [postId, userId, text]
      );
      return rows[0]; // Retorna el comentario creado
    } catch (err) {
      throw new Error('Error al crear el comentario');
    }
  };

const updateComment = async (commentId, userId, newText) => {
try {
    const { rows } = await pool.query(
    'UPDATE comments SET text = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *',
    [newText, commentId, userId]
    );
    if (rows.length === 0) {
    throw new Error('Comentario no encontrado o no autorizado para modificar');
    }
    return rows[0]; // Retorna el comentario actualizado
} catch (err) {
    throw new Error('Error al actualizar el comentario');
}
};

const deleteComments = async (commentId, userId, postId) => {
try {
    // Verificar si el comentario pertenece al post y al usuario
    const { rows } = await pool.query(
    'SELECT * FROM comments WHERE id = $1 AND post_id = $2 AND user_id = $3',
    [commentId, postId, userId]
    );

    if (rows.length === 0) {
    throw new Error('Comentario no encontrado o no autorizado para eliminarlo');
    }

    // Eliminar el comentario si pasa la validación
    const { rowCount } = await pool.query(
    'DELETE FROM comments WHERE id = $1 RETURNING *',
    [commentId]
    );

    if (rowCount === 0) {
    throw new Error('Error al eliminar el comentario');
    }

    return rows[0]; // Devolver el comentario eliminado
} catch (err) {
    throw new Error('Error en el proceso de eliminación del comentario');
}
};

  
module.exports = {
  getCommentsByPostId,
  createComment,
  updateComment,
  deleteComments
};
