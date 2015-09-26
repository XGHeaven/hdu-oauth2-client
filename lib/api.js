var url = require("url");
var request = require('request');

function Client(pack){
	this.id = pack.id;
	this.secret = pack.secret;
	this.url = pack.url || 'api.hdu.edu.cn';
	this.token  = null;
}

Client.prototype = {
	/**
	 * get()
	 * @param urlApi
	 * @param callback
	 */
    _get_token: function (callback) {
        var _this = this;

        var tokenGet = url.format({
				protocol: 'https',
				host: 'api.hdu.edu.cn',
				pathname: '/authorize/token',
				query: {
					'grant_type': 'client_credentials',
					'client_id': _this.id,
					'client_secret': _this.secret,
					'scope': _this.scope
				}
			});
			request.get(tokenGet, function (error, response, body) {
				if (error) {
					throw  error;
				}
				_this.token = JSON.parse(body);

                callback();

			});
    },

	get: function (urlApi, callback) {
		var _this = this;

		if (!_this.token) {
		    _this._get_token(function () {
                _this.get(urlApi, callback);
            });
		}else{
			var options = {
				method: 'GET',
				url: urlApi,
				headers: {"X-Access-Token": _this.token.access_token}
			};
			request(options, function (error, response, body) {
				if (error) {
					callback(error);
				}
				if (response.statusCode == 403) {
					_this.token = null;
					return _this.get(urlApi, callback);
				}
				callback(response);
			});
		}
	},

	proxy: function (config) {
		var _this = this;

        var mid = function (req, res ,next) {
            if (!_this.token) {
                _this._get_token(function () {
                    mid(req, res, next);
                });
            } else {
                req.headers['X-Access-Token'] = _this.token.access_token;

                var options = {
                    method: req.method,
                    url: 'http://' + _this.url + req.url.replace(new RegExp('^' + config.prefix), ''),
                    headers: req.headers,
                    json: req.params
                };

                request(options, function (err, response, data) {
                    if (err) {
                        res.statusCode = 500;
                        return res.end();
                    }
					
					if (res.statusCode == 403 && data.code == 40305) {
						_this._get_token(function () {
							mid(req, res, next);
						});
					}

                    res.statusCode = response.statusCode;
                    res.send(data);
                });
            }
        };

        return mid;

	}
};

module.exports = Client;

