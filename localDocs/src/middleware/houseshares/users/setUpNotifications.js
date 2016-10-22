var moment = require('moment');
var Promise = require('bluebird');

module.exports = function (redisClient) {
    return function (req, res, next) {
        var smsNotifKey = 'SMS:NOTIF:' + req.uid + ':' + req.houseshareKey;
        var emailNotifKey = 'EMAIL:NOTIF:' + req.uid + ':' + req.houseshareKey;
        Promise.join(redisClient.hmsetAsync(smsNotifKey, ['uid', req.uid,
                'houseshareKey', req.houseshareKey,
                'addToGroup', true,
                'addBill', true,
                'editBill', true,
                'commentOnBill', true,
                'dueBills', true,
                'monthlySummary', true,
                'otherNotifications', true,
                'lastmodified', moment().format('YYYY-MM-DD')
            ]),

            redisClient.hmsetAsync(emailNotifKey, ['uid', req.uid,
                'houseshareKey', req.houseshareKey,
                'addToGroup', true,
                'addBill', true,
                'editBill', true,
                'commentOnBill', true,
                'dueBills', true,
                'monthlySummary', true,
                'otherNotifications', true,
                'lastmodified', moment().format('YYYY-MM-DD')
            ]),
            function (smsTransactionStatus, emailTransactionStatus) {
                if (smsTransactionStatus && emailTransactionStatus) {
                    next();
                } else {
                    next('Internal Server error');
                }
            }).catch(function (err) {
            next(err);
        });
    };
}