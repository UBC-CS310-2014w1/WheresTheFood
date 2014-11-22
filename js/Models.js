var WTF = WTF || {};

(function() {

    //populate user data by fetching it from firebase user node
    var populateUser = function(model, value, options) {
      this.set(value, options);
    };

    var user = Backbone.Model.extend({

      defaults: {
        favourites: [],
        memos: [],
        name: '',
        ratings: 0,
        lat: 'N/A',
        lon: 'N/A'
      },

      initialize: function() {
        this.listenTo(WTF.Server, 'change:parsedUser', populateUser.bind(this));
      }

    });

    WTF.User = new user();
})();

WTF.FoodTruck = (function() {

  return Backbone.Model.extend({

    defaults: {
      name: 'N/A',
      id: 'N/A',
      address: 'N/A',
      description: 'N/A',
      location: 'N/A',
      lat: 'N/A',
      lon: 'N/A',
      marker: 'N/A',
      rating: 0,
      distance: 0,
      isFavourited: false,
      memo: "",
      openHours: 'Not Available',
      weeklyHours: 'Not Available',
      invalid: true // keep track of invalid foodtrucks and state this on pop up view
    }

  });

})();

(function() {

  var populateFoodTrucks = function(model, foodtrucks, options) {
    console.debug('populating foodtruck');
    for(var index = 0, len = foodtrucks.length; index < len; index++) {
      this.add(new WTF.FoodTruck(foodtrucks[index]));
    }
    this.originalCollection= this.models; // to repopulate when clearing filters
    syncStorage.call(this);
  };

  //TODO we don't have to fetch favorites ratings now since we have it and store it sessionStorage

  // populate Users' favorite foodtrucks, memos, ratings
  var populateUserdata = function(prop, model, value, options) {
    console.debug('populating userdata');
    for(var foodtruckId in value) {
      var data = value[foodtruckId];
      if(data) {
        // set foodtruck memo attribute to true
        this.get(foodtruckId).set(prop, data);
      }
    }
    syncStorage.call(this);
  };

  var syncStorage = function() {
    console.debug('syncing');
    // model change will be triggered by server data,
    // so we need to re-store into storage to keep data in sync with server
    var FoodTruckKey = 'FoodTrucks';
    var updatedFoodTrucks = this.toJSON();
    sessionStorage.setItem(FoodTruckKey, JSON.stringify(updatedFoodTrucks));
    this.trigger("reDrawListView");
  };


  var FoodTrucks = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: WTF.FoodTruck,

    initialize: function() {
      this.listenTo(WTF.Server, 'change:parsedDataset', populateFoodTrucks.bind(this));
      this.listenTo(WTF.User, 'change:favourites', populateUserdata.bind(this, 'isFavourited'));
      this.listenTo(WTF.User, 'change:memos', populateUserdata.bind(this, 'memo'));
      this.listenTo(WTF.User, 'change:ratings', populateUserdata.bind(this, 'rating'));
    },

    filterFoodTrucks: function(filterType) {
      // use originalCollection to do filtering
      // avoid triggering drawMarkers with slient - true
      this.reset(this.originalCollection, {silent: true});

        this.reset(this.filter(function(model) {
          // if there is no filter type just return the same
          var val = (model.has(filterType))? model.get(filterType): true;
          return (val)? true: false;
        }));

    }

  });

  WTF.FoodTrucks = new FoodTrucks();

})();



WTF.Comment = (function() {

  return Backbone.Model.extend({

    defaults: {
      name: '',
      commnt: '',
      date: '',
      comment_id: '' // unique id created by firebase
    }

  });

})();


(function() {

  var Comments = Backbone.Collection.extend( {

    // Reference to this collection's model.
    model: WTF.Comment

  });

  // single FoodTruckCollection instance
  WTF.Comments = new Comments();

})();
