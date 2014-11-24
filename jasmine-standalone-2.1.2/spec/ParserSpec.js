describe("Parser", function() {

  var server = WTF.Server;

  describe('Dataset', function() {

    beforeEach(function() {
      server.fetchDataset();
    });

    it('should parsed the correct amount of foodtrucks', function() {
      expect(WTF.FoodTrucks.length).toBe(111);
    });


  });

});
