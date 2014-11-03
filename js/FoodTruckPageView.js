var WTF = WTF || {};

WTF.FoodTruckPageView = (function() {

  return Backbone.View.extend({

    initialize: function() {
      this.render();

      new WTF.FoodTruckDetailsView({ model : this.model});
      new WTF.MemoView({ model: this.model});
      new WTF.RatingsView({ model: this.model});
      new WTF.FavouriteView({model: this.model});
      new WTF.CommentsView({ model: this.model });
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

  var foodtruck;
  var $textBox;

  var updateText = function(text) {
      $textBox.val(text);
  };

  return Backbone.View.extend({

    initialize: function() {
      $textBox = $('#txtMemoBox');
      foodtruck = this.model;
      server.getCurrentMemo(foodtruck.id, updateText);
    },

    el: '#memoArea',

    events: {
      'click #saveButton': 'saveMemo',
      'click #deleteButton': 'resetMemo'
    },

    saveMemo: function(){
      alert('Memo saved');
      server.pushUserMemo(foodtruck.id, $textBox.val());
    },

    resetMemo: function(){
		  var confirmDelete = window.confirm("are you sure about this?");
    	if (confirmDelete) {
        $textBox.val('');
        server.pushUserMemo(foodtruck.id, $textBox.val());
    	}
    }

  });
})();


WTF.RatingsView = (function() {

  var server = WTF.Server.getInstance();
  var foodtruck;
  var $stars;

  var fillStars = function(starNumber) {
    if(!starNumber) return;
    for(var j = 0; j < 5; j++)
      $stars[j].innerHTML = "&#9734;";
    for(var i = 0; i < starNumber; i++)
      $stars[i].innerHTML = "&#9733;";
    $('#rScore').text(starNumber+'/5');
  };

  return Backbone.View.extend({

    initialize: function() {
      foodtruck = this.model;
      $stars = $('.star');
      for(var i = 0; i < $stars.length ; i++) {
        $stars[i].itemNumber = i + 1;
      }
      server.getUserRating(foodtruck.id, fillStars);
    },

    el: '#ratingsArea',

    events: {
      'click .star': 'submitRating'
    },

    submitRating: function(e) {
      var starNumber = e.target.itemNumber;
      fillStars(starNumber);
      server.pushUserRating(foodtruck.id, starNumber);
    },

  });

})();


WTF.FavouriteView = (function() {
   var server = WTF.Server.getInstance();

return Backbone.View.extend({

   initialize: function(){
    foodtruck = this.model;
   },

   el: '#favourites',

   events: {
    'click #saveFT': 'saveFT',
    'click #deleteFT': 'removeFT'
   },

   saveFT: function(){
    server.pushUserFavourite(foodtruck.id, true);
   },

   removeFT: function(){
    server.pushUserFavourite(foodtruck.id, false);
   }

  });
})();

WTF.CommentsView = (function() {

  var server = WTF.Server.getInstance();
  var foodtruck;

  var getDate = function() {
    //http://stackoverflow.com/questions/1531093/how-to-get-current-date-in-javascript
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd;
    }

    if(mm<10) {
        mm='0'+mm;
    }

    today = mm+'/'+dd+'/'+yyyy;
    return today;

  };


  return Backbone.View.extend({

    initialize: function() {
      foodtruck = this.model;
      var commentCollection = new WTF.CommentCollection();
      commentCollection.on('add', this.render, this);

      server.getUserComments(foodtruck.id, function(foodtruckComments){
        this.$el.find('#commentsList').empty();
        commentCollection.reset();
        if(!foodtruckComments) return;
        _.each(foodtruckComments, function(foodtruckComment, key) {
          foodtruckComment.key = key;
          var comment = new WTF.Comment(foodtruckComment);
          commentCollection.add(comment);
          console.debug('rendering');
        }, this);
      }.bind(this));
    },

    el: '#commentsArea',

    template: _.template($('#foodtruck-comments-template').html()),

    events: {
      'click #postComments': 'postComments',
      'click #deleteComment': 'deleteComment'
    },

    render: function(comment) {
      this.$el.find('#commentsList').append(this.template(comment.toJSON()));
      return this;
    },

    postComments: function() {
      console.debug('posting comments');
      var text = $('#commentsBox').val();
      $('#commentsBox').val('');
      if(text) {
        var commentObject = {
          name: server.getUser().facebook.displayName,
          comment: text,
          date: getDate()
        };
        console.debug('comment object ', JSON.stringify(commentObject));
        server.pushUserComments(foodtruck.id, commentObject);
      } else {
        console.debug('no text');
      }
    },

    deleteComment: function(e) {
      var commentUsername = $(e.currentTarget).data('name');
      var currentUsername = server.getUser().facebook.displayName;
      var commentId = $(e.currentTarget).data('commentid');
      console.debug('deleting comment');
      if(currentUsername === commentUsername) {
        console.log('Delete');
        server.removeUserComments(foodtruck.id, commentId);
      } else {
        console.log('Not the original poster, can\'t delete');
      }
    }

  });
})();

