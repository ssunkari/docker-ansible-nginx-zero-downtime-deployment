module.exports = function () {
    return function (req, res, next) {
        res.render('signup', {
            title: 'Divider-Signup Page',
            userExist: req.userExist,
            userActivated: req.activated,
            username: req.uid,
            success: true
        });
    }
};