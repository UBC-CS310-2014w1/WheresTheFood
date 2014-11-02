var WTF = WTF || {};

WTF.FoodTruckPageView = (function() {

  return Backbone.View.extend({

    initialize: function() {
      this.render();
      new WTF.FoodTruckDetailsView({ model : this.model});
      new WTF.MemoView({ model: this.model});
      new WTF.RatingsView({ model: this.model});
    },

    template: _.template($('#foodtruck-page-template').html()),

    render: function() {
      this.$el.html(this.template());
      $('.app-container').html(this.$el.html()).attr('name', 'detail');// attr hack to add bg image
      return this;
    }

  });

})();


WTF.FoodTruckDetailsView = (function() {

  return Backbone.View.extend({

    initialize: function() {
      this.render();
    },

    el: '#foodtruckdetails-div',

    template: _.template($('#foodtruck-details-template').html()),

    render: function() {
      var template = this.template(this.model.toJSON());
      this.$el.html(template);
      return this;
    },

  });
})();

WTF.MemoView = (function() {

  var server = WTF.Server.getInstance();

  // var saveButton = document.getElementById("saveButton");
  // var deleteButton = document.getElementById("deleteButton");
  // var textBox = document.getElementById("txtMemoBox");
  var foodtruck;
  var $textBox;

  var updateText = function(text) {
      $textBox.val(text);
  };

  return Backbone.View.extend({

    initialize: function() {
      $textBox = $('#txtMemoBox'); // only available when view is init
      foodtruck = this.model;
      server.getCurrentMemo(foodtruck.id, updateText);

    },

    el: '#memoArea',

    events: {
      'click #saveButton': 'saveMemo',
      'click #deleteButton': 'resetMemo'
    },

    saveMemo: function(){
      console.log('saving ', $textBox.val());
      server.pushUserMemo(foodtruck.id, $textBox.val());
    },

    resetMemo: function(){
      console.log('memo reset');
      $textBox.val('');
      server.pushUserMemo(foodtruck.id, $textBox.val());
    }

  });

})();

WTF.RatingsView = (function() {
  // var stars = document.getElementsByClassName('star');
  var $stars;

  return Backbone.View.extend({

    initialize: function() {
      $stars = $('.star');
       for(var i = 0; i < $stars.length ; i++) {
        $stars[i].itemNumber = i;
      }
    },

    el: '#ratingsArea',

    events: {
      'click .star': 'submitRating'
    },

    submitRating: function(e) {
      var starNumber = e.target.itemNumber;
      for(var i = 0; i <= starNumber; i++)
        $stars[i].innerHTML = "&#9733;";
      for(var j = starNumber + 1; j < 5; j++)
        $stars[j].innerHTML = "&#9734;";

      $('#rScore').text(1+starNumber+'/5');
    }

  })

})();

