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

WTF.UserData = (function() {
  return Backbone.Model.extend({
    defaults: {
      //fields
      memos: 'N/A',
      ratings: 'N/A',
      favourites: 'N/A',
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
