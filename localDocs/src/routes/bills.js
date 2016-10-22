var express = require('express');
var middleware = require('../middleware');
var router = express.Router();

module.exports = function (redisClient, emailClient, smsClient) {
    /* GET Expenses View*/
    router.get('/',
        middleware.houseshares.setPropertyFromRequest('uid'),
        middleware.houseshares.users.userExists(redisClient),
        middleware.houseshares.users.getUserHouseshareInfo(redisClient),
        // middleware.houseshares.users.setHousematesNotificationSettings(redisClient),
        //   require('connect-ensure-login').ensureLoggedIn('/'),
        function (req, res) {
            console.objectLog(req.user);
            res.render('bills', {
                title: 'Add a bill',
                errors: [],
                uid: req.uid,
                user: req.user
            });
        });

    router.post('/',
        middleware.houseshares.setPropertyFromRequest('uid'),
        middleware.houseshares.users.userExists(redisClient),
        middleware.houseshares.users.getUserHouseshareInfo(redisClient),
        middleware.houseshares.users.setHousematesNotificationSettings(redisClient),
        middleware.houseshares.bills.addBill(redisClient),
        middleware.houseshares.bills.buildNotifyMessage,
        //    middleware.houseshares.notifications.notifyHousemates(emailClient, smsClient),
        //   require('connect-ensure-login').ensureLoggedIn('/'),
        function (req, res) {
            console.dir(req.user);
            res.render('bills', {
                title: 'Add a bill',
                uid: req.uid,
                user: req.user,
                message: 'Bill Added Successfully'
            });
        });

    return router;
}