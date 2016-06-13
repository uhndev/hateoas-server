var Promise = require('bluebird');
var _ = require('lodash');

describe('The Fhir Controller', function () {

  describe('Fhir Patient Resource', function () {
    this.timeout(40000);
    it('Should verify if patient resource have all required properties', function (done) {
      request.get('/api/fhir?type=Patient&query={"name":"smith"}')
        .expect('Content-Type', /json/)
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
