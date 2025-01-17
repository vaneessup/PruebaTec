// userResolvers.js
const { getAllUsers, getUserById, createUser, getUserByEmail, deleteUser, updateUser } = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const key = "1234";

const userResolvers = {
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
  },

  Mutation: {
    createUser: async (_, { name, email, password }) => {
      try {
        return await createUser(name, email, password);
      } catch (err) {
        console.log(err);
        throw new Error('Error al crear el usuario');
      }
    },

    updateUser: async (_, { userId, name, email, password }, context) => {
      const idContext = parseInt(context.userId, 10);
      const idUser = parseInt(userId, 10);

      if (!idContext || idContext !== idUser) {
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
      const idContext = parseInt(context.userId, 10);
      const idUser = parseInt(userId, 10);

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
        console.log(err, 'errorr')
        throw new Error('Error en el proceso de login');
      }
    },
  },
};

module.exports = userResolvers;
