'use strict';

const slice = Array.prototype.slice;

exports.highOrderForId = function(url) {
    return function(id) {
        this.getAsync(url + '/' + id);
    }
}