var moment = require('moment');

module.exports = function (req, res, next) {
    req.notifyMessage = 'Bill Added by ' + req.user.friendlyName + ' for Item ' + req.body.costName + ' of type ' + req.body.utilType + ' in amount £' + req.body.amount;
    next();
};