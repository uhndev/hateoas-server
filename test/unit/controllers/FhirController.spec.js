var Promise = require('bluebird');
var _ = require('lodash');

describe('The Fhir Controller', function () {

  before(function (done) {
    auth.authenticate('admin', function (resp) {
      resp.statusCode.should.be.exactly(200);
      globals.users.adminUserId = JSON.parse(resp.text).user.id;
      done();
    });
  });

  describe('Fhir Patient Resource', function () {
    this.timeout(40000);

    it('Should verify if patient resource have all required properties', function (done) {
      request.get('/api/fhir?type=Patient&query={"name":"smith"}')
        .set('Authorization', 'Bearer ' + globals.token)
        .expect(200)
        .end(function (err, res) {
          var collection = res.body.data;
          if(collection!==undefined){
            _.isArray(collection).should.equal(true);
            //verify if json object have required properties
            collection[0].resource.should.property('gender');
            collection[0].resource.should.property('name');
          }
          done(err);
        });
    });

  });

});
