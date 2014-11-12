var WTF = WTF || {};
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

  var populateFoodTrucks = function() {
    console.debug('populating foodtruck');
    var foodtruckModels = WTF.Server.getFoodTrucks();
    for(var index = 0, len = foodtruckModels.length; index < len; index++) {
      this.add(new WTF.FoodTruck(foodtruckModels[index]));
    }
  };

  var FoodTrucks = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: WTF.FoodTruck,

    initialize: function() {
      console.debug('setup foodtruck collection');
      this.listenTo(WTF.Server, 'change:parsed', populateFoodTrucks.bind(this));
    },

    getHasMemo: function() {
      return _.filter(this.models, function(model) {
        var memo = model.get('memo');
        return memo !== '';
      });
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
