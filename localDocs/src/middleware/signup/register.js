var shaGen = require('../shaGen.js');

function addEmailBody(userHash) {
    return 'Welcome to Divider please click below link to activate your account <a href="https://divider.herokuapp.com/' + userHash + '/activate"> ';
}
module.exports = function (docStore, emailClient) {
    return function (req, res, next) {
        if (req.userExist) {
            console.log('Register', req.userExist);
            next();
        } else {
            var username = req.body.username.trim();
            var userKey = shaGen(username).toLowerCase();
            var passwordHash = shaGen(req.body.password.trim());
            docStore.upsertAsync(userKey, {
                "id": userKey,
                "friendlyName": req.body.friendly_name,
                "username": username,
                "password": passwordHash,
                "imageFileName": "default.png"
            }).then(function () {
                next();
            }).catch(function (err) {
                next(err);
            });
        }
    };
}