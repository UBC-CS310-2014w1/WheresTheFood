var WTF = WTF || {};

WTF.Utility = (function() {

  return {

    FoodTruckKey: 'FoodTrucks',

    fetchFoodtruckFromStorage: function() {
       // get from sessionStorage if collection is lost
       WTF.FoodTrucks = JSON.parse(sessionStorage.getItem(this.FoodTruckKey));
    },

    getFoodTruck: function(id) {
      if(WTF.FoodTrucks.length !== 0) {
        return new WTF.FoodTruck(_.where(WTF.FoodTrucks, {id: id})[0]);
      } else {
        return WTF.FoodTrucks.get(id);
      }
    },

    hasFoodTruckData: function() {
      return sessionStorage.getItem(this.FoodTruckKey)? true : false;
    }
  };

})();
