(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = Backbone.View.extend({
  initialize: function() {

  },

  template: _.template($('#foodtruckpopup_template').html())

});

},{}],2:[function(require,module,exports){
var Server = require('./Server');
var server = new Server();
var FoodTruckPopUpView = require('./FoodTruckPopUpView');
var foodTruckPopUpView = new FoodTruckPopUpView();

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
      kmlEvent.featureData.infoWindowHtml = foodTruckPopUpView.template();
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

module.exports = Backbone.View.extend(mapView);

},{"./FoodTruckPopUpView":1,"./Server":3}],3:[function(require,module,exports){
var server = (function() {
  // Server
  var databaseRef = new Firebase("https://vivid-torch-5902.firebaseio.com/");
  var currentUser = {};

  return {
    login: function(callback) {
        databaseRef.authWithOAuthPopup("facebook", function(error, authData) {
            if(error) console.log('error');
            if(authData) {
              if(typeof callback === 'function') {
                currentUser = authData;
                callback(authData);
              }
            }
          }, {
            remember: "sessionOnly",
            scope: "email"
        });

      },

    pushUserData: function(key, val) {
        databaseRef.child('users').child(key).set(val);
      },

    getCurrentUser: function() {
        return currentUser;
    },

    logout: function() {
        databaseRef.unauth();
    },
  };

})();

module.exports = Backbone.Model.extend(server);

},{}],4:[function(require,module,exports){
var MapView  = require('./MapView');
// when page is loaded
$(document).ready( function () {

  new MapView();
  // need a way to trigger other intialization when logged in

});


},{"./MapView":2}]},{},[4]);
