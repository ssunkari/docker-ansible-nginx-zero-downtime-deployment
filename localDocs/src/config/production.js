'use strict';
module.exports = {
    redis: {
        rediscloud_url: process.env.REDISCLOUD_URL
    },
    sendGrid: {
        apiKey: process.env.SGAPIKEY
    },
    twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        senderNumber: '+441392694037'
    }
};