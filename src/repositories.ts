

class Repositories {
    db;

    constructor(db) {
        this.db = db
    }

    findUser = async() => {
        const coll = this.db.collection('user')
        const findU = await coll.find().toArray()
        findU.map(row => {
            return this._transform(row)
        })
        
        return await findU;
    }

    createUser = async(payload: Object) => {
        const coll = this.db.collection('user')
        const createU = await coll.insertOne(payload)
        console.log('createU repo', createU)
        createU['id'] = String(createU.insertedId);
        delete createU['_id'];
        const result = {
            id: String(createU.insertedId)
        }
        return await result;
    }

    _transform(rowdb: Object) {
        rowdb['id'] = rowdb['_id'];
        delete rowdb['_id'];
        return rowdb
    }

}

export default Repositories;
