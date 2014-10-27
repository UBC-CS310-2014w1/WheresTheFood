// var MapView  = require('./MapView');
// when page is loaded
var foodtrucks = new FoodTrucks();

$(document).ready( function () {

  new MapView();
  // need a way to trigger other intialization when logged in
  
	parseData = function(items) {
		var trucks = [];
		$.map(items, function(item) {
			var ft = new FoodTruck();
			$.map(item, function(val,key) {
				if( key == 'description' ||
					key == 'lat' ||
					key == 'lon' ||
					key == 'location')
					ft[key] = val;
				if(key == 'key')
					ft['id'] = val;	
				if(key == 'business_name')
					ft['name'] = val;
			});
			foodtrucks.add(ft);
		});
	};
	
	server.fetchDataset(parseData);
});



