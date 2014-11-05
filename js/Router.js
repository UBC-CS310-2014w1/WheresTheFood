WTF.AppRouter = (function() {

  var server = WTF.Server.getInstance();

  WTF.FoodTrucks = new WTF.FoodTruckCollection();

  var populateListView = function(callback) {
    
    $('#data-table').append('<thead><tr><th></th></tr></thead>');
    
    for(var i = 0; i < WTF.FoodTrucks.length ; i++) {
      $('#data-table').append(function() {
        if(WTF.FoodTrucks[i].name != 'N/A')
          return '<tr><td>' + WTF.FoodTrucks[i].name + '</td></tr>'; 
      });
    }

    // window.setTimeout(function() {
      $('#data-table').DataTable({
          "paging"  : false,
          "columnDefs": [{ "orderable": false, "targets": 0 }],
          "order"   : [[0, "asc"]],
          "info"    : false,
      });
    // }, 100);
  };

  var fetchFoodTruck = function(callback) {
    // Using parseData function - retriving the desired information of each FoodTruck from the json
    // All foodtruck specific information is stored into FoodTruck. The key is stored as a id, and business name as just name.
     parseData = function(items){
      var trucks = [];
      $.map(items, function(item){
        var modelObject = {};
        $.map(item, function(val, key){
          if(!val)
            return;
          if(key == 'description' || key == 'lat' || key == 'lon' || key == 'location')
            modelObject[key] = val;
          if(key == 'key')
            modelObject['id'] = val;
          if(key == 'business_name') {
            modelObject['name'] = val;
          }
        });
        modelObject['invalid'] = false;
        var fT = new WTF.FoodTruck(modelObject);
        WTF.FoodTrucks.add(fT);
      });

      sessionStorage.setItem(WTF.Utility.FoodTruckKey, JSON.stringify(WTF.FoodTrucks));
      WTF.Utility.fetchFoodtruckFromStorage();
      console.debug('finish parsing');
    };

    if(!WTF.Utility.hasFoodTruckData()) 
      server.fetchDataset(parseData);
    else WTF.Utility.fetchFoodtruckFromStorage();
  };

  var self_model = Backbone.Router.extend({
    routes: {
        "": "login",
        "login": "login",
        "map": "map",
        "foodtruck/:id": "foodtruckDetails"
    },

    initialize: function(){
      // Start Backbone history a necessary step for bookmarkable URL's
      Backbone.history.start();
      console.debug('router init');
    },

    login: function() {
      console.debug('router login');
      if(server.getUser() != null) {
        this.navigate("map", true);
        loggedIn = true;
      } else {
        new WTF.LoginView();
        $('#user-label').text('Hello!');
      }
    },

    map: function() {
      console.debug('router map');
      var mapView = new WTF.MapView();
      
      fetchFoodTruck();
      window.setTimeout(populateListView, 300);

      var loggedIn = (server.getUser())? true: false;
      if(!loggedIn)
        this.navigate("login", true);
      else {
        var self = this;
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
          mapView.clearMarkers();
          self.navigate("login", true);
        });
      }
    },

    foodtruckDetails: function(id) {
      console.debug('router foodtruckDetails');
      var foodtruck = WTF.Utility.getFoodTruck(id);
      var foodtruckpageView = new WTF.FoodTruckPageView({ model : foodtruck });
    }

  });

  return new self_model();

})();


