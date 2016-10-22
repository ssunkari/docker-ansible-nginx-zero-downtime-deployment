module.exports = function (emailClient) {
    return function (emailAddress, subject, mailBody) {
        console.log('Email Sending for Added Bills');
        return emailClient(emailAddress, {
            subject: subject,
            text: mailBody
        });
    };
};