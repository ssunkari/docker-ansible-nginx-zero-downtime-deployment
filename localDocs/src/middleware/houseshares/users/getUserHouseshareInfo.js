var moment = require('moment');
var _ = require('lodash');
var Promise = require('bluebird');
var usersCurrentlyLivingInHouseshare = require('./usersCurrentlyLivingInHouseShare');
module.exports = function (redisClient) {
    return function (req, res, next) {
        console.log('Get User Info:: UID', req.uid);
        redisClient.hgetallAsync(req.uid)
            .then(function (user) {
                req.user = user;
                req.user.houseshare = {};
                req.user.houseshare.currentUsers = {};
                req.user.smsNotifSettings = {};
                req.user.emailNotifSettings = {};
                req.user.houseshareUtilTypes = {}
                return user;
                req.user = user;
                //var houseSharePromise = redisClient.hgetallAsync(user.houseshareKey);
                // var tenantsLivingInHouseshare = usersCurrentlyLivingInHouseshare(redisClient, user.houseshareKey);
                //  var smsNotifSettings = redisClient.hgetallAsync('SMS:NOTIF:' + req.uid + ':' + user.houseshareKey);
                var emailNotifSettings = redisClient.hgetallAsync('EMAIL:NOTIF:' + req.uid + ':' + user.houseshareKey);
                var houseshareUtilTypes = redisClient.smembersAsync('UTILTYPES:' + user.houseshareKey);

                return Promise.join(houseSharePromise, tenantsLivingInHouseshare,
                    smsNotifSettings, emailNotifSettings, houseshareUtilTypes,
                    function (houseSharePromise,
                        tenantsLivingInHouseshare,
                        smsNotifSettings,
                        emailNotifSettings,
                        houseshareUtilTypes) {
                        req.user.houseshare = houseSharePromise;
                        req.user.houseshare.currentUsers = tenantsLivingInHouseshare,
                            req.user.smsNotifSettings = smsNotifSettings,
                            req.user.emailNotifSettings = emailNotifSettings,
                            req.user.houseshareUtilTypes = houseshareUtilTypes
                    })
            })
            .then(function () {
                console.log('DOne////////////')
                next();
            }).catch(function (err) {
                console.log('Errored////////////')
                next(err);
            });

    };
}