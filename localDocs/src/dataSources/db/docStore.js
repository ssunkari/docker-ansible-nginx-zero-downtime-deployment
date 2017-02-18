'use strict'
var debugLog = require('debug-log')('couchbase');

function parseValueWalkAround(value) {
    if (Buffer.isBuffer(value) || typeof (value) === 'string') {
        return JSON.parse(value);
    } else {
        return value;
    }
}

module.exports = function create(couchbaseFactory, options) {
    var cbErrorCodes = {
        keyNotFound: 13
    };

    var couchbaseDb;
    initCb();

    function initCb() {
        couchbaseFactory(options, function (err, db) {
            if (err) {
                throw err;
            }
            couchbaseDb = db;
        });
    }

    function upsert(key, data, callback) {
        couchbaseDb.upsert(key, data, callback);
    }

    function getKeys(keys) {
        let docKeys = [];
        if (keys instanceof Array) {
            docKeys = keys;
        } else {
            docKeys.push(keys);
        }
        return docKeys;
    }

    function getDoc(key, callback) {

        couchbaseDb.get(key, function (err, result) {
            if (err)
                callback(new Error('Db error'));
            else
                callback(null, parseValueWalkAround(result.value));
        })
    }

    function getDocs(keys, callback) {

        var originalDomain = process.domain || {
            run: function (f) {
                f();
            }
        };

        couchbaseDb.getMulti(getKeys(keys), processMultiGetResponse);

        function processMultiGetResponse(errCount, results) {
            debugLog('Number of documents found: ', results.length);
            originalDomain.run(function () {
                var response = {};
                for (var k in results) {
                    var result = results[k];

                    if (!result.error) {
                        response[k] = parseValueWalkAround(result.value);
                    } else if (result.error.code !== cbErrorCodes.keyNotFound) {
                        return callback(new Error('Db error'));
                    }
                }
                callback(null, response);
            });
        }
    }
    return {
        getDocs: getDocs,
        upsert: upsert,
        getDoc: getDoc
    };
};