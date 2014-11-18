WTF.AppRouter = (function() {

  var server = WTF.Server;
  // // fetch datasets and users for our SPA instance
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
      $('body').attr('data-name','login').removeClass();
      console.debug('router login');
      $('#user-label').hide();
      if(server.getUser()) {
        this.navigate("map", true);
        loggedIn = true;
      } else {
        new WTF.LoginView();
      }
    },

    map: function() {
      $('#user-label').show();
      console.debug('router map');
      // set style for wrapper div so that map would show
      $('body').attr('data-name','map');

// <<<<<<< HEAD
//       var self = this;

//       $('#user-label').text(server.getUser().facebook.displayName)
//         .css("cursor","pointer")
//         .hover(function() {
//           $('#user-label').text('Logout');
//         }, function() {
//           $('#user-label').text(server.getUser().facebook.displayName);
//         })
//         .click(function () {
//           // console.log('logout');
//           server.logout();
//           mapView.resetNavMenu();
//           $('#user-label').text('Hello!');
//           self.navigate("login", true);
//         });
        
//       var loggedIn = (server.getUser())? true: false;
//       if(!loggedIn)
//         this.navigate("login", true);
// =======
      var loggedIn = (server.getUser())? true: false;
      if(!loggedIn)
        this.navigate("login", true);
      else {
        var mapView = new WTF.MapView();
      }
// >>>>>>> daniel
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
