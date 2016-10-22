var moment = require('moment');

module.exports = function (redisClient) {
    return function (req, res, next) {
        if (!req.fileUploadSuccess) {
            next();
        } else {
            redisClient.hmsetAsync(req.uid, ['lastmodified', moment().format('YYYY-MM-DD'),
                'imageFileName', req.imageFileName
            ]).then(function (transactionStatus) {
                if (transactionStatus) {
                    console.log('Set ImagePath:: Succeded');
                    next();
                } else {
                    next('Internal Server error');
                }

            }).catch(function (err) {
                next(err);
            });
        }
    };
}