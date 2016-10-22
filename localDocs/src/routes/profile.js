var express = require('express');
var middleware = require('../middleware');
var router = express.Router();

module.exports = function (redisClient) {

    router.get('/',
        middleware.loggedIn,
        middleware.houseshares.setPropertyFromRequest('uid'),
        middleware.houseshares.users.userExists(redisClient),
        middleware.houseshares.users.getUserHouseshareInfo(redisClient),
        function (req, res) {
            console.dir(req.user);
            res.render('doctors_profile', {
                title: 'DocTime-User Profile',
                uid: req.uid,
                user: req.user
            });
        });

    router.get('/user/:uid', middleware.houseshares.setPropertyFromRequest('uid'),
        middleware.houseshares.users.userExists(redisClient),
        middleware.houseshares.users.getUserHouseshareInfo(redisClient),
        function (req, res) {
            res.render('user', {
                title: 'Divider-User Profile',
                uid: req.params.uid,
                user: req.user
            });
        });

    router.post('/user/:uid',
        middleware.houseshares.setPropertyFromRequest('uid'),
        middleware.houseshares.users.userExists(redisClient),
        middleware.houseshares.users.uploadFileToDisk,
        middleware.houseshares.users.setImagePathToUserProfile(redisClient),
        middleware.houseshares.users.addorModifyUserSetting(redisClient),
        middleware.houseshares.users.getUserHouseshareInfo(redisClient),
        //   require('connect-ensure-login').ensureLoggedIn('/'),
        function (req, res) {
            console.log('Get User -===========', req.uid);
            res.render('user', {
                title: 'Divider-User Profile',
                uid: req.uid,
                user: req.user,
                error: req.fileUploadSuccess ? 'Image Uploaded Sucessfully' : 'Saved the user profile settings'
            });
        });

    return router;
}