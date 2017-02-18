module.exports = function () {
    return function (req, res, next) {
        console.dir('activate ', req.activated);
        res.render('signup', {
            title: getPageTitle('Signup'),
            userExist: req.ctx.userExist,
            userActivated: req.ctx.activated,
            username: req.ctx.uid,
            success: true
        });
    }
};