var WTF = WTF || {};

WTF.FoodTruck = (function() {

  return Backbone.Model.extend({

    defaults: {
      name: '',
      id: '',
      address: '',
      description: ''
    }

  });

})();

WTF.FoodTruckCollection = (function() {

  return Backbone.Collection.extend( {

    // Reference to this collection's model.
    model: WTF.FoodTruck

  });

})();
