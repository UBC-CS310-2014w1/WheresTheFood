WTF.AppRouter = (function() {

  var server = WTF.Server.getInstance();

  WTF.FoodTrucks = new WTF.FoodTruckCollection();


  var fetchFoodTruck = function() {
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
          if(key == 'business_name')
            modelObject['name'] = val;
        });
        modelObject['invalid'] = false;
        var fT = new WTF.FoodTruck(modelObject);
        WTF.FoodTrucks.add(fT);
      });

      sessionStorage.setItem(WTF.Utility.FoodTruckKey, JSON.stringify(WTF.FoodTrucks));
      console.debug('finish parsing');
    };

    if(!WTF.Utility.hasFoodTruckData()) {
      // parse all foodtruck data at start of app
      server.fetchDataset(parseData);
    }

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
        $('#login-button').show();
        $('#overlay').show();
        $('#user-label').text('Hello!')
        .unbind('click')
        .unbind('hover')
        .css("cursor", "auto");
      }
    },

    map: function() {
      console.debug('router map');
      var mapView = new WTF.MapView();
      fetchFoodTruck();
      var loggedIn = (server.getUser())? true: false;
      if(!loggedIn)
        this.navigate("login", true);
      else {
        var self = this;
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


