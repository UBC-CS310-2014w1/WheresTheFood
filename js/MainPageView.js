var WTF = WTF || {};

WTF.MapView = (function() {

  var server = WTF.Server;

  var setupUserLabel = function() {
    $('#user-label').text(server.getUser().facebook.displayName)
    .css("cursor","pointer")
    .hover(function() {
      $('#user-label').text('Logout');
    }, function() {
      $('#user-label').text(server.getUser().facebook.displayName);
    })
    .click($.proxy(function () { // proxy allows 'this' context change
      console.log('logout');
      server.logout();
      WTF.AppRouter.navigate("login", true);
    }, this));
   };

  var mapOptions = {
    center: { lat: 49.256, lng: -123.1},
    zoom: 13,
    disableDefaultUI: true
  };

  var map;

  // sideBar
  var populateListView = function() {
    for(var i = 0; i < WTF.FoodTrucks.length ; i++) {
      appendFoodTruck(i);
    }
    initDataTable();
  };

  var appendFoodTruck = function(i) {
    $('#data-table').append(function() {
      var foodtruck = WTF.FoodTrucks.at(i);
      if(foodtruck.get('name') != 'N/A')
        return '<tr><td><a href="#foodtruck/' +
                        foodtruck.get('id') + '">' +
                        foodtruck.get('name') + '</a></td>'+
               '<td>' + foodtruck.get('description') + '</td>' +
               '<td>' + foodtruck.get('location') + '</td>' + '</tr>';
    });
  };

  var initDataTable = function() {
    $('#data-table').DataTable({
        "paging"    : false,
        "columnDefs": [{ "orderable": false, "targets": 0 }],

        "columns"   : [null,
                       {'visible' : false},
                       {'visible' : false}],
        "order"     : [[0, "asc"]],
        "scrollY"   : 500,
        "scrollCollapse": true,
        "info"      : false,
    });
  };

  var drawMarkers = function() {
    var marker;
    for(var i = 0; i < WTF.FoodTrucks.length; i++) {
      var current = WTF.FoodTrucks.at(i);
      // moved previous marker construction code in here
      // https://jslinterrors.com/dont-make-functions-within-a-loop
      makeMarker(current, i);
    }
  };

  var makeMarker = function(current, i) {
    // current - current foodtruck object
    // i - index of item in WTF.FoodTrucks
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
        var foodtruck = WTF.FoodTrucks.get(marker.id) || new WTF.FoodTruck();
        var foodTruckPopUpView = new WTF.FoodTruckPopUpView({ model: foodtruck });
        var infoWindow = new google.maps.InfoWindow({
          content: foodTruckPopUpView.template
        });
        infoWindow.open(map,marker);
      });
    })(marker);
  };


    return Backbone.View.extend({

    initialize: function() {
      console.debug('map view init');
      this.render();
    },

    template: _.template($('#map-template').html()),

    events: {
      'click #hamburger': 'toggleSideBar',
      'click #hasMemo': 'filterHasMemo'
    },

    render:function() {
      this.$el.html(this.template());
      $('.app-container').html(this.$el);
      setupUserLabel.bind(this)();
      map = new google.maps.Map($('#map-canvas').get(0),mapOptions);
      console.debug('foodtruck length', WTF.FoodTrucks.length);
      drawMarkers();
      populateListView();
      return this;
    },

    getMap: function() {
      return map;
    },

    toggleSideBar: function() {
      $('.wtf-side-panel-left').toggleClass('wtf-side-panel-open');
      $('body').toggleClass('wtf-left');
    },

    filterHasMemo: function() {
      WTF.FoodTrucks.getHasMemo();
    }

  });

})();

WTF.LoginView = (function() {

  var server = WTF.Server;

  var userLoginCallback = function(userObject) {
    if(userObject) { // if login is successful (userObject is not null)
      WTF.AppRouter.navigate("map", true);
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
      $('#user-label').text('Hello!');
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
