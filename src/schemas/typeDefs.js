const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    user: User!
    comments: [Comment]
  }

  type Comment {
    id: ID!
    text: String!
    post: Post!
    user: User!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    posts: [Post!]!
    post(id: ID!): Post
    comments(postId: ID!): [Comment!]!
  }

  type AuthPayload {
    token: String!
    user: User!
}

type Mutation {
  createUser(name: String!, email: String!, password: String!): User!
  updateUser(userId: ID!, name: String, email: String, password: String): User!
  deleteUser(userId: ID!): User!
  createPost(userId: ID!, title: String!, content: String!): Post!
  updatePost(userId: ID!, postId: ID!, title: String!, content: String!): Post!
  deletePost(userId: ID!, postId:ID): Post!
  createComment(userId: ID!, postId: ID!, text: String!): Comment!
  updateComment(commentId: ID!, text: String!): Comment!
  deleteComment(commentId: ID!, userId: ID!, postId: ID!): Comment!
  login(email: String!, password: String!): AuthPayload!
}

`;

module.exports = typeDefs;
