var express = require('express');
var middleware = require('../middleware');
var router = express.Router();

module.exports = function (redisClient, emailClient) {

    router.post('/passwordRecovery', function (req, res, next) {
            req.uid = req.body.username;
            next();
        },
        middleware.signup.validateUserByEmail(redisClient),
        function (req, res, next) {
            if (req.userExist) {
                req.passwordRecovery = true;
                req.message = 'Email sent please click the link to reset password';
                next();
            } else {
                res.render('passwordRecovery', {
                    title: 'Divider-Password Recovery',
                    message: 'User does not exist'
                });
            }

        }, middleware.signup.sendEmail(emailClient),
        function (req, res) {
            res.render('passwordRecovery', {
                title: 'DocTime-Password Recovery',
                message: req.message
            });
        });

    router.get('/passwordRecovery', function (req, res) {
        res.render('passwordRecovery', {
            title: 'Divider-Password Recovery'
        });
    });

    router.get('/passwordReset/:uid', function (req, res) {
        res.render('passwordReset', {
            title: 'Divider-Password Recovery',
            uid: req.params.uid
        });
    });

    router.post('/passwordReset/:uid',
        middleware.houseshares.setPropertyFromRequest('uid'),
        middleware.houseshares.users.userExists(redisClient),
        middleware.signup.changePassword(redisClient),
        function (req, res) {
            res.render('passwordReset', {
                title: 'Divider-Password Reset',
                success: req.success,
                message: !req.userExist ? 'User does not exist' : ''
            });
        });
    return router;
};