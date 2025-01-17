const { ApolloServer } = require('apollo-server');
const jwt = require('jsonwebtoken');
const { exec } = require('child_process');  // Importamos el módulo para ejecutar comandos
const typeDefs = require('./src/schemas/typeDefs');
const resolvers = require('./src/resolvers/resolvers');
const { GraphQLErrorWithCode } = require('./src/errors'); 
const key = "1234"; // Asegúrate de que tu clave esté en un entorno seguro (evita usar valores en hardcode)

// Ejecutar el comando de Liquibase
exec('liquibase --changeLogFile=db.changelog-master.xml update', (err, stdout, stderr) => {
  if (err) {
    console.error(`Error ejecutando Liquibase: ${err.message}`);
    return;
  }
  if (stderr) {
    return;
  }
});

const server = new ApolloServer({
  typeDefs,
  resolvers,

  
  context: ({ req }) => {
    // Obtener el token de las cabeceras de la solicitud
    const token = req.headers.authorization || '';
    
    if (token) {
      try {
        // Verificar el token JWT
        const decoded = jwt.verify(token, key);
        // Si es válido, devolver el userId decodificado para usarlo en los resolvers
        return { userId: decoded.userId };
      } catch (err) {
        throw new Error('No autorizado: El token es inválido o ha expirado');
      }
    }
    return {}; // Si no hay token, no proporcionamos un userId
  },
  formatError: (err) => {
    // Verificar si el error es de tipo GraphQLErrorWithCode
    if (err.originalError instanceof GraphQLErrorWithCode) {

      return {
        message: err.message,
        code: err.originalError.code, // El código de error HTTP que has asignado
        status: err.originalError.code === '404' ? 'Not Found' : 'Internal Server Error', // Puedes personalizar más
        timestamp: new Date().toISOString(), // Puedes agregar la hora del error si lo necesitas
      };
    }
    return err;
  },
});



server.listen().then(({ url }) => {
  console.log(`🚀 Servidor corriendo en ${url}`);
});
