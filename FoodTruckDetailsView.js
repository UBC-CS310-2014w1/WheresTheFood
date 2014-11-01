var FoodTruckDetailsView = (function() {

  var stars = document.getElementsByClassName('star');

  function submitRating(item) {
    var starNumber = item.target.itemNumber;
    for(var i = 0; i <= starNumber; i++)
      stars[i].innerHTML = "&#9733;";
    for(var j = starNumber + 1; j < 5; j++)
      stars[j].innerHTML = "&#9734;";

    $('#rScore').text(1+starNumber+'/5');
  }

  return Backbone.View.extend({

    initialize: function() {
      this.render(1);
      this.initRatings();
    },

    el: '#foodtruckdetails-div',

    baseTemplate: _.template($('#foodtruckpageTemplate').html()),

    render: function(id) {
      var foodtruck = JSON.parse(sessionStorage.getItem(WTFConstants.FoodTruckKey));
      this.template = this.baseTemplate(foodtruck);
      this.$el.html(this.template);
      return this;
    },

    initRatings: function() {
      for(var i = 0; i < stars.length ; i++) {
        stars[i].itemNumber = i;
        stars[i].addEventListener("click", submitRating);
      }
    },

  });
})();
