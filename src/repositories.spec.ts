import { expect } from "chai";
import sinon from 'sinon';
import Repositories from "./repositories"

describe('repositories', function () {
    const sandbox = sinon.createSandbox();
    let repositories;
    let db;
    
    const userDbMock = {
        '_id': "1",
        name: 'Jhon Doe'
    }

    const userMock = {
        id: "1",
        name: 'Jhon Doe'
    }

    const updateResult = {
        matchedCount: 1,
        modifiedCount: 1,
        upsertedId: userMock.id
    }

    beforeEach(() => {
        db = {
            obj: {
                collection: sandbox.stub().returns({
                    find: sandbox.stub().returns({
                        toArray: sandbox.stub().returns([userDbMock])
                    }),
                    insertOne: sandbox.stub().returns({
                        insertedId: userMock.id
                    }),
                    updateOne: sandbox.stub().returns(updateResult),
                })
            }
        }
        
        repositories = new Repositories(db);
    });

    afterEach(() => {
        sandbox.restore();
    });
    
    it('should succeed findUser', async function () {
        const findU = await repositories.findUser();

        expect(findU).to.deep.equal([userMock]);
    });

    it('should succeed createUser', async function () {

        const payload = {
            name: userMock.name
        }

        const userMockId = {
            id: userMock.id
        }

        const createU = await repositories.createUser(payload);

        expect(createU).to.deep.equal(userMockId);
    });

    it('should succeed updateUser', async function () {
        const query = {
            _id: userMock.id
        }

        const payload = {
            name: userMock.name
        }

        const userMockId = {
            id: userMock.id
        }

        const updateU = await repositories.updateUser(query, payload);

        // expect(db.obj.collection).to.have.been.calledOnce;
        
        expect(updateU).to.deep.equal(updateResult);
    });
  });