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

  var FoodTruck = Backbone.Collection.extend( {

    // Reference to this collection's model.
    model: WTF.FoodTruck

  });

  // single FoodTruckCollection instance
  WTF.FoodTrucks = new FoodTruck();

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
