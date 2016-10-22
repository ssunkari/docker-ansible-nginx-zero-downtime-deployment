var sha1 = require('sha1');
module.exports = function (input) {
    return sha1(input).substring(0, 10);
}