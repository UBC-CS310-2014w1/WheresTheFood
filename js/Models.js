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
        ratings: 0
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
      isFavourited: false,
      memo: "",
      invalid: true // keep track of invalid foodtrucks and state this on pop up view
    }

  });

})();

(function() {

  var FILTER_NONE = 'no-filter';
  var FILTER_MEMO = 'hasMemo';
  var FILTER_FAVOURITED = 'favourited';
  var FILTER_RATING = 'hasRating';

  var populateFoodTrucks = function(model, foodtrucks, options) {
    console.debug('populating foodtruck');
    for(var index = 0, len = foodtrucks.length; index < len; index++) {
      this.add(new WTF.FoodTruck(foodtrucks[index]));
    }
    this.originalCollection= this.models; // to repopulate when clearing filters
  };

  //TODO we don't have to fetch favorites ratings now since we have it and store it sessionStorage

  // populate Users' favorite foodtrucks, memos, ratings
  var populateUserdata = function(prop, model, value, options) {
    for(var foodtruckId in value) {
      var data = value[foodtruckId];
      if(data) {
        // set foodtruck memo attribute to true
        this.get(foodtruckId).set(prop, data);
      }
    }
  };


  var FoodTrucks = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: WTF.FoodTruck,

    //Note about collection.reset for filtering purposes
    //the list of any previous models is available as options.previousModels

    initialize: function() {
      this.listenTo(WTF.Server, 'change:parsedDataset', populateFoodTrucks.bind(this));
      this.listenTo(WTF.User, 'change:favourites', populateUserdata.bind(this, 'isFavourited'));
      this.listenTo(WTF.User, 'change:memos', populateUserdata.bind(this, 'memo'));
    },

    filterFoodTrucks: function(filterType) {
      var filtered;
      this.reset(this.originalCollection, {silent: true}); // prevent trigger

      if(filterType === FILTER_NONE) {
        
          this.reset(this.originalCollection);

      } else if (filterType === FILTER_MEMO) {

        if(!this.hasMemoCollection) {
          filtered = this.filter(function(model) {
            var memo = model.get('memo');
            return memo !== '';
          });
          this.hasMemoCollection = filtered;
        }
        this.reset(this.hasMemoCollection);

      } else if (filterType === FILTER_FAVOURITED) {

        if(!this.isFavouritedCollection) {
          filtered = this.filter(function(model) {
            var isFavourited = model.get('isFavourited');
            return isFavourited;
          });
          this.isFavouritedCollection = filtered;
        }
        this.reset(this.isFavouritedCollection);

      } else if (filterType === FILTER_RATING) {

        if(!this.hasRatingCollection) {
          filtered = this.filter(function(model) {
            var rating = model.get('rating');
            return rating;
          });
          this.hasRatingCollection = filtered;
        }
        this.reset(this.hasRatingCollection);

      }
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
