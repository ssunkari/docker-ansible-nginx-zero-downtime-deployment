var app = require('../src/app');
var request = require('supertest');
var wrappedApp = function (req, res) {
    var domain = require('domain').create();
    domain.add(req);
    domain.add(res);
    domain.run(function () {
        app(req, res);
    });
};
var agent = request(wrappedApp);

function messageTester(req, suffix, done) {

    if (arguments.length === 2) {
        done = suffix;
        suffix = undefined;
    }
    var url = '/';
    if (suffix) {
        url += suffix;
    }
    agent
        .post(url)
        .send(req)
        .expect(200)
        .end(function (err) {
            if (err) {
                return done(err);
            }
            if (done) {
                done();
            }
        });
}

function reqPostTester(url, expectedResponse, callback) {
    agent
        .get(url)
        .expect(200)
        .expect(expectedResponse)
        .end(function (err) {
            console.log('utl', url);

            if (err) {
                return callback(err);
            }
            callback();
        });
}

function roomTotalTester(request, expectedResponse, prefix, callback) {
    var prefixUrl;
    if (arguments.length === 3) {
        callback = prefix;
    } else {
        prefixUrl = prefix;
    }
    var urlPrefixPath = '';
    if (prefixUrl) {
        urlPrefixPath += '/' + prefixUrl;
    }
    urlPrefixPath += '/total/' + request.year;
    if (request.month) {
        urlPrefixPath += '/' + request.month;
    }
    if (request.tenantName) {
        urlPrefixPath += '/' + request.tenantName;
    }

    console.log(urlPrefixPath);
    reqPostTester(urlPrefixPath, expectedResponse, callback);

}
module.exports = {
    messageTester: messageTester,
    roomTotalTester: roomTotalTester,
    reqPostTester: reqPostTester
};