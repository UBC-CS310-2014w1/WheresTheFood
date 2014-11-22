var WTF = WTF || {};

WTF.MapView = (function() {

  var server = WTF.Server;
  var dataTable;
  var map;
  var setupUserLabel = function() {
    $('#user-label').text(server.getUser().facebook.displayName)
    .css("cursor","pointer")
    .hover(function() {
      $('#user-label').text('Logout');
    }, function() {
      if(server.getUser())
        $('#user-label').text(server.getUser().facebook.displayName);
    })
    .click($.proxy(function () { // proxy allows 'this' context change
      server.logout();
      WTF.AppRouter.navigate("login", true);
    }, this));
  };

  var mapOptions = {
    center: { lat: 49.265, lng: -123.105},
    zoom: 13,
    disableDefaultUI: true
  };

  // sideBar
  var option_selected;

  var populateListView = function() {
    console.debug('populateListView');
    $('#data-table').empty();
    for(var i = 0, len = WTF.FoodTrucks.length; i < len ; i++) {
      appendFoodTruck(i);
    }
      initDataTable();
  };

  var appendFoodTruck = function(i) {
    $('#data-table').append(function() {
      var foodtruck = WTF.FoodTrucks.at(i);
      var name = foodtruck.get('name');

      if(foodtruck.get('name') == 'N/A')
        name = foodtruck.get('description') + ' ' + foodtruck.get('id');
        return '<tr><td>'+ generateIcon() +'<a href="#foodtruck/' +

                        foodtruck.get('id') + '">' +
                        name + '</a></td>'+
               '<td>' + foodtruck.get('rating') + '</td>' +
               '<td>' + foodtruck.get('distance') + '</td>' +
               '<td>' + foodtruck.get('description') + '</td>' +
               '</tr>';
    });
  };

  var generateIcon = function() {
    var random = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
    return '<img src="images/foodtruck_icon'+random+'.png" style="margin-right:15px;"/>';
  };

  var initDataTable = function() {

    var settings = {
        "paging"    : false,
        "columnDefs": [{ "orderable": false, "targets": 0 },
                       { "width": "90%", "targets": 0}],
        "columns"   : [{'visible' : true},
                       {'visible' : false},
                       {'visible' : false},
                       {'visible' : false}],
        //"order"     : [[0, "asc"]],
        "scrollY"   : 500,
        "scrollCollapse": true,
        "info"      : false,
        "destroy"   : true
    };


    dataTable = $('#data-table').DataTable(settings);

    // reset radio button to be A - Z ordering
    $('#orderAlphabet').prop('checked',true);
    option_selected = $('input[name=ordering]:checked', '#order-options').val();

  };

  var initRadioButtonEvents = function() {
      $('#orderRating').click(function() {
        if(option_selected == 'Rating') return;
        option_selected = $('input[name=ordering]:checked', '#order-options').val();
        dataTable.order([1,'desc']);
        dataTable.column(1).visible(true);
        dataTable.draw();
      });

      $('#orderAlphabet').click(function() {
        if(option_selected == 'A - Z') return;
        option_selected = $('input[name=ordering]:checked', '#order-options').val();
        dataTable.order([0,'asc']);
        dataTable.column(1).visible(false);
        dataTable.draw();
      });

      $('#orderDistance').click(function() {
        option_selected = $('input[name=ordering]:checked', '#order-options').val();
        dataTable.order([2,'asc']);
        dataTable.column(1).visible(false);
        dataTable.draw();
      });
  };

  var drawMarkers = function() {
  var marker;
    for(var i = 0, len = WTF.FoodTrucks.length; i < len ; i++) {
      var current = WTF.FoodTrucks.at(i);

      new WTF.FoodTruckPopUpView({model: current, indexx: i, map: map});

    }
  };

  var usersearchLocation = function(){
    
    var userInput = $('#user-input').get(0);
    var markers = [];
    var bounds = map.getBounds() || new google.maps.LatLngBounds();
    var options = {
      bounds: bounds
    };

    var searchBox = new google.maps.places.SearchBox(userInput, options);

    google.maps.event.addListener(searchBox, 'places_changed', function() {
      var places = searchBox.getPlaces();

      if(places.length === 0)return;
      for(var t = 0, place; t < places.length; t++){
        place = places[t];

        var image = {
          url: place.icon,
          scaledSize: new google.maps.Size(24,24)
        };

        var lat = place.geometry.location.lat();
        var lon = place.geometry.location.lng();

        console.debug("user: LAT", lat, "LON", lon);
        updateListwithDistances(lat,lon);

        WTF.User.set('lat', lat);
        WTF.User.set('lon', lon);
        console.log(WTF.User.get('lon'), WTF.User.get('lat'));

         // Create a marker for each place.
        var marker = new google.maps.Marker({
          map: map,
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          title: place.name,
          position: place.geometry.location
        });

        clearMarkers();
        markers.push(marker);
      }
    });

    google.maps.event.addListener(map, 'bounds_changed', function() {});

    // clear markers from the map
    function clearMarkers(){
      for (var s = 0; s < markers.length; s++){
        markers[s].setMap(null);
      }
      markers = [];
    }

<<<<<<< HEAD

  var delay = 0;
  var fetchHours = function(foodtruck_i) {
    // console.log('hello there');
    if(foodtruck_i.get('name')=='N/A') {
      foodtruck_i.set('openHours', "Not Available");
      return;
    }

    var vancouver = new google.maps.LatLng(49.261226, -123.113927);

    var request = {
      location: vancouver,
      radius: 500,
      query: foodtruck_i.get('name')
    };
    var service = new google.maps.places.PlacesService(map);

    service.textSearch(request, function(results, status) {

      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {

          if ((results[i].name.toLowerCase() == foodtruck_i.get('name').toLowerCase()) ||
          (checkSubString(results[i].name.toLowerCase(), foodtruck_i.get('name').toLowerCase()))) {

              console.log('getting openhour for foodtruck which is ' + JSON.stringify(foodtruck_i));
              var ft = results[i];

              var request = {
                placeId: ft.place_id
              };

              var service = new google.maps.places.PlacesService(map);

              service.getDetails(request, function(place, status) {

                if (status == google.maps.places.PlacesServiceStatus.OK) {
=======
    function updateListwithDistances(user_lat, user_lon) {
      for(var i = 0; i < WTF.FoodTrucks.length; i++) {
        var currentFT = WTF.FoodTrucks.at(i);
        var distanceToUser = getDistanceFromLatLonInKm(currentFT.get('lat'), currentFT.get('lon'), user_lat, user_lon);
        currentFT.set('distance', distanceToUser);
      }
      populateListView();
    }

    function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2-lat1);  // deg2rad below
      var dLon = deg2rad(lon2-lon1); 
>>>>>>> master

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);

      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; // Distance in km
      return d;
    }

    function deg2rad(deg) {
      return deg * (Math.PI/180);
    }
  };

  var mapView =  Backbone.View.extend({

    initialize: function() {
      console.debug('map view init');
      this.render();
      this.listenTo(WTF.FoodTrucks, 'reset', drawMarkers);
      initRadioButtonEvents();
      usersearchLocation();
      this.listenTo(WTF.FoodTrucks, "reDrawListView", populateListView);
    },

    template: _.template($('#map-template').html()),

    events: {
      'click #hamburger': 'toggleSideBar',
      'click input[name="filters"]': 'filterMarkers',
    },

    render:function() {
      this.$el.html(this.template());
      $('.app-container').html(this.$el);
      setupUserLabel.call(this);
      map = new google.maps.Map($('#map-canvas').get(0),mapOptions);
      console.debug('foodtruck length', WTF.FoodTrucks.length);
      populateListView();
      drawMarkers();
      return this;
    },

    refreshTable: function() {
      populateListView();
    },

    getMap: function() {
      return map;
    },

    toggleSideBar: function() {
      $('.wtf-side-panel-left').toggleClass('wtf-side-panel-open');
      $('body').toggleClass('wtf-left');
    },

    filterMarkers: function(e) {
      var filterType = $(e.target).data('filter');
      map = new google.maps.Map($('#map-canvas').get(0),mapOptions); // to clear the map
      WTF.FoodTrucks.filterFoodTrucks(filterType);
      populateListView();
    }

  });
  
  _.extend(mapView, Backbone.event);

  return mapView;

})();

//////////////////////////////////////////////////////////////////////
WTF.LoginView = (function() {

  var server = WTF.Server;

  var userLoginCallback = function(userObject) {
    if(userObject) {
      server.fetchUser();
      WTF.AppRouter.navigate("map", true);
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
      $('#user-label').text('Hello!');
      return this;
    },

    login: function() {
      server.login(userLoginCallback);
    }

  });

})();

///////////////////////////////////////////////////
WTF.FoodTruckPopUpView = (function() {

  var POPUP;
  var delay = 100;
  var VANCOUVER = new google.maps.LatLng(49.261226, -123.113927);

  var fetchHours = function(foodtruck_i, map) {

    if(foodtruck_i.get('name')=='N/A') return;

    var request = {
      location: VANCOUVER,
      radius: 500,
      query: foodtruck_i.get('name')
    };

    var service = new google.maps.places.PlacesService(map);

    service.textSearch(request, function(results, status) {

      if (status == google.maps.places.PlacesServiceStatus.OK) {

        for (var i = 0; i < results.length; i++) {

          if ((results[i].name.toLowerCase() == foodtruck_i.get('name').toLowerCase()) ||
          (checkSubString(results[i].name.toLowerCase(), foodtruck_i.get('name').toLowerCase()))) {

              var ft = results[i];

              var request = { placeId: ft.place_id };

              var service = new google.maps.places.PlacesService(map);

              service.getDetails(request, function(place, status) {

                if (status == google.maps.places.PlacesServiceStatus.OK) {

                    if (place.hasOwnProperty("opening_hours")) {
                      var OpenHourEachDay = place.opening_hours.weekday_text[checkDay()];
                      console.debug('SUCCESS ' + OpenHourEachDay);
                      foodtruck_i.set('openHours', OpenHourEachDay);
                    }

                } else { // try again after a set delay
                    delay += 1000;
                    console.debug('status ' + status + ' trying truck ' + foodtruck_i.get('name') + ' again in ' + delay + ' ms');
                    setTimeout(function() {
                      console.log(foodtruck_i.get('name'));
                      fetchHours(foodtruck_i);
                    }, delay);
                }
              }, foodtruck_i);
          break;
          }
        }
      }
  });
};

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

    // options has three fields
    // options = {model: a foodtruck item in the collection, indexx: markerIndex, map: map}
    initialize: function(options) {
      this.render(options);
    },

    baseTemplate: _.template($('#foodtruck-popup-template').html()),

    render: function(options) {

      var foodtruck       = options.model;
      var foodtruck_map   = options.map;
      var ft_marker_index = options.indexx;

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(options.model.get('lat'), options.model.get('lon')),
        title:    foodtruck.get('name'),
        id:       foodtruck.get('id'),
        index:    ft_marker_index,
        map:      foodtruck_map,
      });

      // closure
      (function(marker, popup){
        google.maps.event.addListener(marker, 'click',  function() {
          fetchHours(popup.model, foodtruck_map);
          var template = popup.baseTemplate(popup.model.toJSON());
          if(POPUP) POPUP.close();
          POPUP = new google.maps.InfoWindow({
            content: template
          });
          POPUP.open(marker.map, marker);
        });

        popup.model.listenTo(popup.model, 'change:openHours', function() {
          var template = popup.baseTemplate(popup.model.toJSON());
          if(POPUP) POPUP.close();
          POPUP = new google.maps.InfoWindow({
            content: template
          });
          POPUP.open(marker.map, marker);
        });

      })(marker, this);
    }
  });
})();
