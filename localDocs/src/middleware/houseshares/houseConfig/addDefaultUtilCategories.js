var moment = require('moment');

module.exports = function (redisClient) {
    return function (req, res, next) {
        var utilTypeHouseShareKey = 'UTILTYPES:' + req.houseshareKey;
        redisClient.saddAsync(utilTypeHouseShareKey, [
            'gas',
            'water',
            'electricity',
            'internet'
        ]).then(function (transactionStatus) {
            console.log('Added Util types ::', transactionStatus);
            next();
        }).catch(function (err) {
            next(err);
        });
    };
}