'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

global.should = chai.should();
global.Client = require('../');

require('./spec/api');
require('./spec/util');
require('./spec/exam');