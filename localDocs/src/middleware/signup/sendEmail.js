var shaGen = require('../shaGen.js');

function addEmailBody(req, userHash) {
    if (req.passwordRecovery) {
        return 'Welcome to DocTime please click below link to reset your password <a href="https://doctime.herokuapp.com/passwordReset/' + userHash + '"> ';
    }
    return 'Welcome to DocTime please click below link to activate your account <a href="https://doctime.herokuapp.com/signup/activate/' + userHash + '"> ';
}
module.exports = function (emailClient) {
    return function (req, res, next) {
        if (req.userExist) {
            console.log('Email Client :: User Exist', req.userExist);
            next();
        } else {
            var username = req.uid.trim();
            var userKey = shaGen(username).toLowerCase();

            emailClient(username, {
                    subject: 'New User Registration',
                    text: addEmailBody(req, userKey)
                })
                .then(function () {
                    console.log('Email Client :: Email Sent');
                    next();
                })
                .catch(function (err) {
                    next(err);
                });
        }
    };
}