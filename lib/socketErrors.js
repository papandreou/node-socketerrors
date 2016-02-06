var createError = require('createerror');
var httpErrors = require('httperrors');
var socketCodesMap = require('./socketCodesMap');

var SocketError = createError({ name: 'SocketError' });

function allKeys(o) {
    var keys = [];

    for (var key in o) keys.push(key);

    return keys;
}

function createSocketError(errorCode) {
    var statusCode = socketCodesMap[errorCode] || 'Unknown';

    var options = {
        name: errorCode,
        code: errorCode,
        statusCode: statusCode,
        status: statusCode
    };

    // get constructed httpError to use to grab what we need to 'quack' like it
    var httpError = httpErrors(statusCode);
    var httpErrorKeys = allKeys(httpError);

    // copy keys from the httpError to the socketError
    httpErrorKeys.forEach(function (key) {
        if (!options[key] && key !== 'message') {
            options[key] = httpError[key];
        }
    });

    // create the socket error object
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
