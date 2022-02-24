const statusEx = {
    INACTIVE: "INACTIVE",
    ACTIVE: "ACTIVE",
    VERIFIED: "VERIFIED",
    BLOCK: "BLOCK"
}

import { expect } from "chai";
import sinon from 'sinon';
import status from "./constant"

describe('constant', function () {
    it('should succeed', async function () {
        expect(statusEx).to.deep.equal(status);
    })
})