var redisStore = require('../middleware/redis/redisStore');
var moment = require('moment');
require('moment-range');

function setStartDateOfMonth(date) {
    return moment(date).startOf('month');
}

function setEndDateOfMonth(date) {
    if (!date) {
        return null;
    }
    return moment(date).endOf('month');
}

module.exports = {

    byHouseShareKey: function (key, startDate, callback) {
        var enquiryStartDate = moment(startDate).startOf('month');
        redisStore.getByKey('UHS:' + user.id + ':' + user.houseshareKey)
            .then(function (tenancyAgreement) {

                var tenancyDateRange = moment.range(setStartDateOfMonth(tenancyAgreement.startDate), setEndDateOfMonth(tenancyAgreement.endDate));
                var currentEnquiryDateStatus = {
                    stayDate: enquiryStartDate.format('YYYY-MM-DD')
                };

                if (tenancyDateRange.contains(enquiryStartDate)) {
                    currentEnquiryDateStatus.active = true;
                }

                user.status.push(currentEnquiryDateStatus);
                console.log(JSON.stringify(user));
                return callback(null, [user]);
            });
    }
    byUserId: function (userId, callback) {
        redisStore.getByKey(userId).then(function (user) {
            if (!user) {
                return callback(null, []);
            }
            user.status = [];
        });
    }
}