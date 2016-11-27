/**
 * @param {function} promiseCallback
 * @constructor
 */
var AbortablePromise = function(promiseCallback) {
    // console.assert(typeof promiseCallback === 'function');
    this.aborted = false;
    this.finished = false;
    this._catchCallbacks = [];
    this._thenCallbacks = [];
    var that = this;
    process.nextTick(function() {
        try {
            promiseCallback(function(result) {
                process.nextTick(function() {
                    that._callThen(result);
                });
            }, function(error) {
                process.nextTick(function() {
                    that._callCatch(error);
                });
            });
        } catch (error) {
            process.nextTick(function() {
                that._callCatch(error);
            });
        }
    });
};

AbortablePromise.prototype.abort = function() {
    this.aborted = true;
};

/**
 * @param {function} callback
 */
AbortablePromise.prototype.then = function(callback) {
    this._thenCallbacks.push(callback);
};

/**
 * @param {function} callback
 */
AbortablePromise.prototype.catch = function(callback) {
    this._catchCallbacks.push(callback);
};

/**
 * @param {function} callback
 */
AbortablePromise.prototype._callCatch = function(error) {
    if (!this.aborted && !this.finished) {
        this.finished = true;
        this._catchCallbacks.forEach(function(abortCallback) {
            process.nextTick(function() {
                abortCallback(error);
            });
        });
    }
};

AbortablePromise.prototype._callThen = function(response) {
    if (!this.aborted && !this.finished) {
        this.finished = true;
        this._thenCallbacks.forEach(function(thenCabllack) {
            process.nextTick(function() {
                thenCabllack(response);
            });
        });
    }
};

module.exports = AbortablePromise;
