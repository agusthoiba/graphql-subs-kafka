
import { Service } from "typedi";
import Db from "./db";

@Service()
class Repositories {

    constructor(private readonly db: Db) {}

    findUser = async() => {
        const coll = this.db.obj.collection('user')

        const findU = await coll.find().toArray()

        findU.map(row => {
            return this._transform(row)
        })
        
        return await findU;
    }

    createUser = async(payload: Object) => {
        const coll = this.db.obj.collection('user')
        const createU = await coll.insertOne(payload)
        createU['id'] = String(createU.insertedId);
        delete createU['_id'];
        const result = {
            id: String(createU.insertedId)
        }
        return await result;
    }

    updateUser = async(query, payload: object) => {
        console.log('this', this)
        const coll = this.db.obj.collection('user')
        const updateU = await coll.updateOne(query, {'$set': payload})
        return await updateU;
    }

    _transform(rowdb: Object) {
        rowdb['id'] = rowdb['_id'];
        delete rowdb['_id'];
        return rowdb
    }

}

export default Repositories;
