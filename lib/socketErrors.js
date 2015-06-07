var httpErrors = require('httperrors');
var socketCodesMap = require('./socketCodesMap');

module.exports = function (err) {
    var httpErrorName;

    if (err.code && socketCodesMap.hasOwnProperty(err.code)) {
        httpErrorName = socketCodesMap[err.code];
    } else {
        httpErrorName = 'Unknown';
    }

    return new httpErrors[httpErrorName](err);
};
