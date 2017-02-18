'use strict'
var shaGen = require('../shaGen.js');
var debugLog = require('debug-log')('user');
module.exports = function (docstore) {
    return function (req, res, next) {
        if (req.uid) {
            var userKey = shaGen(req.ctx.uid.trim().toLowerCase());
            docstore.getDocsAsync(userKey).then(function (userDoc) {
                if (Object.keys(userDoc).length) {
                    let user = userDoc[userKey];
                    req.userExist = true;
                    req.activated = user.activated
                    debugLog('validation:: User Exists');
                }
                next();
            });
        } else {
            next('Username not being set');
        }
    };
}