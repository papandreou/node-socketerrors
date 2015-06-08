node-httperrors
===============

Exposes a function mapping socket errors to SocketError objects subclassing
<a href="https://github.com/One-com/node-httperrors">httpErrors</a>.

The defined SocketError objects are created via
<a href="https://github.com/One-com/node-createerror">createError</a>.

Installation
------------

Make sure you have node.js and npm installed, then run:

    npm install socketerrors

Usage
-----

The primary use case is wrapping errors originating from socket operations:

    var http = require('http');
    var socketErrors = require('socketerrors');

    http.get('nonexistent').on('error', function (err) {
        var socketError = socketErrors(err);

        console.warn(err.toString()); // ECONNREFUSED: connect ECONNREFUSED
    });


Other errors will be marked as not being socket errors:

    var socketErrors = require('socketerrors');

    var err = new Error();
    var socketError = socketErrors(err);

    if (socketError.NotSocketError) {
        // what am I?
    }


License
-------

3-clause BSD license -- see the `LICENSE` file for details.
