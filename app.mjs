import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from "mongoose";
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import typeDefs from './schema/schema.js';
import resolvers from './resolver/index.js';
import {mongoMethods} from "./db.js";
import {startStandaloneServer} from "@apollo/server/standalone";

const app = express();
const httpServer = http.createServer(app);

await mongoose.connect('mongodb://localhost:27017/apollo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

console.log("MongoDB connected");

const schema = makeExecutableSchema({ typeDefs, resolvers });

// Set up WebSocket server.
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});
const serverCleanup = useServer({ schema }, wsServer);

// Set up ApolloServer.
const server = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),
    
    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ]
});

await server.start();
app.use('/graphql', bodyParser.json(), expressMiddleware(server, {
  context: async ({ req, res }) => ({
    mongoMethods
  }),
}));

// Now that our HTTP server is fully set up, actually listen.
httpServer.listen(4000, () => {
  console.log(`🚀 Query endpoint ready at http://localhost:${4000}/graphql`);
  console.log(`🚀 Subscription endpoint ready at ws://localhost:${4000}/graphql`);
});

export default server;
