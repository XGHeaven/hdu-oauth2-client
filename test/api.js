/**
 * Created by rabbitsion on 8/9/15.
 */
require('should');
var Client = require('../lib/api.js');
var restify = require('restify');
var request = require('request');
var config = require('./config.json');

var oauth = new Client({
    id: config.id,
    secret: config.secret
});

var server = restify.createServer({
    name: 'test'
});

['get', 'post'].forEach(function (e) {
    server[e](/^\/asd.+/, oauth.proxy({
        prefix: '/asd'
    }));
});




describe('#Client', function () {
    before(function (done) {
        server.listen(3500, function () {
            console.log('listened 3500 \n');
            done();
        })
    });

    describe('#proxy', function (done) {
        it('404', function (done) {
            request('http://localhost:3500/asd/public/schooltime/1', function (err, res, data) {
                res.statusCode.should.equal(404);

                done();
            })
        })

    })
});