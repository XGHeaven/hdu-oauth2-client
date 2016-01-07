'use strict';

const url = require('url');
const querystring = require('querystring');
const request = require('request');
const Promise = require('bluebird');

class Client {
    constructor(options) {
        this.id = options.id;
        this.secret = options.secret;
        this.apiHost = options.apiHost || 'api.hdu.edu.cn';
        this.protocol = options.protocol || 'https';
        this.token = null;
    }

    _getToken(callback) {
        const tokenGet = url.format({
            protocol: this.protocol,
            host: this.apiHost,
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
                url: url.format({ protocol: this.protocol, host: this.apiHost, pathname: resourcePath }),
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
    
    getAsync(resourcePath) {
        return new Promise((resolve, reject) => {
            this.get(resourcePath, (err, data) => {
                if (err) return reject(err);
                return resolve(data);
            })
        })
    }

    proxy(config) {
        const mid = (req, res, next) => {
            if (!this.token) {
                this._getToken(function () {
                    mid(req, res, next);
                });
            } else {
                const path = url.parse(req.url);
                const options = {
                    method: req.method,
                    url: url.format({
                        protocol: this.protocol,
                        host: this.apiHost,
                        pathname: path.pathname.slice(config.prefix.length),
                        query: querystring.parse(path.query)
                    }),
                    headers: { 'X-Access-Token': this.token, 'Accept-Version': req.headers['accept-version'] },
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
    
    static mixed(obj) {
        Object.assign(Client.prototype, obj);
        return this;
    }
}

module.exports = Client;
