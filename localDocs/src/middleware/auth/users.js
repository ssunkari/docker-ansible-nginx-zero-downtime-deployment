'use strict'
let shaGen = require('../shaGen');

module.exports = function (docStore) {
    return {
        findById: function (id, cb) {
            process.nextTick(function () {
                var idx = id - 1;
                if (records[idx]) {
                    cb(null, records[idx]);
                } else {
                    cb(new Error('User ' + id + ' does not exist'));
                }
            });
        },
        findByUsername: function (username, password) {
            console.log('username', username);
            console.log('password', password);
            var username = username.trim().toLowerCase();
            let key = shaGen(username);
            return docStore.getDocsAsync(key).then((userDocs) => {
                return userDocs[key];
            });
        }
    }
};