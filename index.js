
var makeAbortable = function(regularPromise) {
  var wrappedPromise = regularPromise.then(function(result) {
    console.log(2);
    return new Promise(function(resolve, reject) {
      wrappedPromise._resolve(resolve, result);
    });
  }).catch(function(error) {
    return new Promise(function(resolve, reject) {
      wrappedPromise._reject(reject, error);
    });
  });
  wrappedPromise.aborted = false;
  wrappedPromise.finished = false;
  wrappedPromise.abort = function() {
    this.aborted = true;
  };
  wrappedPromise.then = function(callback) {
    var p = new AbortablePromise();
    var potentialPromise = ... p.then(callback);
    return p;
  };
  wrappedPromise.catch = function(callback) {
    var p = new AbortablePromise();
    p.catch(callback);
    return p;
  };
  wrappedPromise._resolve = function(resolve, result) {
    console.log(4);
    if (!this.aborted && !this.finished) {
      this.finished = true;
      return resolve(result);
    }
  };
  wrappedPromise._reject = function(reject, error) {
    if (!this.aborted && !this.finished) {
      this.finished = true;
      return reject(error);
    }
  };
  return wrappedPromise;
};

/**
 * @param {function} promiseCallback
 * @constructor
 */
var AbortablePromise = function(promiseCallback) {
  var p = new Promise(promiseCallback);
   var abortablePromise = makeAbortable(p);
  return abortablePromise;
};

module.exports = AbortablePromise;
