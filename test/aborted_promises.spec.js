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

    it('should be abort-able, resolve', function(done) {
        var promise = new AbortablePromise(function(resolve, reject) {
            resolve('foo');
        });
        promise.abort();
        promise.catch(function() {
            console.log('GOT HERE catch')
            throw new Error('NO!');
        });
        promise.then(function() {
            console.log('GOT HERE then')
            throw new Error('NO!');
        });
        setTimeout(function() {
            done();
        }, 100);
    });

    it('should be abort-able, reject', function(done) {
        var promise = new AbortablePromise(function(resolve, reject) {
            reject('foo');
        });
        promise.abort();
        promise.catch(function() {
            throw new Error('Should not be here');
        });
        promise.then(function() {
            throw new Error('Should not be here');
        });
        setTimeout(function() {
            done();
        }, 100);
    });

    it('should be abort-able, error', function(done) {
        var promise = new AbortablePromise(function(resolve, reject) {
            throw new Error('NONONO');
        });
        promise.abort();
        promise.catch(function(error) {
            throw new Error('Should not be here');
        });
        setTimeout(function() {
            done();
        }, 100);
    });

    it('should be chain-able', function(done) {
        var firstPromise = new AbortablePromise(function(resolve, reject) {
            resolve();
        });
        var secondPromise = firstPromise.then(function(error) {
            throw new Error('Should not be here');
        });
        secondPromise.abort();
        setTimeout(function() {
            done();
        }, 100);
    });
});