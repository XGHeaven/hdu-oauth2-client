'use strict';

const url = require("url");
const request = require('request');

class Client {
    constructor(options) {
        this.id = options.id;
        this.secret = options.secret;
        this.host = options.host || 'api.hdu.edu.cn';
        this.protocol = options.protocol || 'https';
        this.token = null;
    }

    _getToken(callback) {
        const tokenGet = url.format({
            protocol: this.protocol,
            host: this.host,
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
                callback(error);
            }
            this.token = JSON.parse(body)['access_token'];

            callback(null, this.token);
        });
    }

    get(resourcePath, callback) {
        if (!this.token) {
            this._getToken(() => {
                this.get(resourcePath, callback);
            });
        } else {
            const options = {
                method: 'GET',
                url: url.format({ protocol: this.protocol, host: this.host, pathname: resourcePath }),
                headers: { 'X-Access-Token': this.token }
            };
            request(options, (error, response) => {
                if (error) {
                    callback(error);
                }
                if (response.statusCode == 403) {
                    this.token = null;
                    return this.get(resourcePath, callback);
                }
                callback(null, response);
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

                const options = {
                    method: req.method,
                    url: url.format({
                        protocol: this.protocol,
                        host: this.host,
                        pathname: req.url.slice(config.prefix.length)
                    }),
                    headers: req.headers,
                    json: req.params
                };

                request(options, (err, response, data) => {
                    if (err) {
                        throw err;
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
