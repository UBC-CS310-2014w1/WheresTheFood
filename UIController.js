// var MapView  = require('./MapView');
// when page is loaded
var foodtrucks = new FoodTrucks();

$(document).ready( function () {

  new MapView();
  // need a way to trigger other intialization when logged in

// Using parseData function - retriving the desired information of each FoodTruck from the json
// All foodtruck specific information is stored into FoodTruck. The key is stored as a id, and business name as just name.
 parseData = function(items){
	var trucks = [];
	$.map(items, function(item){
		var fT = new FoodTruck();
		$.map(item, function(val, key){
			if(key == 'description' || key == 'lat' || key == 'lon')
				fT[key] = val;
			if(key == 'key')
				fT['id'] = val;
			if(key == 'business_name')
				fT['name'] = val;
			});
		foodtrucks.add(fT);
		console.log('FOODTRUCK INFO', fT);
	});
	console.log('size of list is now ' + foodtrucks.length);
};
	server.fetchDataset(parseData);			// Calling fetchDataset function from server with parseData to get the information about each FoodTruck

});

