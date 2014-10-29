// var Server = require('./Server');
// var server = new Server();
// var FoodTruckPopUpView = require('./FoodTruckPopUpView');
// var foodTruckPopUpView = new FoodTruckPopUpView();

var mapView = (function() {

  var mapOptions = {
    center: { lat: 49.2, lng: -123.1},
    zoom: 11,
    disableDefaultUI: true
  };
  // display map on the div with id map-canvas
  var map = new google.maps.Map($('#map-canvas').get(0),mapOptions);

  var drawMarker = function() {
    // parse food truck locations from KML file to a layer and add it to map
    var ctaLayer = new google.maps.KmlLayer({
      url: 'http://napontaratan.com/WheresTheFood/street_food_vendors.kml'
    });

    ctaLayer.setMap(map);

    // add custom click handler for marker because we are using google api
    // if it's our own created html element, we will just add it to backbone events
    google.maps.event.addListener(ctaLayer, 'click',  function(kmlEvent) {
      // kmlEvent.featureData.infoWindowHtml = foodTruckPopUpView.template();
      kmlEvent.featureData.infoWindowHtml = new FoodTruckPopUpView().template();
    });
  };

  var userLoginCallback = function(userObject) {
    if(userObject) { // if login is successful (userObject is not null)
      $('#login-button').hide();
      $('#overlay').hide();
      $('#user-label').text(userObject.facebook.displayName)
        .css("cursor","pointer")
        .hover(function() {
          $('#user-label').text('Logout');
        }, function() {
          $('#user-label').text(userObject.facebook.displayName);
        })
        .click(function () {
          server.logout();
          location.reload();
        });

      drawMarker();

      // push user info to server
      server.pushUserData(userObject.uid, userObject.facebook.displayName);
    }
  };

  return {
    initialize: function() {
      console.debug('MapView is initalized');
    },

    el: 'body',

    events: {
      'click #login-button': 'login'
    },

    login: function() {
      server.login(userLoginCallback);
    }
  };

})();

//module.exports = Backbone.View.extend(mapView);
var MapView = Backbone.View.extend(mapView);
