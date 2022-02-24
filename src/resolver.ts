

import { makeExecutableSchema } from '@graphql-tools/schema';
import { KafkaPubSub } from 'graphql-kafka-subscriptions'
import { PubSub } from "apollo-server-express";

import Repositories from './repositories';
import typeDefs from './schema';
import status from './constant';
// import Container from 'typedi';

import { ObjectId } from 'mongodb';

const pubsub = new KafkaPubSub({
  topic: process.env.KAFKA_TOPIC,
  host: process.env.KAFKA_BROKER_HOST,
  port: process.env.KAFKA_BROKER_PORT,
  globalConfig: {} // options passed directly to the consumer and producer
});

const CHANNEL_NAMES = {
  USER_CREATED: 'USER_CREATED',
  USER_STATUS: 'USER_STATUS'
}

const resolvers = {
  // return the post body only if the user is the post's author
  /* if (context.user && (context.user.id === post.authorId)) {
    return post.body;
  } */
  
  // action here such as query db
  Query: {
    users: async function (obj, args, context) { 
      const repo = new Repositories(context.db)
      const findU = await repo.findUser()
      // console.log(findU)
      return findU;
    },
  },
  Mutation: {
    createUser: async function (obj, args, context) {
      const repo = new Repositories(context.db)
      args['input']['status'] = 'INACTIVE'
      const createU = await repo.createUser(args['input'])

      const payloadKafka = {
        onUserStatus: {
          id: createU.id,
          name: args['input']['name'],
          status: args['input']['status'],
          mobile_number: args['input']['mobile_number'],
        }
      }

      const onMessage = (payloadKafka) => {
        console.log('payloadKafka', payloadKafka);
      }
      
    
      await pubsub.subscribe(CHANNEL_NAMES.USER_STATUS, onMessage)
      await pubsub.publish(CHANNEL_NAMES.USER_STATUS, payloadKafka)
      return createU;
    },
    updateUserStatus: async function (obj, args, context) {
      const repo = new Repositories(context.db)
      if (!Object.values(status).includes(args['input']['status'])) {
        throw new Error("Status Not Allowed")
      }
      const qs: object = {_id: new ObjectId(args['input']['id'])}
      const payload = {
        status: args['input']['status']
      }
      const updateU = await repo.updateUser(qs, payload)

      const payloadKafka = {
        onUserStatus: {
          id: args['input']['id'],
          status: args['input']['status']
        }
      }

      const onMessage = (payloadKafka) => {
        console.log('payloadKafka - update user', payloadKafka);
      }
      
      await pubsub.subscribe(CHANNEL_NAMES.USER_STATUS, onMessage)
      await pubsub.publish(CHANNEL_NAMES.USER_STATUS, payloadKafka)
      return {...args['input'], ok: true};
    }  
  },
  Subscription: {
    /* onUserCreated: {
      // More on pubsub below
     
      subscribe: () => pubsub.asyncIterator(CHANNEL_NAMES.USER_CREATED)
    }, */
    onUserStatus: {
      // More on pubsub below
     
      subscribe: () => pubsub.asyncIterator(CHANNEL_NAMES.USER_STATUS)
    }
  }
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

export default schema;
