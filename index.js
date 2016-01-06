/**
 * Created by rabbitsion on 7/21/15.
 */
var Client = require('./lib/api');

Client.mixed(require('./lib/exam'));

module.exports = Client;