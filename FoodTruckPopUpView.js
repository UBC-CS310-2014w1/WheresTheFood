var FoodTruckPopUpView = (function() {

  return Backbone.View.extend({

    initialize: function() {
      console.debug("FoodTruckPopUpView initialize");
      this.render();
    },

    template: _.template($('#foodtruckpopup_template').html()),

    render: function() {
      this.template = this.template({
        name: 'FoodTruck1',
        description: 'FoodTruck1 description',
        address: 'UBC FoodTruck1 address'
      });
      this.$el.html(this.template);
      return this;
    }

  })
})();
