describe("Parser", function() {

  var server = WTF.Server;

  describe('Dataset', function() {

    beforeEach(function() {
      server.fetchDataset();
    });

    it('should parsed the correct amount of foodtrucks', function() {
      expect(WTF.FoodTrucks.length).toBe(111);
    });

    it('should parse the first food truck with the correct info', function() {
	  expect(WTF.FoodTrucks.at(0).get('id')).toBe("C1");
      expect(WTF.FoodTrucks.at(0).get('name')).toBe("Via Tevere Pizzeria");
      expect(WTF.FoodTrucks.at(0).get('description')).toBe("Pizza");
      expect(WTF.FoodTrucks.at(0).get('lat')).toBe(49.28690264);
      expect(WTF.FoodTrucks.at(0).get('lon')).toBe(-123.1175335);
    });

  });

});
