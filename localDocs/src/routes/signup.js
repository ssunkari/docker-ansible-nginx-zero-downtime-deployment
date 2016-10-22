var express = require('express');
var middleware = require('../middleware');
var router = express.Router();

module.exports = function (redisClient, emailClient) {

    router.post('/', middleware.houseshares.setPropertyFromRequest('username'),
        middleware.signup.validateUserByEmail(redisClient),
        middleware.signup.register(redisClient),
        middleware.signup.sendEmail(emailClient),
        middleware.signup.render());

    router.get('/', function (req, res) {
        res.render('signup', {
            title: 'Divider-Signup Page',
            errors: []
        });
    });
    router.get('/resend/email', middleware.houseshares.setPropertyFromRequest('uid'),
        middleware.signup.sendEmail(emailClient),
        function (req, res, next) {
            res.redirect('/');
        }
    );

    router.get('/activate/:uid',
        middleware.houseshares.setPropertyFromRequest('uid'),
        middleware.houseshares.users.userExists(redisClient),
        middleware.signup.activate(redisClient),
        function (req, res, next) {
            res.redirect('/profile?uid=' +
                req.uid);
        }
    );
    return router;
};