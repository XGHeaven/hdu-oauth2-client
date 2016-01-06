'use strict';

const util = require('./util');

module.exports = {
    getExamSchedule: util.highOrderForId('exam/schedule'),
    
    getExamGrade: util.highOrderForId('exam/grade'),
    
    getExamGradeCurrent: util.highOrderForId('exam/grade_current')
}