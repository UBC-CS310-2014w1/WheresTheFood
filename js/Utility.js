var WTF = WTF || {};

WTF.Utility = (function() {

  return {

    FoodTruckKey: 'FoodTrucks',
    UserKey: 'User',

    fetchFoodtruckFromStorage: function() {
       // get from sessionStorage if collection is lost
       var foodtruckArray = JSON.parse(sessionStorage.getItem(this.FoodTruckKey));
        _.each(foodtruckArray, function(foodtruckObj){
          WTF.FoodTrucks.add(new WTF.FoodTruck(foodtruckObj));
        });
        console.debug('fetchFoodtruckFromStorage ', WTF.FoodTrucks.length);

    },

    fetchUserDataFromStorage: function() {
       // get from sessionStorage if collection is lost
       var userData = JSON.parse(sessionStorage.getItem(this.UserKey));
       WTF.UserData = userData;
       console.debug('fetchUserDataFromStorage ', WTF.UserData);
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
    },

    hasUserData: function() {
      return sessionStorage.getItem(this.UserKey)? true : false;
    }
  };

})();
