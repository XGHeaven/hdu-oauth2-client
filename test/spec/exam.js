'use strict';

var muk = require('muk');

describe('exam method', function() {
    it('should extend', function() {
        Client.prototype.should.be.have.keys(['getExamSchedule', 'getExamGrade', 'getExamGradeCurrent'])
    })
})