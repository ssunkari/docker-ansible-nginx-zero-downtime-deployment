var moment = require('moment');

module.exports = function (redisClient) {
    return function (req, res, next) {
        redisClient.hmsetAsync(req.uid, ['lastmodified', moment().format('YYYY-MM-DD'),
            'houseshareSetup', true,
            'houseshareKey', req.houseshareKey
        ]).then(function (transactionStatus) {
            if (transactionStatus) {
                console.log('Set HouseShareFlag:: Succeded');
                next();
            } else {
                next('Internal Server error');
            }

        }).catch(function (err) {
            next(err);
        });
    };
}