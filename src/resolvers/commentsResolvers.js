
const { getCommentsByPostId, createComment, updateComment, deleteComments } = require('../models/comments');

const commentResolvers = {
  Query: {
    comments: async (_, { postId }, context) => {
      if (!context.userId) {
        throw new Error('No autorizado');
      }

      try {
        return await getCommentsByPostId(postId);
      } catch (err) {
        throw new Error('Error al obtener los comentarios');
      }
    },
  },

  Mutation: {
    createComment: async (_, { postId, text }, context) => {
      if (!context.userId) {
        throw new Error('No autorizado');
      }

      try {
        const newComment = await createComment(postId, context.userId, text);
        return newComment; // Retorna el comentario creado
      } catch (err) {
        throw new Error('Error al crear el comentario');
      }
    },

    updateComment: async (_, { commentId, text }, context) => {
      if (!context.userId) {
        throw new Error('No autorizado');
      }

      try {
        const updatedComment = await updateComment(commentId, context.userId, text);
        return updatedComment; // Retorna el comentario actualizado
      } catch (err) {
        throw new Error('Error al actualizar el comentario');
      }
    },

    deleteComment: async (_, { commentId, userId, postId }, context) => {
      if (!context.userId) {
        throw new Error('No autorizado');
      }

      try {
        const deletedComment = await deleteComments(commentId, userId, postId);
        return deletedComment; // Puedes devolver el comentario eliminado si lo deseas
      } catch (err) {
        console.log(err);
        throw new Error('Error al eliminar el comentario');
      }
    },
  },
};

module.exports = commentResolvers;
