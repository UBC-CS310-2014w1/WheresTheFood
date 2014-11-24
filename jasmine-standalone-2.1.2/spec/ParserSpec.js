describe("Parser", function() {

  var server = WTF.Server;

  describe('Dataset', function() {

    beforeEach(function() {
      setTimeout(function(done) {
        server.fetchDataset();
        done();
      }, 10000);
    });

    it('should parsed the correct amount of foodtrucks', function() {
      expect(WTF.FoodTrucks.length).toBe(111);
    });

  });

});
