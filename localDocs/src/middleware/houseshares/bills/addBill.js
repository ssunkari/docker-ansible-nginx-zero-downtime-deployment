var shortid = require('shortid');
var moment = require('moment');

function buildKey(req) {
    var selectedDate = moment(req.body.selectedDay, 'YYYYMMDD');
    var month = selectedDate.format('MM');
    var year = selectedDate.format('YYYY');
    var day = selectedDate.format('DD');
    var key = req.user.houseshareKey + ':' + req.uid + ':' + year + ':' + month + ':' + day + ':' + req.body.utilType;
    console.log('Key to store', key);
    return key;
}
module.exports = function (redisClient) {
    return function (req, res, next) {
        var key = buildKey(req);
        redisClient.hmsetAsync(key, [
            "id", shortid.generate(),
            "date", req.body.selectedDay,
            "utilType", req.body.utilType,
            "costName", req.body.costName,
            "amount", req.body.amount,
            "lastModified", moment().format('YYYY-MM-DD')
        ]).then(function (transactionStatus) {
            if (transactionStatus) {
                req.success = true;
                next();
            } else {
                next('Internal Server Error, Please try again later');
            }
        }).catch(function (err) {
            next(err);
        });
    };
}