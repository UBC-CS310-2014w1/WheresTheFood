var FoodTruckPopUpView = (function() {

  return Backbone.View.extend({

    initialize: function(id) {
      console.debug("FoodTruckPopUpView initialize");
      this.render(id);
    },

    baseTemplate: _.template($('#foodtruckpopupTemplate').html()),

    render: function(foodtruckId) {
      var foodtruck = _.where(foodtrucks.models, {id : foodtruckId})[0];
      sessionStorage.setItem(WTFConstants.FoodTruckKey, JSON.stringify(foodtruck));
      this.template = this.baseTemplate(foodtruck.toJSON());
      this.$el.html(this.template);
      return this;
    }

  })
})();
