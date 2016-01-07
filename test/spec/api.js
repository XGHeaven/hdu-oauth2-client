const muk = require('muk');

describe('Client Class', function() {
    beforeEach(function() {
        this.client = new Client({});
    })
    
    it('getAsync', function(done) {
        muk(this.client, 'get', function(resource, callback) {
            if (resource instanceof Error) return callback(resource);
            callback(null, resource);
        })
        
        this.client.getAsync('url').should.become('url');
        this.client.getAsync(new Error).should.be.rejected.notify(done);
        
        muk.restore();
    })
})