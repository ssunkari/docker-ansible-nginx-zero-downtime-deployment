var express = require('express');
var middleware = require('../middleware');
var router = express.Router();

module.exports = function (docStore) {

    router.get('/',
        middleware.loggedIn,
        middleware.request.setPropertyFromRequest('uid', 'uid'),
        function (req, res, next) {
            docStore.getDocAsync(req.ctx.uid).then((userDoc) => {
                req.ctx.user = userDoc;
                next();
            })
        },
        function (req, res) {
            console.dir(req.user);
            res.render('doctors_profile', {
                title: getPageTitle('Profile'),
                uid: req.ctx.uid,
                user: req.ctx.user
            });
        });

    router.get('/user/:uid', middleware.houseshares.setPropertyFromRequest('uid'),
        middleware.houseshares.users.userExists(docStore),
        middleware.houseshares.users.getUserHouseshareInfo(docStore),
        function (req, res) {
            res.render('user', {
                title: 'Divider-User Profile',
                uid: req.params.uid,
                user: req.user
            });
        });

    router.get('/edit/:uid', middleware.request.setPropertyFromRequest('uid', 'uid'),
        function (req, res, next) {
            docStore.getDocAsync(req.ctx.uid).then((userDoc) => {
                req.ctx.user = userDoc;
                next();
            })
        },
        function (req, res) {
            res.render('edit_profile', {
                title: getPageTitle('User Profile Form'),
                uid: req.ctx.uid,
                user: req.ctx.user
            });
        });

      router.post('/edit/:uid',middleware.request.setPropertyFromRequest('uid', 'uid'),
       middleware.profile.render(docStore),
          function (req, res) {
              res.render('edit_profile', {
                  title: getPageTitle('User Profile Form'),
                  uid: req.ctx.uid,
                  user: req.ctx.user
              });
          });

    router.post('/user/:uid',
        middleware.houseshares.setPropertyFromRequest('uid'),
        middleware.houseshares.users.userExists(docStore),
        middleware.houseshares.users.uploadFileToDisk,
        middleware.houseshares.users.setImagePathToUserProfile(docStore),
        middleware.houseshares.users.addorModifyUserSetting(docStore),
        middleware.houseshares.users.getUserHouseshareInfo(docStore),
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
