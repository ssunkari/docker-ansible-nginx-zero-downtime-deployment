var shaGen = require('../../shaGen.js');
module.exports = function (redisClient) {
    return function (req, res, next) {
        var userKey = req.uid;
        redisClient.hgetallAsync(userKey).then(function (userObj) {
            if (userObj) {
                req.userExist = true;
                console.log('User Exists Module :: User Exists');
                next();
            } else {
                next('Internal server error');
            }
        });
    };
}