// resolvers.js
const userResolvers = require('../resolvers/users/usersResolvers');
const postResolvers = require('../resolvers/posts/postsResolvers');
const commentResolvers = require('../resolvers/comments/commentsResolvers');

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...postResolvers.Query,
    ...commentResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolvers.Mutation,
  },
};

module.exports = resolvers;

