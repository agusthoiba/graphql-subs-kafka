/*eslint-disable */
import { MongoClient } from 'mongodb';

export const getDB = async(mongoUri: string, dbName: string) => {
  const mongoCli = new MongoClient(mongoUri)
  await mongoCli.connect();
  console.log('Mongodb Connected successfully to server');
  return mongoCli.db(dbName);
}

// export default getDB;
