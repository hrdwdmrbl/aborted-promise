var AbortablePromise = require(require('path').join(__dirname, '..', 'index.js'));
describe('AbortablePromise', function() {
    it('should be creatable', function() {
        new AbortablePromise(function() {});
    });
    it('should be resolve-able', function(done) {
        var promise = new AbortablePromise(function(resolve, reject) {
            resolve();
        });
        promise.then(function() {
            done();
        });
    });
    it('should be reject-able', function(done) {
        var promise = new AbortablePromise(function(resolve, reject) {
            reject();
        });
        promise.catch(function() {
            done();
        });
    });
    it('should be resolve-able with arg', function(done) {
        var promise = new AbortablePromise(function(resolve, reject) {
            resolve('foo');
        });
        promise.then(function(result) {
            console.assert(result === 'foo');
            done();
        });
    });
    it('should be reject-able with arg', function(done) {
        var promise = new AbortablePromise(function(resolve, reject) {
            reject(new Error('foo'));
        });
        promise.catch(function(error) {
            console.assert(error instanceof Error);
            done();
        });
    });

    it('should be abort-able with arg', function(done) {
        var promise = new AbortablePromise(function(resolve, reject) {
            resolve('foo');
        });
        promise.abort();
        promise.catch(function() {
            throw new Error('NO!');
        });
        promise.then(function() {
            throw new Error('NO!');
        });
        setTimeout(function() {
            done();
        }, 100);
    });
});