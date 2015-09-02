# hdu-oauth2-client
client for api.hdu.edu.cn 
##Installation
`npm insatll hdu-oauth2-client`

##Usage
```
var Client = require('hdu-oauth2-client');

var hduClient = new Client({
  id: 1202122,
  secret: secret,
});

hduClient.get(urlApi, function (err, response){
  //.......
});
```
