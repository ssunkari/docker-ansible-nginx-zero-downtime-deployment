 var _ = require('lodash');
 module.exports = function (redisClient, houseshareKey) {
     return redisClient.smembersAsync('HMS:' + houseshareKey)
         .map(function (userKey) {
             console.log('Get House share User Key ::', 'UHS:' + userKey + ':' + houseshareKey);
             return redisClient.hgetallAsync('UHS:' + userKey + ':' + houseshareKey);
         })
         .then(function (userTenancyRecord) {
             console.log('Get House share users:: Ind User::',
                 userTenancyRecord);
             return _.filter(userTenancyRecord, function () {
                 return !userTenancyRecord.endDate || (userTenancyRecord.endDate && moment(userTenancyRecord.endDate) < moment());
             });
         })
         .map(function (userTenancyRecord) {
             console.log('Get House share users:: Filtered Records', userTenancyRecord);
             return redisClient.hgetallAsync(userTenancyRecord.uid)
         }).map(function (user) {
             return {
                 'uid': user.id,
                 'emailId': user.username,
                 'friendlyName': user.friendlyName,
                 'phone': user.phone
             };
         });
 }