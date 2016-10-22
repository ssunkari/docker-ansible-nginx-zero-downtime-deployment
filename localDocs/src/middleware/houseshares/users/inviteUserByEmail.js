function addEmailBody() {
    return 'Welcome to Divider please click below link to setup your account <a href="https://divider.herokuapp.com/signup">';
}
module.exports = function (emailClient) {
    return function (req, res, next) {
        var username = req.uid.trim();
        emailClient(username, {
                subject: 'App Invite',
                text: addEmailBody()
            })
            .then(function () {
                console.log('Email Client :: Email Sent');
                next();
            })
            .catch(function (err) {
                next(err);
            });
    };
}