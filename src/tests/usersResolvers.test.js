const userResolvers = require('../resolvers/usersResolvers');
const { getAllUsers, getUserById, createUser, updateUser, deleteUser, getUserByEmail } = require('../models/users');
const { GraphQLErrorWithCode } = require('../errors');


// Mockear las funciones del modelo
jest.mock('../models/users');

describe('User Resolvers', () => {
  describe('Query: users', () => {
    it('should return a list of users', async () => {
      // Definir el valor que devolverá el mock
      getAllUsers.mockResolvedValue([
        { id: '1', name: 'Yeymi Ramirez', email: 'yeymii@example.com' },
        { id: '2', name: 'Kevin Payes', email: 'kevPayes@example.com' },
      ]);

      const result = await userResolvers.Query.users();

      expect(result).toEqual([
        { id: '1', name: 'Yeymi Ramirez', email: 'yeymii@example.com' },
        { id: '2', name: 'Kevin Payes', email: 'kevPayes@example.com' },
      ]);
      expect(getAllUsers).toHaveBeenCalledTimes(1); // Verificar que la función se haya llamado una vez
    });

    it('should throw an error if fetching users fails', async () => {
        getAllUsers.mockRejectedValue(new Error('Database error'));
    
        try {
          await userResolvers.Query.users();
        } catch (err) {
          expect(err.message).toBe('Error al obtener los usuarios');
          expect(err.code).toBe('500');
        }
      });
      
  });

  describe('Querys: user', () => {
    it('return a user when logged in', async () => {
        const mockUser = { id: '8', name: 'Kevin Payes', email: 'payesKev@gmail.com' };

        // Mockear la función para que devuelva un usuario
        getUserById.mockResolvedValue(mockUser);

        // Simular que el usuario está autenticado y tiene un userId en el contexto
        const context = {
            userId: '8',  // El ID del usuario autenticado
        };

        // Llamar al resolver con el contexto de usuario logueado
        const result = await userResolvers.Query.user(null, { id: '8' }, context);

        expect(result).toEqual(mockUser); // Verificar que se ha retornado el usuario correcto
        expect(getUserById).toHaveBeenCalledWith('8'); // Verificar que la función de obtener el usuario fue llamada con el ID correcto
    });

    it('error if user is not authenticated', async () => {
    const context = {}; // No hay userId en el contexto, lo que indica que no hay autenticación

    try {
        await userResolvers.Query.user(null, { id: '8' }, context);
    } catch (err) {
        expect(err.message).toBe('No Autorizado'); // Error esperado si no hay autenticación
    }
    });

    it('should throw an error if the user is not found.', async () => {
        const context = { userId: '1' }; // Usuario autenticado
        const mockUser = null; // Simulamos que el usuario no existe
        getUserById.mockResolvedValue(mockUser); // Mock de getUserById
        
        try {
            await userResolvers.Query.user(null, { id: '1' }, context);
        } catch (err) {
            // Verificamos que se haya lanzado un error con el mensaje y código esperado
            expect(err.message).toBe('Usuario no encontrado');
            expect(err.code).toBe('404'); // Asegúrate de que el código sea el esperado
        }
    });

    it('should throw an error if required fields are missing', async () => {
        try {
          await userResolvers.Mutation.createUser(null, { email: 'yeymii@example.com', password: 'password123' });
        } catch (err) {
          expect(err.message).toBe('Error al crear el usuario');
          expect(err.code).toBe('422');
        }
    }); 

  });

  describe('Mutation: createUser', () => {
    it('should create a new user', async () => {
      const mockUser = { id: '1', name: 'Yeymi Ramirez', email: 'yeymii@example.com' };
      createUser.mockResolvedValue(mockUser);

      const result = await userResolvers.Mutation.createUser(null, {
        name: 'Yeymi Ramirez',
        email: 'yeymii@example.com',
        password: 'password123',
      });

      expect(result).toEqual(mockUser);
      expect(createUser).toHaveBeenCalledWith('Yeymi Ramirez', 'yeymii@example.com', 'password123');
    });

    it('should throw an error if user creation fails', async () => {
      createUser.mockRejectedValue(new Error('Error al crear el usuario'));

      try {
        await userResolvers.Mutation.createUser(null, {
          name: 'Yeymi Ramirez',
          email: 'yeymii@example.com',
          password: 'password123',
        });
      } catch (err) {
        expect(err.message).toBe('Error al crear el usuario');
      }
    });

    it('should throw an error if the email is already registered', async () => {
        const existingUser = { id: '1', name: 'Yeymi Ramirez', email: 'yeymii@example.com' };
        getUserByEmail.mockResolvedValue(existingUser);  // Verifica que el mock esté devolviendo este usuario correctamente
      
        try {
          await userResolvers.Mutation.createUser(null, { name: 'Yeymi', email: 'yeymii@example.com', password: 'password123' });
        } catch (err) {
          expect(err.code).toBe('422');  // Verifica que el código sea 422
        }
      });
      
  });

  describe('Mutation: updateUser', () => {
    it('should update a user', async () => {
        const mockUser = { id: '1', name: 'Yeymi Ramirez', email: 'yeymii@example.com' };
        updateUser.mockResolvedValue(mockUser);
    
        const context = { userId: '1' }; // Simula que el usuario está autenticado
    
        const result = await userResolvers.Mutation.updateUser(
        null,
        {
            userId: '1',
            name: 'Yeymi Ramirez',
            email: 'yeymii@example.com',
            password: 'newPassword123',
        },
        context
        );
    
        expect(result).toEqual(mockUser);
        expect(updateUser).toHaveBeenCalledWith('1', {
        name: 'Yeymi Ramirez',
        email: 'yeymii@example.com',
        password: 'newPassword123',
        });
    });

    it('should throw an error if user is not authorized', async () => {
    const context = { userId: '2' }; // El usuario no está autorizado (userId no coincide)
    let error;

    try {
        // Ejecuta el resolver
        await userResolvers.Mutation.updateUser(
        null,
        {
            userId: '1',
            name: 'Yeymi Ramirez',
            email: 'yeymii@example.com',
            password: 'newPassword123',
        },
        context
        );
    } catch (err) {
        // Captura el error
        error = err;
    }

    // Verifica que se lanzó el error correcto
    expect(error).toBeInstanceOf(GraphQLErrorWithCode);
    expect(error.message).toBe('No Autorizado');
    expect(error.code).toBe('401');
    });

    it('should throw an error if required fields for update are missing', async () => {
        const context = { userId: '1' };
        
        try {
            await userResolvers.Mutation.updateUser(null, { userId: '1', email: 'yeymii@example.com' }, context);
        } catch (err) {
            expect(err.code).toBe('422');
        }
    });

    it('should throw an error if the user to update is not found', async () => {
        updateUser.mockResolvedValue(null);
        const context = { userId: '1' };
      
        try {
          await userResolvers.Mutation.updateUser(
            null,
            { userId: '1', name: 'New Name', email: 'new@example.com', password: 'password123' },
            context
          );
        } catch (err) {
          expect(err.code).toBe('422');
        }
    });
           
  });

  describe('Mutation: deleteUser', () => {
    it('should delete a user', async () => {
      const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };
      const context = { userId: '1' }; // Asegúrate de incluir el userId adecuado en el contexto
      deleteUser.mockResolvedValue(mockUser);
  
      const result = await userResolvers.Mutation.deleteUser(null, { userId: '1' }, context);
  
      expect(result).toEqual(mockUser);
      expect(deleteUser).toHaveBeenCalledWith('1');
    });

    it('should throw an error if the user to delete is not found', async () => {
        deleteUser.mockResolvedValue(null);
        const context = { userId: '1' };
      
        try {
          await userResolvers.Mutation.deleteUser(null, { userId: '1' }, context);
        } catch (err) {
          expect(err.code).toBe('404');
        }
    });

    it('should throw an error if user is not authorized to delete', async () => {
        const context = { userId: '2' };
      
        try {
          await userResolvers.Mutation.deleteUser(null, { userId: '1' }, context);
        } catch (err) {
          expect(err.message).toBe('No Autorizado');
          expect(err.code).toBe('401');
        }
    });
           
  });
  
});
