var moment = require('moment');
var Promise = require('bluebird');
var knownUserSettings = ['phone', 'password', 'friendlyName']

module.exports = function (redisClient) {
    return function (req, res, next) {
        console.log('Object Length ', Object.keys(req.body));
        if (req.body && Object.keys(req.body).length > 0) {
            Promise.map(Object.keys(req.body), function (fieldName) {
                if (knownUserSettings.indexOf(fieldName) != -1) {
                    return redisClient.hmsetAsync(req.uid, [fieldName, req.body[fieldName]]);
                } else {
                    return Promise.resolve({});

                }
            }).then(next());
        } else {
            console.log('Update settings no form data in body post ', Object.keys(req.body));
            next();
        }
    };
}