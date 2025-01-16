const { ApolloServer } = require('apollo-server');
const jwt = require('jsonwebtoken');
const typeDefs = require('./src/schemas/typeDefs');
const resolvers = require('./src/resolvers/resolvers');
const key = "1234"; // Asegúrate de que tu clave esté en un entorno seguro (evita usar valores en hardcode)

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
});

server.listen().then(({ url }) => {
  console.log(`🚀 Servidor corriendo en ${url}`);
});
