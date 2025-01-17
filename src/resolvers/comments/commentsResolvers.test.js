const commentResolvers = require('../comments/commentsResolvers');

const {
  getCommentsByPostId,
  createComment,
  updateComment,
  deleteComments,
} = require('../../models/comments');

// Mock de las funciones del modelo
jest.mock('../../models/comments', () => ({
  getCommentsByPostId: jest.fn(),
  createComment: jest.fn(),
  updateComment: jest.fn(),
  deleteComments: jest.fn(),
}));

describe('commentResolvers', () => {
  const mockContext = { userId: 1 };

  describe('Query', () => {
    test('comments - gets comments per postId when the user is authorized', async () => {
      const mockComments = [{ id: 1, text: 'Comentario de prueba' }];
      getCommentsByPostId.mockResolvedValue(mockComments);

      const result = await commentResolvers.Query.comments({}, { postId: 1 }, mockContext);

      expect(getCommentsByPostId).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockComments);
    });

    test('comments - throws error if user is not authorized', async () => {
      await expect(
        commentResolvers.Query.comments({}, { postId: 1 }, {})
      ).rejects.toThrow('No autorizado');
    });

    test('comments - throws error if a problem occurs when getting the comments', async () => {
      getCommentsByPostId.mockRejectedValue(new Error('Database error'));

      await expect(
        commentResolvers.Query.comments({}, { postId: 1 }, mockContext)
      ).rejects.toThrow('Error al obtener los comentarios');
    });
  });

  describe('Mutation', () => {
    test('createComment - creates a comment when the user is authorized', async () => {
      const mockComment = { id: 1, text: 'Nuevo comentario' };
      createComment.mockResolvedValue(mockComment);

      const result = await commentResolvers.Mutation.createComment(
        {},
        { postId: 1, text: 'Nuevo comentario' },
        mockContext
      );

      expect(createComment).toHaveBeenCalledWith(1, 1, 'Nuevo comentario');
      expect(result).toEqual(mockComment);
    });

    test('createComment - throws error if user is not authorized', async () => {
      await expect(
        commentResolvers.Mutation.createComment({}, { postId: 1, text: 'Texto' }, {})
      ).rejects.toThrow('No autorizado');
    });

    test('createComment - throws error if a problem occurs while creating the comment', async () => {
      createComment.mockRejectedValue(new Error('Database error'));

      await expect(
        commentResolvers.Mutation.createComment({}, { postId: 1, text: 'Texto' }, mockContext)
      ).rejects.toThrow('Error al crear el comentario');
    });

    test('updateComment - updates a comment when the user is authorized', async () => {
      const mockComment = { id: 1, text: 'Comentario actualizado' };
      updateComment.mockResolvedValue(mockComment);

      const result = await commentResolvers.Mutation.updateComment(
        {},
        { commentId: 1, text: 'Comentario actualizado' },
        mockContext
      );

      expect(updateComment).toHaveBeenCalledWith(1, 1, 'Comentario actualizado');
      expect(result).toEqual(mockComment);
    });

    test('updateComment - throws error if user is not authorized', async () => {
      await expect(
        commentResolvers.Mutation.updateComment({}, { commentId: 1, text: 'Texto' }, {})
      ).rejects.toThrow('No autorizado');
    });

    test('updateComment - throws error if a problem occurs while updating the comment', async () => {
      updateComment.mockRejectedValue(new Error('Database error'));

      await expect(
        commentResolvers.Mutation.updateComment({}, { commentId: 1, text: 'Texto' }, mockContext)
      ).rejects.toThrow('Error al actualizar el comentario');
    });

    test('deleteComment - deletes a comment when the user is authorized', async () => {
      const mockDeletedComment = { id: 1, text: 'Comentario eliminado' };
      deleteComments.mockResolvedValue(mockDeletedComment);

      const result = await commentResolvers.Mutation.deleteComment(
        {},
        { commentId: 1, userId: 1, postId: 1 },
        mockContext
      );

      expect(deleteComments).toHaveBeenCalledWith(1, 1, 1);
      expect(result).toEqual(mockDeletedComment);
    });

    test('deleteComment - throws error if user is not authorized', async () => {
      await expect(
        commentResolvers.Mutation.deleteComment({}, { commentId: 1, userId: 1, postId: 1 }, {})
      ).rejects.toThrow('No autorizado');
    });

    test('deleteComment - throws error if a problem occurs when deleting the comment', async () => {
      deleteComments.mockRejectedValue(new Error('Database error'));

      await expect(
        commentResolvers.Mutation.deleteComment({}, { commentId: 1, userId: 1, postId: 1 }, mockContext)
      ).rejects.toThrow('Error al eliminar el comentario');
    });
  });
});
