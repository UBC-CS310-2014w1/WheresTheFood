// when page is loaded
var foodtrucks = new FoodTrucks();

var AppRouter = Backbone.Router.extend({
	routes: {
	    "": "login",
	    "login": "login",
	    "map": "map"
	},

	login: function() {
		$('#login-button').show();
		$('#overlay').show();
		$('#user-label').text('Hello!')
		.unbind('click')
		.unbind('hover')
		.css("cursor", "auto");

		new MapView().clearMarkers();

		if(server.getUser() != null)
			appNav.navigate("map", true);
	},

	map: function() {
		if(server.getUser() == null)
			appNav.navigate("login", true);
		else {
			$('#login-button').hide();
			$('#overlay').hide();
			$('#user-label').text(server.getUser().facebook.displayName)
			.css("cursor","pointer")
			.hover(function() {
			  $('#user-label').text('Logout');
			}, function() {
			  $('#user-label').text(server.getUser().facebook.displayName);
			})
			.click(function () {
			  console.log('logout');
			  server.logout();
			  appNav.navigate("login", true);
			});

			new MapView().drawMarkers();
		}
	},
});


var appNav = new AppRouter();

// Start Backbone history a necessary step for bookmarkable URL's
Backbone.history.start();


// Using parseData function - retriving the desired information of each FoodTruck from the json
// All foodtruck specific information is stored into FoodTruck. The key is stored as a id, and business name as just name.
 parseData = function(items){
	var trucks = [];
	$.map(items, function(item){
    var modelObject = {};
		$.map(item, function(val, key){
			if(key == 'description' || key == 'lat' || key == 'lon' || key == 'location')
				modelObject[key] = val;
			if(key == 'key')
				modelObject['id'] = val;
			if(key == 'business_name')
				modelObject['name'] = val;
		});
    var fT = new FoodTruck(modelObject);
		foodtrucks.add(fT);
		
	});
	
};

server.fetchDataset(parseData);
