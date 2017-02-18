var express = require('express');
var middleware = require('../middleware');
var router = express.Router();

module.exports = function (couchbaseCli, emailClient) {

    router.post('/', middleware.request.setPropertyFromRequest('uid', 'username'),
        middleware.signup.validateUserByEmail(couchbaseCli),
        middleware.signup.register(couchbaseCli),
        // middleware.signup.sendEmail(emailClient),
        middleware.signup.render());

    router.get('/', function (req, res) {
        res.render('signup', {
            title: getPageTitle('Signup'),
            errors: []
        });
    });

    router.get('/resend/email', middleware.request.setPropertyFromRequest('uid', 'uid'),
        middleware.signup.sendEmail(emailClient),
        function (req, res, next) {
            res.redirect('/');
        }
    );

    router.get('/activate/:uid',
        middleware.request.setPropertyFromRequest('uid', 'uid'),
        middleware.houseshares.users.userExists(couchbaseCli),
        middleware.signup.activate(couchbaseCli),
        function (req, res, next) {
            res.redirect('/profile?uid=' +
                req.uid);
        }
    );
    return router;
};