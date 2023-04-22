import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import schema from './schema';
import resolvers from './resolvers';

(async () => {
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: {},
  });

  // create express app
  const app = express();

  // start server
  await server.start();

  // set middleware
  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: {
      origin: ['http://localhost:3000/', 'https://studio.apollographql.com'],
      credentials: true,
    },
  });

  // open port
  await app.listen({ port: 8000 });
  console.log('server listening on 8000 port...');
})();
