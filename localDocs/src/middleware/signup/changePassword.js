var shaGen = require('../shaGen.js');
module.exports = function (redisClient) {
    return function (req, res, next) {
        console.log('Sri-======');
        var passwordHash = shaGen(req.body.password.trim());
        redisClient.hmsetAsync(req.params.id, ["password", passwordHash]).then(function (transactionStatus) {
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