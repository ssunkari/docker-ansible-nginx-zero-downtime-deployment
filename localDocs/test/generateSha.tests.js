var shaGen = require('../src/middleware/shaGen');
var assert = require('chai').assert;
describe('generate shorter sha from username', function () {
    it('should return only first 10 charecters from sha output', function (done) {
        var result = shaGen('inputString');
        assert.equal(result.length, 10);
        done();
    });
})