// resolvers.js
const userResolvers = require('../resolvers/usersResolvers');
const postResolvers = require('../resolvers/postsResolvers');
const commentResolvers = require('../resolvers/commentsResolvers');

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

