var createError = require('createerror');
var httpErrors = require('httperrors');
var socketCodesMap = require('./socketCodesMap');

var socketErrors = module.exports = function (err) {
    var errorName;

    if (socketErrors.hasOwnProperty(err.code)) {
        errorName = err.code;
    } else {
        errorName = 'NotSocketError';
    }

    return new socketErrors[errorName](err);
};

// create an Unknown error sentinel
socketErrors.NotSocketError = createError({name: 'NotSocketError'}, httpErrors.Unknown);

// create a new socket error for each error code
Object.keys(socketCodesMap).forEach(function (errorCode) {
    var statusCode = socketCodesMap[errorCode];

    socketErrors[errorCode] = createError({
        name: errorCode
    }, httpErrors[statusCode]);
});
