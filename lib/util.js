'use strict';

const slice = Array.prototype.slice;

exports.highOrderForId = function(url) {
    return function(id) {
        return this.getAsync(url + '/' + id);
    }
}