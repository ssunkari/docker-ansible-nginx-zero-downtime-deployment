var assert = require('chai').assert;
var Promise = require('bluebird');
var proxyquire = require('proxyquire');
var _ = require('lodash');
//var getUsers = Promise.promisifyAll(require('../src/houseshareSource/getUsers'));
var redisStoreStub = _.cloneDeep(require('./testData/redisStoreStub'));

describe('get user profile by key', function () {
    before(function (done) {
        redisStoreStub.setTenancyDate(tenancyStartDate);
        getUsers = Promise.promisifyAll(proxyquire('../src/houseshareSource/getUsers', {
            '../middleware/redis/redisStore': redisStoreStub
        }))
        done();
    });

    it('should return current user info', function (done) {
        getUsers.byUserIdAsync('9e1e2d2473').then(function (users) {
            assert.isAbove(users.length, 0);
            done();
        })
    });
});

describe('get all users in a houseshare', function () {
    describe('when user is linked to houseshare and is active in start month of tenancy agreement', function () {
        describe.only('when houseshare has only current user with only start agreement Date', function () {
            var getUsers;
            var tenancyStartDate = '2016-03-08';
            before(function (done) {
                redisStoreStub.setTenancyDate(tenancyStartDate);
                getUsers = Promise.promisifyAll(proxyquire('../src/houseshareSource/getUsers', {
                    '../middleware/redis/redisStore': redisStoreStub
                }))
                done();
            });

            it('should map the year,month, status to the user info', function (done) {
                getUsers.byHouseShareKey('9e1e2d2473', '2016-03-08').then(function (users) {
                    assert.isOk(users[0].status[0].active);
                    assert.equal(users[0].status[0].stayDate, '2016-03-01');
                    done();
                }).catch(function (err) {
                    done(err)
                });
            });
        });

        describe('when houseshare has two users', function () {
            it('should return both user infos', function (done) {
                getUsers.byUserIdAsync('9e1e2d2473', '2016-03-08').then(function (users) {
                    assert.equal(users.length, 2);
                    done();
                })
            });

            it('should map the year,month, status to the user info', function (done) {
                getUsers.byUserIdAsync('9e1e2d2473', '2016-03-08').then(function (users) {
                    assert.equal(users.length, 2);
                    users.forEach(function (user) {
                        assert.isOk(user.status[0].active);
                        assert.equal(user.status[0].stayDate, '2016-03-01');
                        done();
                    });
                }).catch(function (err) {
                    done(err)
                });
            });
        });
    });

    describe('when user is linked to houseshare and is active in few months in advance of tenancy agreement', function () {
        describe('when houseshare has only current user with only start agreement Date', function () {
            it('should return current user info', function (done) {
                getUsers.byUserIdAsync('9e1e2d2473', '2016-10-08').then(function (users) {
                    assert.isAbove(users.length, 0);
                    done();
                })
            });

            it('should map the year,month, status to the user info', function (done) {
                getUsers.byUserIdAsync('9e1e2d2473', '2016-10-08').then(function (users) {
                    assert.isOk(users[0].status[0].active);
                    assert.equal(users[0].status[0].stayDate, '2016-10-01');
                    done();
                }).catch(function (err) {
                    done(err)
                });
            });
        });
    });

    describe('when user is linked to houseshare and is inactive', function () {
        describe('when houseshare has only current user with start and end agreement Date', function () {
            it('should return current user info', function (done) {
                getUsers.byUserIdAsync('9e1e2d2473', '2017-01-08').then(function (users) {
                    assert.isAbove(users.length, 0);
                    done();
                })
            });

            it('should map the year,month, status to the user info', function (done) {
                getUsers.byUserIdAsync('9e1e2d2473', '2017-01-08').then(function (users) {
                    assert.isNotOk(users[0].status[0].active);
                    assert.equal(users[0].status[0].stayDate, '2017-01-01');
                    done();
                }).catch(function (err) {
                    done(err)
                });
            });
        });
    });
    describe('when user is linked to houseshare and is not active', function () {
        describe('when houseshare has only current user', function () {
            it('should return current user info', function (done) {
                getUsers.byUserIdAsync('9e1e2d2473', '2016-02-08').then(function (users) {
                    assert.isAbove(users.length, 0);
                    done();
                })
            });

            it('should map the year,month, status to the user info', function (done) {
                getUsers.byUserIdAsync('9e1e2d2473', '2016-02-08').then(function (users) {
                    assert.isNotOk(users[0].status[0].active);
                    assert.equal(users[0].status[0].stayDate, '2016-02-01');
                    done();
                }).catch(function (err) {
                    done(err)
                });
            });
        });
    });

    describe('when user does not exist', function () {
        it('should return empty array', function (done) {
            getUsers.byUserIdAsync('abcdef', '2016-03-08').then(function (users) {
                assert.equal(users.length, 0);
                done();
            })
        });
    });
});