// userResolvers.js
const { getAllUsers, getUserById, createUser, getUserByEmail, deleteUser, updateUser } = require('../../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { handleError, GraphQLErrorWithCode } = require('../../errors');

const key = "1234";

const userResolvers = {
  Query: {
    users: async () => {
      try {
        return await getAllUsers();
      } catch (err) {
        throw handleError('Error al obtener los usuarios', '500'); // Lanza el error correctamente
      }
    },
    
    user: async (_, { id }, context) => {
      if (!context.userId) {
        throw handleError('No Autorizado', '401');
      }

      try {
        const user = await getUserById(id);
        if (!user) {
          throw handleError('Usuario no encontrado', '404');
        }
        return user;
      } catch (err) {
        throw handleError('Usuario no encontrado', '404');
      }
    },
  },

  Mutation: {
    createUser: async (_, { name, email, password }) => {
      try {
        if (!name || !email || !password) {
          throw handleError('Todos los campos son obligatorios', '422'); // Llama a handleError directamente
        }
    
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
          throw handleError('El correo ya está registrado', '422'); // Llama a handleError directamente
        }
    
        return await createUser(name, email, password);
      } catch (err) {
        console.log(err, 'error')
        throw new GraphQLErrorWithCode('Error al crear el usuario', '422'); // Asegúrate de que se lanza un error genérico en el catch
      }
    },
    

    updateUser: async (_, { userId, name, email, password }, context) => {
      const idContext = parseInt(context?.userId, 10);
      const idUser = parseInt(userId, 10);

      if (!idContext || idContext !== idUser) {
        throw handleError('No Autorizado', '401');
      }

      try {
        if (!name || !email) {
          throw handleError('Nombre y correo son obligatorios', '422');
        }

        const updatedUser = await updateUser(userId, { name, email, password });
        if (!updatedUser) {
          throw handleError('Usuario no encontrado o no autorizado para actualizar', '404');
        }
        return updatedUser;
      } catch (err) {
        throw handleError('Error al actualizar el usuario', '422');
      }
    },

    deleteUser: async (_, { userId }, context) => {
      const idContext = parseInt(context?.userId, 10);
      const idUser = parseInt(userId, 10);

      if (!idContext || idContext !== idUser) {
        throw handleError('No Autorizado', '401');
      }

      try {
        const deletedUser = await deleteUser(userId);
        if (!deletedUser) {
          throw handleError('Usuario no encontrado o no autorizado para eliminar', '404');
        }
        return deletedUser;
      } catch (err) {
        throw handleError('Error al eliminar el usuario', '404');
      }
    },

    login: async (_, { email, password }) => {
      try {
        if (!email || !password) {
          throw handleError('Correo y contraseña son obligatorios', '422');
        }

        const user = await getUserByEmail(email);
        if (!user) {
          throw handleError('Usuario no encontrado', '404');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw handleError('Contraseña incorrecta', '401');
        }

        const token = jwt.sign({ userId: user.id }, key, { expiresIn: '1h' });
        return { token, user };
      } catch (err) {
        console.log(err, 'errror')
        throw handleError('Error en el proceso de login', '500');
      }
    },
  },
};

module.exports = userResolvers;
