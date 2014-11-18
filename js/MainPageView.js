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
      console.log('logout');
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
               '<td>' + foodtruck.get('description') + '</td>' + 
               '</tr>';
    });
  };

  var generateIcon = function() {
    var random = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
    return '<img src="images/foodtruck_icon'+random+'.png" style="margin-right:15px;"/>';
  };

  var initDataTable = function() {

    dataTable = $('#data-table').DataTable({
        "paging"    : false,
        "columnDefs": [{ "orderable": false, "targets": 0 },
                       { "width": "90%", "targets": 0}],
        "columns"   : [{'visible' : true},
                       {'visible' : false},
                       {'visible' : false}],
        //"order"     : [[0, "asc"]],
        "scrollY"   : 500,
        "scrollCollapse": true,
        "info"      : false,
        "destroy"   : true 
    });

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
  };

  var drawMarkers = function() {
    var marker;
    for(var i = 0, len = WTF.FoodTrucks.length; i < len ; i++) {
      var current = WTF.FoodTrucks.at(i);
      // moved previous marker construction code in here
      // https://jslinterrors.com/dont-make-functions-within-a-loop
      makeMarker(current, i);
    }
  };

  var infoWindow;
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
        if(infoWindow) infoWindow.close();
        var foodtruck = WTF.FoodTrucks.get(marker.id) || new WTF.FoodTruck();
        var foodTruckPopUpView = new WTF.FoodTruckPopUpView({ model: foodtruck });
        infoWindow = new google.maps.InfoWindow({
          content: foodTruckPopUpView.template
        });
        infoWindow.open(map,marker);
      });
    })(marker);
  };

  //usersearch Location
  var usersearchLocation = function(){
    //********* Making link b/t search box ul element and code
    var userInput = $('#user-input').get(0);
 
    var options = {
     //types: ['establishment']
    };

    var searchBox = new google.maps.places.Autocomplete(userInput, options);

    google.maps.event.addListener(searchBox, 'places_changed', function() {
      var places = searchBox.getPlaces();

    });
  };


  return Backbone.View.extend({

    initialize: function() {
      console.debug('map view init');
      this.render();
      this.listenTo(WTF.FoodTrucks, 'all', drawMarkers);
      initRadioButtonEvents();

      usersearchLocation();
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

})();

WTF.LoginView = (function() {

  var server = WTF.Server;

  var userLoginCallback = function(userObject) {
    if(userObject) { // if login is successful (userObject is not null)
      server.fetchUser();
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
