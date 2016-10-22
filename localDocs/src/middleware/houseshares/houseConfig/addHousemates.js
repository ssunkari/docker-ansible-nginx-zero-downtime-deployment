var moment = require('moment');

module.exports = function (redisClient) {
    return function (req, res, next) {
        var housematesHouseShareKey = 'HMS:' + req.houseshareKey;
        redisClient.saddAsync(housematesHouseShareKey, [
            req.uid
        ]).then(function (transactionStatus) {
            console.log('Added HouseMate::', req.uid);
            next();
        }).catch(function (err) {
            next(err);
        });
    };
}