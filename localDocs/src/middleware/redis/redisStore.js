// var redisClient = require('../../redisClient');
// var Promise = require('bluebird');
// module.exports = {
//     hmset: function (key, arrayOfKeyValuePairs) {
//         return redisClient.hmsetAsync(key, arrayOfKeyValuePairs);
//     },
//     sadd: function (key, value) {
//         return redisClient.saddAsync(key, value);
//     },
//     smembers: function (key) {
//         return redisClient.smembersAsync(key);
//     },
//     getByKey: function (key) {
//         return redisClient.hgetallAsync(key);
//     },
//     keys: function (pattern) {
//         return redisClient.keysAsync(pattern);
//     },
//     getByWildcardKey: function (wildcardKey) {
//         return Promise.all(redisClient.keysAsync(wildcardKey).then(function (keys) {
//             return keys.map(function (key) {
//                 return {
//                     key: key,
//                     value: redisClient.hgetallAsync(key)
//                 };
//
//             });
//         }));
//     },
//     delHashKeyValue: function (key, hashKeyToDelete) {
//         return redisClient.hdelAsync(key, hashKeyToDelete);
//     },
//     flushdb: function (callback) {
//         return redisClient.flushdb(callback);
//     }
// };