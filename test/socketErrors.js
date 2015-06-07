var expect = require('unexpected');
var httpErrors = require('httpErrors');
var http = require('http');
var socketCodesMap = require('../lib/socketCodesMap');
var socketErrors = require('../lib/socketErrors');

describe('socketErrors', function () {

    it('will copy all error information to an httpError', function (done) {
        // capture a genuine ECONNREFUSED error
        http.get('nonexistent').on('error', function (err) {
            var socketError = socketErrors(err);

            expect(socketError, 'to equal', new httpErrors[504](err));

            expect(socketError, 'to have properties', ['code', 'errno', 'syscall']);

            done();
        });
    });

    it('will return unknown error if it was not mapped', function () {
        var err = new Error();
        var socketError = socketErrors(err);

        expect(socketError, 'to equal', new httpErrors.Unknown());
    });

    it('will not alter the original error', function () {
        var err = new Error();
        err.code = 'ECONNREFUSED';
        var socketError = socketErrors(err);

        // assert socketError was altered
        expect(socketError, 'to equal', httpErrors[504](err));

        // assert orignal err was untouched
        expect(err, 'not to have properties', ['statusCode']);
    });

    // check the various error codes will be transformed correctly
    Object.keys(socketCodesMap).forEach(function (errorCode) {
        var statusCode = socketCodesMap[errorCode];

        describe(errorCode, function () {
            it('returns a ' + statusCode, function () {
                var err = new Error();
                err.code = errorCode;
                var socketError = socketErrors(err);

                expect(socketError, 'to equal', new httpErrors[statusCode](err));
            });
        });
    });

});
