
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
        console.error(err); // Para poder depurar si es necesario
        throw new Error('Error al obtener los posts');
      }
    },

    post: async (_, { id }, context) => {
      if (!context.userId) {
        throw new Error('No autorizado');
      }

      try {
        if (!id || isNaN(id)) {
          throw new Error('ID de post inválido');
        }
        const post = await getPostById(id);
        if (!post) {
          throw new Error('Post no encontrado');
        }
        return post;
      } catch (err) {
        console.error(err); // Para depurar
        throw new Error('Post no encontrado');
      }
    },
  },

  Mutation: {
    createPost: async (_, { title, content }, context) => {
      if (!context.userId) {
        throw new Error('No autorizado');
      }

      if (!title || !content) {
        throw new Error('El título y el contenido son obligatorios');
      }

      try {
        return await createPost(context.userId, title, content);
      } catch (err) {
        console.error(err);
        throw new Error('Error al crear el post');
      }
    },

    updatePost: async (_, { userId, postId, title, content }, context) => {
      const idContext = parseInt(context.userId, 10);
      const idUser = parseInt(userId, 10);

      if (!idContext || idContext !== idUser) {
        throw new Error('No autorizado');
      }

      if (!title || !content) {
        throw new Error('El título y el contenido son obligatorios');
      }

      try {
        const updatedPost = await updatePost(userId, postId, title, content);

        if (!updatedPost) {
          throw new Error('Post no encontrado o no autorizado para actualizar');
        }
        return updatedPost;
      } catch (err) {
        console.error(err);
         throw new Error('Post no encontrado o no autorizado para actualizar');
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
        console.error(err);
        throw new Error('Post no encontrado o no autorizado para eliminar');
      }
    },
  },
};

module.exports = postResolvers;
