var createError = require('createerror');
var HttpError = require('httperrors');
var socketCodesMap = require('./socketCodesMap');

var SocketError = module.exports = createError({
    name: 'SocketError',
    preprocess: function (err) {
        if (!(err instanceof SocketError)) {
            if (typeof err === 'string') {
                return new SocketError[err]();
            } else if (err && err.code && socketCodesMap.hasOwnProperty(err.code)) {
                return new SocketError[err.code](err);
            }
            // else return generic SocketError
        }
    }
});

function allKeys(o) {
    var keys = [];

    for (var key in o) keys.push(key);

    return keys;
}

SocketError.supports = function (errorOrErrorCode) {
    if (typeof errorOrErrorCode === 'string') {
        return socketCodesMap.hasOwnProperty(errorOrErrorCode);
    } else if (errorOrErrorCode && errorOrErrorCode.code) {
        return socketCodesMap.hasOwnProperty(errorOrErrorCode.code);
    } else {
        return false;
    }
};

// For backwards compatibility
SocketError.SocketError = SocketError;

// create a new socket error for each error code
Object.keys(socketCodesMap).forEach(function (errorCode) {
    var statusCode = socketCodesMap[errorCode];
    var options = {
        name: errorCode,
        code: errorCode,
        statusCode: statusCode,
        status: statusCode
    };

    // get constructed httpError to use to grab what we need to 'quack' like it
    var httpError = HttpError(statusCode);
    var httpErrorKeys = allKeys(httpError);

    // copy keys from the httpError to the socketError
    httpErrorKeys.forEach(function (key) {
        if (!options[key] && key !== 'message') {
            options[key] = httpError[key];
        }
    });
    options.http = false;
    options.HttpError = false;
    SocketError[errorCode] = createError(options, SocketError);
});
