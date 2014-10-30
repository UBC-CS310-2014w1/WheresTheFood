var FoodTruckDetailsView = (function() {
  return Backbone.View.extend({

    initialize: function() {
      this.render(1);
    },

    el: '#foodtruckdetails-div',

    baseTemplate: _.template($('#foodtruckpageTemplate').html()),

    render: function(id) {
      var foodtruck = JSON.parse(sessionStorage.getItem(WTFConstants.FoodTruckKey));
      this.template = this.baseTemplate(foodtruck);
      this.$el.html(this.template);
      return this;
    }

  });
})();
