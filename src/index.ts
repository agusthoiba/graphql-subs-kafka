import 'dotenv/config';
// require('dotenv').config();

import { createServer } from "http";
import { execute, subscribe,  } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import express from "express";
import { ApolloServer, PubSub,  } from "apollo-server-express";
import { KafkaPubSub } from 'graphql-kafka-subscriptions'
import { getDB } from './db'


import schema from './resolver';

(async function () {
  const app = express();

  console.log(process.env)
  const httpServer = createServer(app);

  /*const pubsub = new KafkaPubSub({
    topic: 'ID.JENIUS.USER',
    host: 'localhost',
    port: '9092',
    globalConfig: {} // options passed directly to the consumer and producer
  }); */
  const db = await getDB(process.env.MONGODB_URI, process.env.MONGODB_NAME);

  const context = {
    db: db
    // pubsub: new PubSub()
  }



  const server = new ApolloServer({
    schema,
    context
    /* plugins: [{
      async serverWillStart() {
        return {
          async drainServer() {
            subscriptionServer.close();
          }
        };
      }
    }], */
  });
  await server.start();
  server.applyMiddleware({ app });

  SubscriptionServer.create(
    { schema, execute, subscribe, 
      onConnect() {
        console.log('Connected subcription server!')
      }
    },
    { server: httpServer, path: server.graphqlPath }
  );

  const PORT = process.env['APP_PORT'];
  httpServer.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}/graphql`)
    console.log(`🚀 Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`)
  });
})();
