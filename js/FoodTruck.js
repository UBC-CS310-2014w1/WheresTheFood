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


WTF.CommentCollection = (function() {

  return Backbone.Collection.extend( {

    // Reference to this collection's model.
    model: WTF.Comment

  });

})();
