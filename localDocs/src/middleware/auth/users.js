var shaGen = require('../shaGen');

module.exports = function (redisClient) {
    return {
        findById: function (id, cb) {
            process.nextTick(function () {
                var idx = id - 1;
                if (records[idx]) {
                    cb(null, records[idx]);
                } else {
                    cb(new Error('User ' + id + ' does not exist'));
                }
            });
        },
        findByUsername: function (username, password) {
            console.log('username', username);
            console.log('password', password);
            var username = username.trim().toLowerCase();
            return redisClient.hgetallAsync(shaGen(username));
        }
    }
};