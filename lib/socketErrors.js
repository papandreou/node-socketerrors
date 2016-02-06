var createError = require('createerror');
var httpErrors = require('httperrors');
var socketCodesMap = require('./socketCodesMap');
var _ = require('lodash');

var SocketError = createError({ name: 'SocketError' });

function createSocketError(errorCode) {
    var statusCode = socketCodesMap[errorCode] || 'Unknown';

    var options = _.defaults({
        name: errorCode,
        code: errorCode,
        statusCode: statusCode,
        status: statusCode
    }, _.omit(httpErrors(statusCode), 'message'));

    var socketError = createError(options, SocketError);

    socketErrors[errorCode] = socketError;

    return socketError;
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

// export the base class
module.exports.SocketError = SocketError;

// create an Unknown error sentinel
socketErrors.NotSocketError = createSocketError('NotSocketError');

// create a new socket error for each error code
Object.keys(socketCodesMap).forEach(createSocketError);
