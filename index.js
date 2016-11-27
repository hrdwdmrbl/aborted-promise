/**
 * @param {function} promiseCallback
 * @constructor
 */
var AbortablePromise = function(promiseCallback) {
  // console.assert(typeof promiseCallback === 'function');
  this.aborted = false;
  this.finished = false;
  var that = this;
  this.p = new Promise(function(resolve, reject) {
    process.nextTick(function() {
      try {
        promiseCallback(function(result) {
          that._resolve(resolve, result);
        }, function(error) {
          that._reject(reject, error);
        });
      } catch (error) {
        that._reject(reject, error);
      }
    });
  });
};
AbortablePromise.prototype = Object.create(Promise.prototype);

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

AbortablePromise.prototype.then = function() {
  return this.p.then.apply(this.p, arguments);
};

AbortablePromise.prototype.catch = function() {
  return this.p.catch.apply(this.p, arguments);
};

AbortablePromise.prototype.abort = function() {
  this.aborted = true;
};

module.exports = AbortablePromise;
