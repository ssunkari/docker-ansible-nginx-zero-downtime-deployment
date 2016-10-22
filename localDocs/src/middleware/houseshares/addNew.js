var shaGen = require('../shaGen.js');
var moment = require('moment');

module.exports = function (redisClient) {
    return function (req, res, next) {
        var houseshareKey = 'HS:' + 'C' + req.body.countryCode.trim().toLowerCase() + ':P' + req.body.postCode.trim().toLowerCase().replace(' ', '') + ':H' + req.body.houseNumber.trim();
        req.houseshareKey = houseshareKey;
        var friendlyName = req.body.houseNumber.trim() + ' ' + req.body.streetAddress.trim().split(' ')[0];
        redisClient.hmsetAsync(houseshareKey, ['lastmodified', moment().format('YYYY-MM-DD'),
            'friendlyName', friendlyName
        ]).then(function (transactionStatus) {
            if (transactionStatus) {
                console.log('Add New HouseShare:: Succeded');
                next();
            } else {
                next('Internal Server error');
            }
        }).catch(function (err) {
            next(err);
        });
    };
}