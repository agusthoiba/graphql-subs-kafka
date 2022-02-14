import { makeExecutableSchema } from '@graphql-tools/schema';
import { KafkaPubSub } from 'graphql-kafka-subscriptions'
import { PubSub } from "apollo-server-express";

import Repositories from './repositories';
import typeDefs from './schema';


const pubsub = new KafkaPubSub({
  topic: process.env.KAFKA_TOPIC,
  host: process.env.KAFKA_BROKER_HOST,
  port: process.env.KAFKA_BROKER_PORT,
  globalConfig: {} // options passed directly to the consumer and producer
});

const CHANNEL_NAME = 'USER_STATUS'



const resolvers = {
  // return the post body only if the user is the post's author
  /* if (context.user && (context.user.id === post.authorId)) {
    return post.body;
  } */
  
  // action here such as query db
  Query: {
    users: async function (obj, args, context) { 
      console.log('oactx', context)
      console.log('oactx-db', context.db)
      const repo = new Repositories(context.db)
      const findU = await repo.findUser()
      // console.log(findU)
      return findU;
    },
  },
  Mutation: {
    createUser: async function (obj, args, context) {
      console.log('args', args)
      const repo = new Repositories(context.db)
      args['input']['status'] = 'INACTIVE'
      const createU = await repo.createUser(args['input'])

      const payloadKafka = {
        onUserCreated: {
          id: createU.id,
          name: args['input']['name'],
          status: args['input']['status'],
          mobile_number: args['input']['mobile_number'],
        }
      }

      const onMessage = (payloadKafka) => {
        console.log('payloadKafka', payloadKafka);
      }
      
    
      await pubsub.subscribe(CHANNEL_NAME, onMessage)
      await pubsub.publish(CHANNEL_NAME, payloadKafka)
      return createU;
    } 
  },
  Subscription: {
    onUserCreated: {
      // More on pubsub below
     
      subscribe: () => pubsub.asyncIterator([CHANNEL_NAME])
    }
  }
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

export default schema;
