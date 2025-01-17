const { GraphQLErrorWithCode } = require('../../errors');
const postResolvers = require('./postsResolvers');
const { getAllPosts, getPostById, createPost, updatePost, deletePost } = require('../../models/posts');

jest.mock('../../models/posts');

describe('Post Resolvers - Querys', () => {
  it('should throw an error if no userId in context', async () => {
    const context = {
        userId: '1', // Asume que el usuario está autenticado
      };
    try {
      await postResolvers.Query.posts(null, null, context);
    } catch (err) {
      expect(err.message).toBe('No autorizado');
    }
  });

  it('should return all posts if context is valid', async () => {
    const context = { userId: '1' };
    const mockPosts = [{ id: '1', title: 'Post 1', content: 'Content 1' }];
    getAllPosts.mockResolvedValue(mockPosts);

    const result = await postResolvers.Query.posts(null, null, context);
    expect(result).toEqual(mockPosts);
  });

  it('should throw an error if there is an issue fetching posts', async () => {
    const context = { userId: '1' };
    getAllPosts.mockRejectedValue(new Error('Database error'));

    try {
      await postResolvers.Query.posts(null, null, context);
    } catch (err) {
      expect(err.message).toBe('Error al obtener los posts');
    }
  });
});

describe('Post Resolvers - Query: post', () => {
  it('should throw an error if no userId in context', async () => {
    const context = {};
    try {
      await postResolvers.Query.post(null, { id: '1' }, context);
    } catch (err) {
      expect(err.message).toBe('No autorizado');
    }
  });

  it('should return a post if post exists', async () => {
    const context = { userId: '1' };
    const mockPost = { id: '1', title: 'Post 1', content: 'Content 1' };
    getPostById.mockResolvedValue(mockPost);

    const result = await postResolvers.Query.post(null, { id: '1' }, context);
    expect(result).toEqual(mockPost);
  });

  it('should throw an error if post is not found', async () => {
    const context = { userId: '1' };
    getPostById.mockResolvedValue(null);

    try {
      await postResolvers.Query.post(null, { id: '1' }, context);
    } catch (err) {
      expect(err.message).toBe('Post no encontrado');
    }
  });

  it('should throw an error if there is an internal issue fetching the post', async () => {
    const context = { userId: '1' };
    getPostById.mockRejectedValue(new Error('Database error'));

    try {
      await postResolvers.Query.post(null, { id: '1' }, context);
    } catch (err) {
      expect(err.message).toBe('Post no encontrado');
    }
  });
});

describe('Post Resolvers - Mutation: createPost', () => {
  it('should throw an error if no userId in context', async () => {
    const context = {};
    try {
      await postResolvers.Mutation.createPost(null, { title: 'New Post', content: 'Content' }, context);
    } catch (err) {
      expect(err.message).toBe('No autorizado');
    }
  });

  it('should create a new post if context is valid', async () => {
    const context = { userId: '1' };
    const mockPost = { id: '1', title: 'New Post', content: 'Content' };
    createPost.mockResolvedValue(mockPost);

    const result = await postResolvers.Mutation.createPost(null, { title: 'New Post', content: 'Content' }, context);
    expect(result).toEqual(mockPost);
  });

  it('should throw an error if there is an issue creating the post', async () => {
    const context = { userId: '1' };
    createPost.mockRejectedValue(new Error('Database error'));

    try {
      await postResolvers.Mutation.createPost(null, { title: 'New Post', content: 'Content' }, context);
    } catch (err) {
      expect(err.message).toBe('Error al crear el post');
    }
  });
});

describe('Post Resolvers - Mutation: updatePost', () => {
  it('should throw an error if userId in context does not match userId of post', async () => {
    const context = { userId: '1' };
    const mockPost = { id: '2', userId: '2', title: 'Post 2', content: 'Content' };
    try {
      await postResolvers.Mutation.updatePost(null, { userId: '2', postId: '2', title: 'Updated Title', content: 'Updated Content' }, context);
    } catch (err) {
      expect(err.message).toBe('No autorizado');
    }
  });

  it('should update the post if authorized', async () => {
    const context = { userId: '1' };
    const mockUpdatedPost = { id: '1', userId: '1', title: 'Updated Title', content: 'Updated Content' };
    updatePost.mockResolvedValue(mockUpdatedPost);

    const result = await postResolvers.Mutation.updatePost(null, { userId: '1', postId: '1', title: 'Updated Title', content: 'Updated Content' }, context);
    expect(result).toEqual(mockUpdatedPost);
  });

  it('should throw an error if post is not found or not authorized to update', async () => {
    const context = { userId: '1' };
    updatePost.mockResolvedValue(null);

    try {
      await postResolvers.Mutation.updatePost(null, { userId: '1', postId: '1', title: 'Updated Title', content: 'Updated Content' }, context);
    } catch (err) {
      expect(err.message).toBe('Post no encontrado o no autorizado para actualizar');
    }
  });

  it('should throw an error if there is an issue updating the post', async () => {
    const context = { userId: '1' };
    updatePost.mockRejectedValue(new Error('Database error'));

    try {
      await postResolvers.Mutation.updatePost(null, { userId: '1', postId: '1', title: 'Updated Title', content: 'Updated Content' }, context);
    } catch (err) {
      expect(err.message).toBe('Post no encontrado o no autorizado para actualizar');
    }
  });
});

describe('Post Resolvers - Mutation: deletePost', () => {
  it('should throw an error if userId in context does not match userId of post', async () => {
    const context = { userId: '1' };
    const mockPost = { id: '2', userId: '2', title: 'Post 2', content: 'Content' };
    try {
      await postResolvers.Mutation.deletePost(null, { userId: '2', postId: '2' }, context);
    } catch (err) {
      expect(err.message).toBe('No autorizado');
    }
  });

  it('should delete the post if authorized', async () => {
    const context = { userId: '1' };
    const mockDeletedPost = { id: '1', userId: '1', title: 'Deleted Post', content: 'Content' };
    deletePost.mockResolvedValue(mockDeletedPost);

    const result = await postResolvers.Mutation.deletePost(null, { userId: '1', postId: '1' }, context);
    expect(result).toEqual(mockDeletedPost);
  });

  it('should throw an error if post is not found or not authorized to delete', async () => {
    const context = { userId: '1' };
    deletePost.mockResolvedValue(null);

    try {
      await postResolvers.Mutation.deletePost(null, { userId: '1', postId: '1' }, context);
    } catch (err) {
      expect(err.message).toBe('Post no encontrado o no autorizado para eliminar');
    }
  });

  it('should throw an error if there is an issue deleting the post', async () => {
    const context = { userId: '1' };
    deletePost.mockRejectedValue(new Error('Database error'));

    try {
      await postResolvers.Mutation.deletePost(null, { userId: '1', postId: '1' }, context);
    } catch (err) {
      expect(err.message).toBe('Post no encontrado o no autorizado para eliminar');
    }
  });
});
