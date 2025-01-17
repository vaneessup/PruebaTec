
const { getAllPosts, getPostById, createPost, updatePost, deletePost } = require('../models/posts');

const postResolvers = {
  Query: {
    posts: async (_, __, context) => {
      if (!context.userId) {
        throw new Error('No autorizado');
      }

      try {
        return await getAllPosts();
      } catch (err) {
        throw new Error('Error al obtener los posts');
      }
    },

    post: async (_, { id }, context) => {
      if (!context.userId) {
        throw new Error('No autorizado');
      }

      try {
        const post = await getPostById(id);
        if (!post) {
          throw new Error('Post no encontrado');
        }
        return post;
      } catch (err) {
        throw new Error('Error interno al obtener el post');
      }
    },
  },

  Mutation: {
    createPost: async (_, { title, content }, context) => {
      if (!context.userId) {
        throw new Error('No autorizado');
      }

      try {
        return await createPost(context.userId, title, content);
      } catch (err) {
        throw new Error('Error al crear el post');
      }
    },

    updatePost: async (_, { userId, postId, title, content }, context) => {
      const idContext = parseInt(context.userId, 10);
      const idUser = parseInt(userId, 10);

      if (!idContext || idContext !== idUser) {
        throw new Error('No autorizado');
      }

      try {
        const updatedPost = await updatePost(userId, postId, title, content);

        if (!updatedPost) {
          throw new Error('Post no encontrado o no autorizado para actualizar');
        }
        return updatedPost;
      } catch (err) {
        throw new Error('Error al actualizar el post');
      }
    },

    deletePost: async (_, { userId, postId }, context) => {
      const idContext = parseInt(context.userId, 10);
      const idUser = parseInt(userId, 10);

      if (!idContext || idContext !== idUser) {
        throw new Error('No autorizado');
      }

      try {
        const deletedPost = await deletePost(userId, postId);
        if (!deletedPost) {
          throw new Error('Post no encontrado o no autorizado para eliminar');
        }
        return deletedPost;
      } catch (err) {
        throw new Error('Error al eliminar el post');
      }
    },
  },
};

module.exports = postResolvers;
