var moment = require('moment');

module.exports = function (redisClient) {
    return function (req, res, next) {
        var userhouseshareKey = 'UHS:' + req.uid + ':' + req.houseshareKey;
        redisClient.hmsetAsync(userhouseshareKey, ['uid', req.uid,
            'houseshareKey', req.houseshareKey,
            'startDate', moment().format('YYYY-MM-DD'),
            'lastmodified', moment().format('YYYY-MM-DD')
        ]).then(function (transactionStatus) {
            if (transactionStatus) {
                next();
            } else {
                next('Internal Server error');
            }
        }).catch(function (err) {
            next(err);
        });
    };
}