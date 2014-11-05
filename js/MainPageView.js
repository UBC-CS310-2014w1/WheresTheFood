var WTF = WTF || {};

WTF.MapView = (function() {

  var server = WTF.Server.getInstance();

  var mapOptions = {
    center: { lat: 49.2, lng: -123.1},
    zoom: 11,
    disableDefaultUI: true
  };

  // display map on the div with id map-canvas
  var map;
  var ctaLayer;

  var loadMarkers = function() {
    ctaLayer = new google.maps.KmlLayer({
      url: 'http://napontaratan.com/WheresTheFood/street_food_vendors.kml'
    });
      // parse food truck locations from KML file to a layer and add it to map
    ctaLayer.setMap(map);

    // add custom click handler for marker because we are using google api
    // if it's our own created html element, we will just add it to backbone events
    google.maps.event.addListener(ctaLayer, 'click',  function(kmlEvent) {
      var data = kmlEvent.featureData;
      var foodtruck = WTF.Utility.getFoodTruck(data.id) || new WTF.FoodTruck();
      var foodTruckPopUpView = new WTF.FoodTruckPopUpView({ model: foodtruck });
      data.infoWindowHtml = foodTruckPopUpView.template;
    });
  };

  return Backbone.View.extend({

    initialize: function() {
      console.debug('map view init');
      this.render();

      // event handler for toggling side bar
      $('#hamburger').on('click', function() {
        $('.wtf-side-panel-left').toggleClass('wtf-side-panel-open');
        $('body').toggleClass('wtf-left');
      });
    },

    template: _.template($('#map-template').html()),

    render:function() {
      this.setElement(this.template()); // to avoid a wrapper parent
      $('.app-container').html(this.$el);
      map = new google.maps.Map($('#map-canvas').get(0),mapOptions);
      this.drawMarkers();
      return this;
    },

    getMap: function() {
      return map;
    },

    drawMarkers: function() {
      loadMarkers();
    },

    clearMarkers: function() {
      if(ctaLayer) {
        ctaLayer.setMap(null);
      }
    },

    resetNavMenu: function() {
      $('body').removeClass('wtf-left');
      $('.wtf-side-panel-left').removeClass('wtf-side-panel-open');
    },

  });

})();

WTF.LoginView = (function() {

  var server = WTF.Server.getInstance();

  var userLoginCallback = function(userObject) {
    if(userObject) { // if login is successful (userObject is not null)
      WTF.AppRouter.navigate("map", true);
      //drawMarkers();
      // push user info to server
      server.pushUsername(userObject.facebook.displayName);
    }
  };

  return Backbone.View.extend({

    initialize: function() {
      this.render();
    },

    events: {
      'click #login-button': 'login'
    },

    template: _.template($('#login-template').html()),

    render: function() {
      this.$el.html(this.template());
      $('.app-container').html(this.$el);
      return this;
    },

    login: function() {
      server.login(userLoginCallback);
    }

  });

})();

WTF.FoodTruckPopUpView = (function() {

  return Backbone.View.extend({

    initialize: function() {
      console.debug("FoodTruckPopUpView initialize");
      this.render();
    },

    baseTemplate: _.template($('#foodtruck-popup-template').html()),

    render: function(foodtruckId) {
      this.template = this.baseTemplate(this.model.toJSON());
      this.$el.html(this.template);
      return this;
    }

  });
})();

