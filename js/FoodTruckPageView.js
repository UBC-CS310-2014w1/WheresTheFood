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
      new WTF.InstaView({model: this.model});

    },

    events: {
      'click:#backButton': 'backToMap'
    },

    backToMap: function(){
      WTF.AppRouter.navigate("map", true);
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

  var server = WTF.Server;

  var foodtruck;
  var $textBox;

  var updateText = function(text) {
      $textBox.val(text);
  };

  return Backbone.View.extend({

    initialize: function() {
      $textBox = $('#txtMemoBox');
      foodtruck = this.model;
      server.getCurrentMemo(foodtruck.get('id'), updateText);
    },

    el: '#memoArea',

    events: {
      'click #saveButton': 'saveMemo',
      'click #deleteButton': 'resetMemo'
    },

    saveMemo: function(){
      alert('Memo saved');
      server.pushUserMemo(foodtruck.get('id'), $textBox.val());
    },

    resetMemo: function(){

		var confirmDelete = window.confirm("are you sure about this?");
    if (confirmDelete) {
        $textBox.val('');
        server.pushUserMemo(foodtruck.get('id'), $textBox.val());
    }

    }

  });
})();


WTF.RatingsView = (function() {

  var server = WTF.Server;
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
      server.getUserRating(foodtruck.get('id'), fillStars);
    },

    el: '#ratingsArea',

    events: {
      'click .star': 'submitRating'
    },

    submitRating: function(e) {
      var starNumber = e.target.itemNumber;
      fillStars(starNumber);
      server.pushUserRating(foodtruck.get('id'), starNumber);
    },

  });

})();


WTF.FavouriteView = (function() {

   var server = WTF.Server;
   var foodtruck;

   var initFT = function(status) {
    if(!status) foodtruck.fav = false;
    else  {
      foodtruck.fav = true;
      $("#favourited-icon").css('opacity', 1);
    }
   };

return Backbone.View.extend({

   initialize: function(){
    foodtruck = this.model;
    server.getUserFav(foodtruck.get('id'), initFT);
   },

   el: '#favourites',

   events: {
    'click #favourited-icon': 'toggleFT'
   },

   toggleFT: function(){
    if(foodtruck.fav) {
      foodtruck.fav = false;
      $("#favourited-icon").css('opacity', 0.1);
    } else {
      foodtruck.fav = true;
      $("#favourited-icon").css('opacity', 1);
    }
    server.pushUserFavourite(foodtruck.get('id'), foodtruck.fav);

   },

  });
})();

WTF.CommentsView = (function() {

  var server = WTF.Server;
  var foodtruck;
  var commentCollection = WTF.Comments;

  var getDate = function() {
    //http://stackoverflow.com/questions/1531093/how-to-get-current-date-in-javascript
    var today = new Date();
    var dd = today.getDate();
    var MM = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    var hh = today.getHours();
    var mm = today.getMinutes();
    var ss = today.getSeconds();

    if(dd<10) {
      dd='0'+dd;
    }

    if(MM<10) {
      MM='0'+MM;
    }

    if(hh < 10) {
      hh = '0' + hh;
    }

    if(mm < 10) {
      mm = '0' + mm;
    }

    if(ss < 10) {
      ss = '0' + ss;
    }

    today = MM+'/'+dd+'/'+yyyy + ' ' +   hh + ':' + mm + ':' + ss;
    return today;

  };

  var retrieveComments = function() {

      server.getUserComments(foodtruck.get('id'), function(foodtruckComments){
        if(!foodtruckComments) return;
        this.$el.find('#commentsList').empty();
        commentCollection.reset();

        _.each(foodtruckComments, function(foodtruckComment, key) {
          foodtruckComment.id = key;
          var comment = new WTF.Comment(foodtruckComment);
          commentCollection.add(comment);
          console.debug('rendering');
        }, this);

      }.bind(this));

  };

  return Backbone.View.extend({

    initialize: function() {
      foodtruck = this.model;
      this.listenTo(commentCollection, 'add', this.render);
      retrieveComments.call(this);
    },

    el: '#commentsArea',

    template: _.template($('#foodtruck-comments-template').html()),

    events: {
      'hover #a-comment': 'showButton',
      'click #post-comments': 'postComments',
      'click #delete-comment': 'deleteComment',
      'click #like-comment': 'likeComment'
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
        server.pushUserComments(foodtruck.get('id'), commentObject);
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
        var confirmDelete = window.confirm("are you sure about this?");
        if (confirmDelete) {
          server.removeUserComments(foodtruck.get('id'), commentId);
        }
      } else {
        alert('DENIED - Go on, nothing to see here\n You are not the original poster btw');
      }
    },

    likeComment: function(e) {
        var commentId = $(e.currentTarget).data('commentid');
        var commentObject = commentCollection.get(commentId);
        var currentLikes = commentObject.get('likes');
        console.log('currLikes', currentLikes);
        commentObject.set('likes', ++currentLikes);
        // convert to regular JSON object for storing in firebase
        server.pushCommentLikes(foodtruck.get('id'), commentObject.toJSON());
        var likes = commentObject.get('likes');
        console.log('newLikes', likes);
    },

    showButton: function(e) {
      if(e.type == 'mouseenter'){
        $(e.currentTarget).find('#delete-comment').css('display', 'inline');
      } else {
        $(e.currentTarget).find('#delete-comment').css('display', 'none');
      }
    }

  });
})();

WTF.InstaView = (function() {

  var showInstaPhotos = function() {
    var getType = 'tagged';
    var clientId = '90f31b767931424191d85114732163f6';

    var foodtruckName = this.model.get('name').replace(/[^a-zA-Z0-9]/g, '');
    var foodtruckDescription = this.model.get('description').replace(/[^a-zA-Z0-9]/g, '');
    foodtruckDescription = (foodtruckDescription === 'NA')? 'foodtruck' :foodtruckDescription;
    foodtruckName = (foodtruckName === 'NA')? foodtruckDescription: foodtruckName;

    var tagName= foodtruckName;
    var alternateTagname = foodtruckDescription;

    new Instafeed({
      get: getType,
      tagName: tagName,
      clientId: clientId,
      error: function(errMsg) {
        console.debug('getting alternate tag because ', errMsg);
        new Instafeed({
          get: getType,
          tagName: alternateTagname,
          // template: '<a href="{{link}}"><div> INSTA </div><img src="{{image}}" /></a>',
          clientId: clientId,
        }).run();
      }
    }).run();

  };

  return Backbone.View.extend({

    initialize: function() {
      showInstaPhotos.call(this);
    },

  });

})();
