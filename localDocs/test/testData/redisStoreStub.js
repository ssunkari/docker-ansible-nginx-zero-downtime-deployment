var userProfile = {
    "activated": "true",
    "friendlyName": "sri",
    "houseshareKey": "HS:Cgb:Pm145hd:H35",
    "houseshareSetup": "true",
    "id": "9e1e2d2473",
    "imageFileName": "default.png",
    "lastmodified": "2016-04-24",
    "password": "40bd001563",
    "username": "sr.sunkari@gmail.com"
};
var houseProfile = {
    "uid": "9e1e2d2473",
    "houseshareKey": "HS:Cgb::Pm145hd:H35",
    "startDate": "2016-04:-24",
    "lastmodified": "2016-04:-24"
};
var keyValuePairs = {};

keyValuePairs['9e1e2d2473'] = userProfile;
keyValuePairs['UHS:9e1e2d2473:HS:Cgb:Pm145hd:H35'] = houseProfile;

var Promise = require('bluebird');

module.exports = {
    getByKey: function (key) {
        return Promise.resolve(keyValuePairs[key]);
    },
    stubData: keyValuePairs
};