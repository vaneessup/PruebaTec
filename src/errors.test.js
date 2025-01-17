const { handleError, GraphQLErrorWithCode } = require('../src/errors');

describe('GraphQLErrorWithCode', () => {
  test('should create an instance of GraphQLErrorWithCode with a message and default code', () => {
    const error = new GraphQLErrorWithCode('An error occurred');
    
    expect(error).toBeInstanceOf(GraphQLErrorWithCode);
    expect(error.message).toBe('An error occurred');
    expect(error.code).toBe('500');
    expect(error.name).toBe('GraphQLErrorWithCode');
  });

  test('should create an instance of GraphQLErrorWithCode with a custom code', () => {
    const error = new GraphQLErrorWithCode('A custom error occurred', '404');
    
    expect(error.message).toBe('A custom error occurred');
    expect(error.code).toBe('404');
  });
});

describe('handleError', () => {
  test('should throw a GraphQLErrorWithCode with the provided message and default code', () => {
    expect(() => handleError('An error occurred')).toThrow(GraphQLErrorWithCode);
    expect(() => handleError('An error occurred')).toThrow('An error occurred');
  });

  test('should throw a GraphQLErrorWithCode with the provided message and custom code', () => {
    try {
      handleError('A custom error occurred', '400');
    } catch (error) {
      expect(error).toBeInstanceOf(GraphQLErrorWithCode);
      expect(error.message).toBe('A custom error occurred');
      expect(error.code).toBe('400');
    }
  });
});
