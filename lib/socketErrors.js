var createError = require('createerror');
var httpErrors = require('httperrors');
var socketCodesMap = require('./socketCodesMap');

function createSocketError(errorCode) {
    var statusCode = socketCodesMap[errorCode] || 'Unknown';

    return socketErrors[errorCode] = createError({
        name: errorCode
    }, httpErrors[statusCode]);
}

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
socketErrors.NotSocketError = createSocketError('NotSocketError');

// create a new socket error for each error code
Object.keys(socketCodesMap).forEach(createSocketError);
