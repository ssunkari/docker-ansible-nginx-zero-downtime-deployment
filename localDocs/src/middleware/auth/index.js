module.exports = function (redisClient) {
    return {
        users: require('./users')(redisClient)
    };
}