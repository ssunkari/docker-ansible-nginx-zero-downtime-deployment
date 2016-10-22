var shaGen = require('../shaGen.js');

module.exports = function (redisClient) {
    return function (req, res, next) {
        redisClient.hmsetAsync(req.uid, ['activated', true]).then(function (transactionStatus) {
            if (transactionStatus) {
                next();
            }
        }).catch(function (err) {
            next(err);
        });
    };
}