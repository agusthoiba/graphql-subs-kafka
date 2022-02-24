import { expect } from "chai";
import sinon from 'sinon';
import Db from "./db"

describe('db', function () {
  const sandbox = sinon.createSandbox();
  let mongoCli;
  let db;
  const dbName = 'subs';

  beforeEach(() => {
    mongoCli = {
      connect: sandbox.stub(),
      db: sandbox.stub()
    };

    db = new Db(mongoCli)
  });

  afterEach(() => {
    sandbox.restore();
  });

    it('should succeed on call db', async function () {
        const sandbox = sinon.createSandbox();
       
      
        
        await db.connect(dbName);
        // const db = await getDB(mongoCli, dbName)

        expect(mongoCli.connect.callCount).to.equal(1);
        //expect(mongoCli.db.callCount).to.equal(1);
    });
  });
