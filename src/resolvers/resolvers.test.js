const resolvers = require('./resolvers');
const userResolvers = require('../resolvers/users/usersResolvers');
const postResolvers = require('../resolvers/posts/postsResolvers');
const commentResolvers = require('../resolvers/comments/commentsResolvers');

jest.mock('../resolvers/users/usersResolvers', () => ({
  Query: {
    userQuery: jest.fn(),
  },
  Mutation: {
    userMutation: jest.fn(),
  },
}));

jest.mock('../resolvers/posts/postsResolvers', () => ({
  Query: {
    postQuery: jest.fn(),
  },
  Mutation: {
    postMutation: jest.fn(),
  },
}));

jest.mock('../resolvers/comments/commentsResolvers', () => ({
  Query: {
    commentQuery: jest.fn(),
  },
  Mutation: {
    commentMutation: jest.fn(),
  },
}));

describe('Resolvers', () => {
  test('should correctly combine Query resolvers', () => {
    expect(resolvers.Query).toEqual({
      ...userResolvers.Query,
      ...postResolvers.Query,
      ...commentResolvers.Query,
    });
  });

  test('should correctly combine Mutation resolvers', () => {
    expect(resolvers.Mutation).toEqual({
      ...userResolvers.Mutation,
      ...postResolvers.Mutation,
      ...commentResolvers.Mutation,
    });
  });
});
