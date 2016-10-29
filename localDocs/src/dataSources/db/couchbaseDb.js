'use strict';

var couchbase = require('couchbase');

module.exports = function create(options, callback) {
    var cluster = new couchbase.Cluster(options.host);
    cluster.openBucket(options.bucket, options.password, function (err) {
        if (err) {
            return callback(err);
        }
        // Added this to allow large searches to complete (1700 hotels x 14 days)
        this.operationTimeout = 10000;
        callback(undefined, this);
    });
};