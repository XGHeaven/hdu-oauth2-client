'use strict';

const muk = require('muk');
const util = require('../../lib/util');
const Promise = require('bluebird');

describe('util', function() {
    it('highOrderForId', function(done) {
        let temp = {
            getAsync(url) {
                return new Promise((resolve, reject) => {
                    if (url instanceof Error) return reject(url);
                    resolve(url);
                })
            }
        }
        
        temp.func = util.highOrderForId('/path/to/exec');
        temp.func('id').should.be.become('/path/to/exec/id').notify(done);
    })
})