'use strict';
module.exports = {
    couchbase: {

    },
    redis: {
        rediscloud_url: 'redis://rediscloud:password@192.168.50.2:6379'

    },
    sendGrid: {
        apiKey: process.env.SGAPIKEY
    },
    twilio: {
        accountSid: 'ACd14aa08f5708d3fc846f1443e7f0ecee',
        authToken: '4092f696d31f6128b62c47c7a32e3060',
        senderNumber: '+441392694037'
    }
};