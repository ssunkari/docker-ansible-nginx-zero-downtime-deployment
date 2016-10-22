var express = require('express');
var middleware = require('../middleware');
var router = express.Router();

module.exports = function (redisClient, emailClient) {
    router.get('/new', function (req, res) {
        res.render('housesharesNew', {
            title: 'Divider-HouseShares',
            uid: req.query.uid
        });
    });

    router.get('/sendInvite', middleware.houseshares.setPropertyFromRequest('uid'),
        middleware.signup.validateUserByEmail(redisClient),
        function (req, res, next) {
            if (req.userExist) {
                res.send('user already exists');
            } else {
                next();
            }

        },
        middleware.houseshares.users.inviteUserByEmail(emailClient),
        function (req, res) {
            res.send('Invite has been sent');
        });

    router.get('/addHousemate', middleware.houseshares.setPropertyFromRequest('uid'),
        middleware.houseshares.users.userExists(redisClient),
        middleware.houseshares.users.getUserHouseshareInfo(redisClient),
        middleware.houseshares.users.render());

    router.get('/bills', middleware.houseshares.setPropertyFromRequest('uid'),
        middleware.houseshares.users.userExists(redisClient),
        middleware.houseshares.users.getUserHouseshareInfo(redisClient),
        middleware.houseshares.bills.render)

    router.post('/new', middleware.houseshares.setPropertyFromRequest('uid'),
        middleware.houseshares.users.userExists(redisClient),
        middleware.houseshares.addNew(redisClient),
        middleware.houseshares.userSettings.setHouseSetupFlag(redisClient),
        middleware.houseshares.userSettings.setTenancyAgreement(redisClient),
        middleware.houseshares.houseConfig.addDefaultUtilCategories(redisClient),
        middleware.houseshares.users.setUpNotifications(redisClient),
        middleware.houseshares.houseConfig.addHousemates(redisClient),

        function (req, res) {
            res.redirect('/profile/' + req.uid);
        });
    return router;
}