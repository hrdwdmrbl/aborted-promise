/**
 * @param {function} promiseCallback
 * @constructor
 */
var AbortablePromise = function(promiseCallback) {
  // console.assert(typeof promiseCallback === 'function');
  this.aborted = false;
  this.finished = false;
  var that = this;
  var realPromise = new Promise(promiseCallback).then(function(result) {
    return new Promise(function(resolve, reject) {
      that._resolve(resolve, result);
    });
  }).catch(function(error) {
    return new Promise(function(resolve, reject) {
      that._reject(reject, error);
    });
  });
  realPromise.abort = function() {
    that.abort();
  };
  return realPromise;
};

AbortablePromise.prototype._resolve = function(resolve, result) {
  if (!this.aborted && !this.finished) {
    this.finished = true;
    resolve(result);
  }
};
AbortablePromise.prototype._reject = function(reject, error) {
  if (!this.aborted && !this.finished) {
      this.finished = true;
      reject(error);
    }
};

AbortablePromise.prototype.abort = function() {
  this.aborted = true;
};

module.exports = AbortablePromise;
