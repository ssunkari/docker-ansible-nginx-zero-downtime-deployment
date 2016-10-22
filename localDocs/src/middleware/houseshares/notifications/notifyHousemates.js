var sendEmail = require('./sendEmail');
var sendSms = require('./sendSms');
var Promise = require('bluebird');
module.exports = function (emailClient, smsClient) {
    return function (req, res, next) {
        Promise.map(req.user.houseshare.currentUsers, function (user) {
                console.log(req.notifyMessage);
                var notifArray = [];
                if (user.smsNotifSettings.addBill) {
                    console.log('Bill Added:: Sms Sending');
                    notifArray.push(sendSms(smsClient)(user.phone, req.notifyMessage));
                }
                if (user.emailNotifSettings.addBill) {
                    console.log('Bill Added:: Email Sending');
                    notifArray.push(sendEmail(emailClient)(user.emailId, 'Bill Added', req.notifyMessage));
                }
                return Promise.all(notifArray);
            })
            .then(next())
            .catch(function (err) {
                next(err);
            });
    };
}