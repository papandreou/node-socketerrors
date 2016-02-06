var expect = require('unexpected');
var httpErrors = require('httperrors');
var http = require('http');
var socketCodesMap = require('../lib/socketCodesMap');
var socketErrors = require('../lib/socketErrors');

describe('socketErrors', function () {

    it('will create a properly subclassed instance', function (done) {
        // capture a genuine ECONNREFUSED error
        http.get('http://localhost:59891/').on('error', function (err) {
            var socketError = socketErrors(err);
            var httpError = new httpErrors[504]();

            expect(socketError, 'to equal', new socketErrors[err.code](err));

            // has the original error propeties
            expect(socketError, 'to have properties', Object.keys(err));

            // has the httpError properties
            expect(socketError, 'to have properties', Object.keys(httpError));

            // has named errorCode property
            expect(socketError[err.code], 'to be true');

            expect(socketError, 'to be a', socketErrors.SocketError);

            done();
        });
    });

    it('will return unknown error if it was not mapped', function () {
        var err = new Error();
        var socketError = socketErrors(err);

        expect(socketError, 'to equal', new socketErrors.NotSocketError());

        // has named errorCode property
        expect(socketError.NotSocketError, 'to be true');
    });

    it('will not alter the original error', function () {
        var err = new Error();
        err.code = 'ECONNREFUSED';
        var socketError = socketErrors(err);

        // assert socketError was altered
        expect(socketError, 'to equal', new socketErrors[err.code](err));

        // assert orignal err was untouched
        expect(err, 'not to have properties', ['statusCode']);
    });

    // check the various error codes will be transformed correctly
    Object.keys(socketCodesMap).forEach(function (errorCode) {
        var statusCode = socketCodesMap[errorCode];

        describe(errorCode, function () {
            it('is correctly instantiated', function () {
                var err = new Error();
                err.code = errorCode;
                var socketError = socketErrors(err);

                expect(socketError, 'to equal', new socketErrors[errorCode](err));

                // has named errorCode property
                expect(socketError[errorCode], 'to be true');
            });

            it('returns a ' + statusCode, function () {
                var socketError = socketErrors((function () {
                    var err = new Error();
                    err.code = errorCode;
                    return err;
                })());

                expect(socketError.statusCode, 'to equal', statusCode);
            });

            it('lets the `code` from the original instance take precedence over the one built into the class', function () {
                var err = new Error();
                err.code = 'SOMETHINGELSE';
                var socketError = socketErrors(err);

                expect(socketError.code, 'to equal', 'SOMETHINGELSE');
            });

            describe('when instantiated via the constructor', function () {
                it('has a `code` property', function () {
                    expect(new socketErrors[errorCode]().code, 'to equal', errorCode);
                });
            });
        });
    });

});
