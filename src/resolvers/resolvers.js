const { getAllUsers, getUserById, createUser, getUserByEmail, deleteUser, updateUser } = require('../models/users');
const { getAllPosts, getPostById, createPost, updatePost, deletePost } = require('../models/posts');
const { getCommentsByPostId, createComment, updateComment, deleteComments } = require('../models/comments');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const key = "1234";

const resolvers = {
  Query: {
    users: async () => {
      try {
        return await getAllUsers();
      } catch (err) {
        throw new Error('Error al obtener los usuarios');
      }
    },
    user: async (_, { id }, context) => {
      if (!context.userId) {
        throw new Error('No autorizado');
      }

      try {
        const user = await getUserById(id);
        if (!user) {
          throw new Error('Usuario no encontrado');
        }
        return user;
      } catch (err) {
        throw new Error('Error interno al obtener el usuario');
      }
    },
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
    createUser: async (_, { name, email, password }) => {
      try {
        return await createUser(name, email, password);
      } catch (err) {
        console.log(err)
        throw new Error('Error al crear el usuario', err);
      }
    
    },

    updateUser: async (_, { userId, name, email, password }, context) => {
      // Verificar si el usuario está autenticado
      const idContext = parseInt(context.userId, 10);
      const idUser = parseInt(userId, 10);
      console.log(idContext, idUser, 'idd')

      if (!idContext|| idContext !== idUser) {
        throw new Error('No autorizado');
      }

      try {
        const updatedUser = await updateUser(userId, { name, email, password });
        if (!updatedUser) {
          throw new Error('Usuario no encontrado o no autorizado para actualizar');
        }
        return updatedUser;
      } catch (err) {
        throw new Error('Error al actualizar el usuario');
      }
    },

    deleteUser: async (_, { userId }, context) => {
      // Verificar si el usuario está autenticado
      const idContext = parseInt(context.userId, 10);
      const idUser = parseInt(userId, 10);
      console.log(idContext, idUser, 'idd')
      if (!idContext || idContext !== idUser) {
        throw new Error('No autorizado');
      }

      try {
        const deletedUser = await deleteUser(userId);
        if (!deletedUser) {
          throw new Error('Usuario no encontrado o no autorizado para eliminar');
        }
        return deletedUser;
      } catch (err) {
        throw new Error('Error al eliminar el usuario');
      }
    },

    // Crear un comentario
    createComment: async (_, { postId, text }, context) => {
      // Verificar si el usuario está autenticado
      if (!context.userId) {
        throw new Error('No autorizado');
      }

      try {
        // Llama a la función de crear comentario
        const newComment = await createComment(postId, context.userId, text);
        return newComment; // Retorna el comentario creado
      } catch (err) {
        throw new Error('Error al crear el comentario');
      }
    },
    //update
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
    // Eliminar un comentario
    deleteComment: async (_, { commentId, userId, postId }, context) => {
      if (!context.userId) {
        throw new Error('No autorizado');
      }

      try {
        const deletedComment = await deleteComments(commentId, userId, postId);
        return deletedComment; // Puedes devolver el comentario eliminado si lo deseas
      } catch (err) {
        console.log(err)
        throw new Error('Error al eliminar el comentario');
      }
    },
    //login
    login: async (_, { email, password }) => {
      try {
        const user = await getUserByEmail(email);

        if (!user) {
          throw new Error('Usuario no encontrado');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error('Contraseña incorrecta');
        }

        const token = jwt.sign({ userId: user.id }, key, { expiresIn: '1h' });
        return { token, user };
      } catch (err) {
        throw new Error('Error en el proceso de login');
      }
    },

    //POST
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
        console.log(err, 'erroreees')
        throw new Error('Error al actualizar el post');
      }
    },

    deletePost: async (_, { userId, postId }, context) => {
      // Verificar si el usuario está autenticado
      const idContext = parseInt(context.userId, 10);
      const idUser = parseInt(userId, 10);
      console.log(idContext, idUser, 'iddd')
      
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
    
    
  },

};

module.exports = resolvers;
