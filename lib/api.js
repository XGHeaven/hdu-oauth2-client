'use strict';

var url = require("url");
var request = require('request');

class Client {
    constructor(options) {
        this.id = options.id;
        this.secret = options.secret;
        this.url = options.url || 'api.hdu.edu.cn';
        this.token = null;
    }

    _getToken(callback) {
        var tokenGet = url.format({
            protocol: 'https',
            host: 'api.hdu.edu.cn',
            pathname: '/authorize/token',
            query: {
                'grant_type': 'client_credentials',
                'client_id': this.id,
                'client_secret': this.secret,
                'scope': this.scope
            }
        });
        request.get(tokenGet, (error, response, body) => {
            if (error) {
                throw  error;
            }
            this.token = JSON.parse(body)['access_token'];

            callback();
        });
    }

    get(urlApi, callback) {
        if (!this.token) {
            this._getToken(() => {
                this.get(urlApi, callback);
            });
        } else {
            var options = {
                method: 'GET',
                url: urlApi,
                headers: { 'X-Access-Token': this.token }
            };
            request(options, (error, response, body) => {
                if (error) {
                    callback(error);
                }
                if (response.statusCode == 403) {
                    this.token = null;
                    return this.get(urlApi, callback);
                }
                callback(response);
            });
        }
    }

    proxy(config) {
        const mid = (req, res, next) => {
            if (!this.token) {
                this._getToken(function () {
                    mid(req, res, next);
                });
            } else {
                req.headers['X-Access-Token'] = this.token;

                var options = {
                    method: req.method,
                    url: 'https://' + this.url + req.url.replace(new RegExp('^' + config.prefix), ''),
                    headers: req.headers,
                    json: req.params
                };

                request(options, (err, response, data) => {
                    if (err) {
                        res.statusCode = 500;
                        return res.end();
                    }

                    if (response.statusCode == 403 && data.code == 40305) {
                        return this._getToken(() => {
                            mid(req, res, next);
                        });
                    }

                    res.statusCode = response.statusCode;
                    return res.send(data);
                });
            }
        };
        return mid;
    }
}

module.exports = Client;
