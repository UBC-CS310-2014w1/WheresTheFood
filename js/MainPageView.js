var WTF = WTF || {};

WTF.MapView = (function() {

  var server = WTF.Server;

  var mapOptions = {
    center: { lat: 49.256, lng: -123.1},
    zoom: 13,
    disableDefaultUI: true
  };

  var map;
  var loadMarkers = function() {
    var marker;
    for(var i = 0; i < WTF.FoodTrucks.length; i++) {
      var current = WTF.FoodTrucks.at(i);
      checkMarkerOnGG(current);
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(current.get('lat'), current.get('lon')),
        title: current.get('name'),
        id: current.get('id'),
        index: i,
        map: map,
      });

      // closure
      (function(marker){
        google.maps.event.addListener(marker, 'click',  function() {
          console.debug('looping');
          var foodtruck = WTF.FoodTrucks.get(marker.id) || new WTF.FoodTruck();
          var foodTruckPopUpView = new WTF.FoodTruckPopUpView({ model: foodtruck });
          var infoWindow = new google.maps.InfoWindow({
            content: foodTruckPopUpView.template
          });
          infoWindow.open(map,marker);
        });
      })(marker);
    }
  };

  var checkMarkerOnGG = function(foodtruck_i) {
    var vancouver = new google.maps.LatLng(49.261226, -123.113927);

    // Using nearby search to search for specific foodtruck
    var request = {
    location: vancouver,
    radius: 500,
    query: foodtruck_i.get('name')
  };

    var service = new google.maps.places.PlacesService(map);
    // service.textSearch(request,callback(foodtruck_i));

    // method 1
    service.textSearch(request, function(results, status) {
      callback(results, status, foodtruck_i);
    });
};

    /*
    * check the status of each foodtruck's response if it's valid
    */
    function callback(results, status, foodtruck_i) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    // don't loop over every result
    // pick the best (just one) result
    // and get opening hour for this best result
    for (var i = 0; i < results.length; i++) {

      if ((results[i].name.toLowerCase() == foodtruck_i.get('name').toLowerCase()) ||
        (checkSubString(results[i].name.toLowerCase(), foodtruck_i.get('name').toLowerCase()))) {
        console.log('getting openhour for foodtruck which is ' + JSON.stringify(foodtruck_i));
        var ft = results[i];

        // set the request to ft's id
        var request = {
          placeId: ft.place_id
        };

        var service = new google.maps.places.PlacesService(map);
        service.getDetails(request, function(place, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
          // We now have the operation hours in one week of the foodtruck

              // in case, the placeresult doesn't have opening_hour attribute.
              var OpenHourEachDay = "Not Available";
              if (place.hasOwnProperty("opening_hours")) {
               OpenHourEachDay = place.opening_hours.weekday_text[checkDay()];
              }
                console.log(OpenHourEachDay);
                foodtruck_i.set('openHours', OpenHourEachDay);
                // debugger;
                console.debug('SUCCESS ' + OpenHourEachDay + JSON.stringify(foodtruck_i));
              } else {
                console.debug('status ', status);
              }
        }, foodtruck_i);
      }

      break;
    }

  } else {foodtruck_i.set('openHours', "Not Available");}
}

  // check substring now
  function checkSubString(mainOne, needCheck) {
  return mainOne.indexOf(needCheck) >= 0;
}



  // Get The current weekday
  function checkDay() {
    var day = new Date();
    return day.getDay();
  }

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
      // if(ctaLayer) {
      //   ctaLayer.setMap(null);
      // }
    },

    resetNavMenu: function() {
      $('body').removeClass('wtf-left');
      $('.wtf-side-panel-left').removeClass('wtf-side-panel-open');
    },

  });

})();

WTF.LoginView = (function() {

  var server = WTF.Server;

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
