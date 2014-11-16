WTF.AppRouter = (function() {

  var server = WTF.Server;
  // fetch datasets and users for our SPA instance
  server.fetchDataset();
  server.fetchUser();

  console.debug('start of router');

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
    },

    login: function() {
      $('body').attr('data-name','login');
      console.debug('router login');
      if(server.getUser()) {
        this.navigate("map", true);
        loggedIn = true;
      } else {
        new WTF.LoginView();
      }
    },

    map: function() {
      console.debug('router map');
      // set style for wrapper div so that map would show
      $('body').attr('data-name','map');

      var loggedIn = (server.getUser())? true: false;
      if(!loggedIn)
        this.navigate("login", true);
      else {
        var mapView = new WTF.MapView();
      }
    },

    foodtruckDetails: function(id) {
      $('body').attr('data-name','foodtruck').removeClass();
      console.debug('router foodtruckDetails');
      var foodtruck = WTF.FoodTrucks.get(id) || new WTF.FoodTruck();
      var foodtruckpageView = new WTF.FoodTruckPageView({ model : foodtruck });
    }

  });

  return new self_model();

})();
