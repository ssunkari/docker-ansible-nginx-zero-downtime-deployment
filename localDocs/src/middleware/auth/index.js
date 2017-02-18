module.exports = function (docStore) {
    return {
        users: require('./users')(docStore)
    };
}