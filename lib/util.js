'use strict';

const slice = Array.prototype.slice;

exports.highOrderForId = function(url) {
    return function(id, callback) {
        this.get(url + '/' + id, callback);
    }
}