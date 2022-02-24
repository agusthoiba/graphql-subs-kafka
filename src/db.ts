/*eslint-disable */


import { Service } from "typedi";
import {MongoClient} from 'mongodb';

@Service()
class Db {
  public obj;

  constructor(private readonly mongoCli: MongoClient) {}

  async connect(dbName: string): Promise<boolean>  {
    await this.mongoCli.connect();
    console.log('Mongodb Connected successfully to server');
    this.obj = this.mongoCli.db(dbName);
    return true;
  }
}

export default Db;
