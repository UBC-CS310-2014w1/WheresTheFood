describe("Parser", function() {

  var server = WTF.Server;

  describe('Dataset', function() {

    beforeEach(function() {
      // setTimeout(function(done) {
      //   server.fetchDataset();
      //   done();
      // }, 10000);
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

	it('should parse the last food truck with the correct info', function() {
	  expect(WTF.FoodTrucks.at(110).get('id')).toBe("DT78");
      expect(WTF.FoodTrucks.at(110).get('name')).toBe("Chou Chou Crepes");
      expect(WTF.FoodTrucks.at(110).get('description')).toBe("French Crepes");
      expect(WTF.FoodTrucks.at(110).get('lat')).toBe(49.28006682);
      expect(WTF.FoodTrucks.at(110).get('lon')).toBe(-123.1139136);
    });

    it('should parse the 60th food truck with the correct info', function(){
      expect(WTF.FoodTrucks.at(60).get('id')).toBe("DT59");
      expect(WTF.FoodTrucks.at(60).get('name')).toBe("Re-Up BBQ");
      expect(WTF.FoodTrucks.at(60).get('description')).toBe("Pulled Pork");
      expect(WTF.FoodTrucks.at(60).get('lat')).toBe(49.28350877);
      expect(WTF.FoodTrucks.at(60).get('lon')).toBe(-123.1203097);
    });

  });

});
