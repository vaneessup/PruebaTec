class GraphQLErrorWithCode extends Error {
    constructor(message, code = '500') {
      super(message);
      this.code = code;  // Código HTTP del error
      this.name = this.constructor.name;
    }
  }
  
  function handleError(message, code) {
    throw new GraphQLErrorWithCode(message, code);
  }
  
  // Asegúrate de que ambas, la clase y la función, estén correctamente exportadas
  module.exports = { handleError, GraphQLErrorWithCode };
  