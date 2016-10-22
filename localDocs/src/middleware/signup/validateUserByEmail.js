var shaGen = require('../shaGen.js');
module.exports = function (redisClient) {
    return function (req, res, next) {
        if (req.uid) {
            var userKey = shaGen(req.uid.trim().toLowerCase());
            redisClient.hgetallAsync(userKey).then(function (userObj) {
                if (userObj) {
                    req.userExist = true;
                    req.activated = userObj.activated
                    console.log('validation:: User Exists');
                }
                next();
            });
        } else {
            next('Username not being set');
        }
    };
}