var config = require('./config');
var Promise = require('bluebird');
var sendgrid = Promise.promisifyAll(require('sendgrid')(config.get('sendGrid:apiKey')));

module.exports = function (emailAddress, details) {
    return sendgrid.sendAsync({
        to: emailAddress,
        from: 'divider@herokuapp.com',
        subject: details.subject,
        text: details.text
    });
};