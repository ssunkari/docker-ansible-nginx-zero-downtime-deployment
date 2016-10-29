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

    function getDocs(keys, callback) {
        var originalDomain = process.domain || {
            run: function (f) {
                f();
            }
        };
        couchbaseDb.getMulti(keys, processMultiGetResponse);

        function processMultiGetResponse(errCount, results) {
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
        getDocs: getDocs
    };
};