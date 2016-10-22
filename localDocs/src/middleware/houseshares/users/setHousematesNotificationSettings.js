 var _ = require('lodash');
 var Promise = require('bluebird');
 module.exports = function (redisClient, houseshareKey) {
     return function (req, res, next) {
         Promise.map(req.user.houseshare.currentUsers, function (user) {
             console.log('Set All users NOtif Settings', 'SMS:NOTIF:' + user.uid + ':' + req.user.houseshareKey);

             var smsNotifSettings = redisClient.hgetallAsync('SMS:NOTIF:' + user.uid + ':' + req.user.houseshareKey);
             var emailNotifSettings = redisClient.hgetallAsync('EMAIL:NOTIF:' + user.uid + ':' + req.user.houseshareKey);

             return Promise.join(smsNotifSettings, emailNotifSettings, function (smsNotifSettings, emailNotifSettings) {
                 console.log('Get User NOtif Settings', user);
                 user.smsNotifSettings = smsNotifSettings;
                 user.emailNotifSettings = emailNotifSettings;
                 return user;
             });

         }).then(function (users) {
             req.user.houseshare.currentUsers = users;
             next();
         });
     }
 }