var WTF = WTF || {};

WTF.Utility = (function() {

  return {

    FoodTruckKey: 'FoodTrucks',

    getFoodTruck: function(id) {
      if(!WTF.FoodTrucks.length) {
        // get from sessionStorage if collection is lost
        var collection = JSON.parse(sessionStorage.getItem(this.FoodTruckKey));
        return new WTF.FoodTruck(_.where(collection, {id: id})[0]);
      } else {
        return WTF.FoodTrucks.get(id);
      }
    },

    hasFoodTruckData: function() {
      return sessionStorage.getItem(this.FoodTruckKey)? true : false;
    }
  }

})();
