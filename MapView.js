// var Server = require('./Server');
var server = new Server();
// var FoodTruckPopUpView = require('./FoodTruckPopUpView');
var foodTruckPopUpView = new FoodTruckPopUpView();
var map;
var MapView = (function() {

  var mapOptions = {
    center: { lat: 49.2, lng: -123.1},
    zoom: 11,
    disableDefaultUI: true
  };
  // display map on the div with id map-canvas
  map = new google.maps.Map($('#map-canvas').get(0),mapOptions);

  var ctaLayer = new google.maps.KmlLayer({
        url: 'http://napontaratan.com/WheresTheFood/street_food_vendors.kml'
  });

  var loadMarkers = function() {
      // parse food truck locations from KML file to a layer and add it to map
      ctaLayer.setMap(map);

      // add custom click handler for marker because we are using google api
      // if it's our own created html element, we will just add it to backbone events
      google.maps.event.addListener(ctaLayer, 'click',  function(kmlEvent) {
        kmlEvent.featureData.infoWindowHtml = foodTruckPopUpView.template;
      });
  };
  
  var userLoginCallback = function(userObject) {
    if(userObject) { // if login is successful (userObject is not null)
      appNav.navigate("map", true);
      //drawMarkers();
      // push user info to server
      server.pushUsername(userObject.facebook.displayName);
    }
  };
  
  return Backbone.View.extend({

    initialize: function() {},

    el: 'body',

    events: {
      'click #login-button': 'login'
    },

    login: function() {
      server.login(userLoginCallback);
    },

    getMap: function() {
      return map;
    },

    drawMarkers: function() {
      loadMarkers();
    },

    clearMarkers: function() {
      ctaLayer.setMap(null);
    },

  });

})();

//module.exports = Backbone.View.extend(mapView);
