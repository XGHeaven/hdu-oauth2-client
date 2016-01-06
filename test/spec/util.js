'use strict';

const muk = require('muk');
const util = require('../../lib/util');

describe('util', function() {
    it('highOrderForId', function() {
        let temp = {
            get(url) {
                url.should.be.eql('/path/to/exec/id')
            }
        }
        
        temp.func = util.highOrderForId('/path/to/exec');
        temp.func('id');
    })
})