var express = require('express');
var router = express.Router();
var passport = require('passport');

function normalizedCtx(ctx) {
    var month = ctx.month || '';
    var tenantName = ctx.tenant || '';
    return {
        year: ctx.year.replace(':', ''),
        month: month.replace(':', ''),
        tenantName: tenantName.replace(':', '')
    };
}
/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {
        title: 'DocTime-Login Page',
        errors: []
    });
});

router.get('/login', function (req, res) {
    res.render('login', {
        title: 'DocTime-Login Page',
        errors: []
    });
});

router.get('/logout',
    function (req, res) {
        req.session.destroy(function (err) {
            req.logout();
            res.redirect('/'); //Inside a callback… bulletproof!
        });
    });

router.post('/', function (req, res, next) {
    passport.authenticate('local',
        function (err, user, info) {
            if (err) {
                return next(err, info);
            }
            if (!user) {
                return res.render('login', {
                    title: 'DOC TIME - Login Page',
                    errMsg: 'We are unable to log you in at this time. Please try again or email admin for assistance.'
                });
            }
            if (!user.activated || user.activated == false) {
                return res.render('index', {
                    title: 'DOC TIME - Login Page',
                    notActivated: true,
                    username: req.body.username,
                });
            }

            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.redirect('/profile?uid=' + req.user.id);
            });
        })(req, res, next);

});
module.exports = router;