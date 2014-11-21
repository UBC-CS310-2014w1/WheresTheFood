var WTF = WTF || {};

(function() {
  var instance = null;

  // Server: the data for our app will be stored at this firebase reference
  var databaseRef = new Firebase("https://vivid-torch-5902.firebaseio.com/");
  // current firebase user object
  var currentUser = databaseRef.getAuth();
  // reference to the user,comments node on the firebase
  var currentUserRef;
  var commentsRef = databaseRef.child('comments');
  if(currentUser !== null) {
    // creates the child node
    currentUserRef = databaseRef.child('users').child(currentUser.uid);
  }

  //FoodTruck data initialization
  var FoodTruckKey = 'FoodTrucks';

  // Use this function to fetch data from the dataset in Firebase.
  // (0) Do we have data persisited in sessionStorage?
  // (1) If we have, use that
  // (2) Otherwise use fetch from server, and persist in sessionStorage for use next time
  var fetchDataset = function() {
    if(sessionStorage.getItem(FoodTruckKey)) {
      fetchDatasetFromStorage.call(this);
      console.debug('restore from sessionStorage');
    } else {
      fetchDatasetFromServer.call(this);
      console.debug('get from server');
    }

  };

  var fetchDatasetFromStorage = function() {
    var foodtrucks = JSON.parse(sessionStorage.getItem(FoodTruckKey));
    this.set('parsedDataset', foodtrucks);
  };

  var fetchDatasetFromServer = function() {
    // Attach an asynchronous callback to read the data at our dataset reference
    databaseRef.child('dataset').on('value', function(snapShot){
        parseData.call(this,snapShot.val());
      }.bind(this),function(errorObject){
        console.log('The read failed: ' + errorObject.code);
        callback(null);
      });
  };

  var parseData = function(items) {
    var trucks = [];
    $.map(items, function(item){
      var modelObject = {};
      $.map(item, function(val, key){
       if(!val)
         return;
       if(key == 'description' || key == 'lat' || key == 'lon' || key == 'location')
         modelObject[key] = val;
       if(key == 'key')
         modelObject.id = val;
       if(key == 'business_name') {
         modelObject.name = val;
       }
      });
      modelObject.invalid = false;
      trucks.push(modelObject);
     });
     this.set('parsedDataset', trucks);
   };

  var fetchUser = function() {
    var propArr = ['favourites', 'memos', 'name', 'ratings'];
    for(var i = 0; i < propArr.length; i++) {
      attachValueHandler.call(this, propArr[i]);
    }
  };

  var attachValueHandler = function(property) {
    // currentUserRef is null if we haven't logged in
    if(currentUserRef) {
      currentUserRef.child(property).on('value', function(snapshot){
        this.set('parsedUser', {silent: true}); // force update
        this.set('parsedUser', property,snapshot.val());
      }.bind(this), function(errorObject) {
         console.log('The read failed: '+ errorObject.code);
      });
    }
  };

  // JS-like singleton
  function init() {

     var self_model =  Backbone.Model.extend({

      defaults: {
        parsedDataset: '',
        parsedUser: ''
      },

      login: function(callback) {
        databaseRef.authWithOAuthPopup("facebook", function(error, authData) {
            if(error) console.log('error');
            if(authData) {
              if(typeof callback === 'function') {
                currentUser = authData;
                currentUserRef = databaseRef.child('users').child(authData.uid);
                callback(authData);
              }
            }
          }, {
            remember: "sessionOnly",
            scope: "email"
        });

      },

      logout: function() {
        databaseRef.unauth();
        currentUser = null;
        currentUserRef = null;
      },

      fetchDataset: function() {
        fetchDataset.call(this);
      },

      fetchUser: function() {
        fetchUser.call(this);
      },

      getFoodTrucks: function() { return foodTrucks; },

      // ===== GETTERS =====
      getUser: function() { return currentUser; },

      // retrieve the latest memo from a specific restaurant
      // restaurantID: string - unique id of restaurant from dataset
      // callback: function to call when memo is fetched
      getCurrentMemo: function(restaurantID, callback) {
        currentUserRef.child('memos').child(restaurantID).on('value', function(snapshot){
           var newpost = snapshot.val();
           callback(newpost);
        }, function(errorObject) {
           console.log('The read failed: '+ errorObject.code);
        });
      },

      // retrieve the latest user rating for a specific restaurant
      // restaurantID: string - unique id of restaurant from dataset
      // callback: function to call when user rating is fetched
      getUserRating: function(restaurantID, callback) {
        currentUserRef.child('ratings').child(restaurantID).on('value', function(snapshot){
           var newpost = snapshot.val();
           callback(newpost);
        }, function(errorObject) {
           console.log('The read failed: '+ errorObject.code);
        });
      },

      getUserFav: function(restaurantID, callback) {
        currentUserRef.child('favourites').child(restaurantID).on('value', function(snapshot){
           var newpost = snapshot.val();
           callback(newpost);
        }, function(errorObject) {
           console.log('The read failed: '+ errorObject.code);
        });
      },

      getUserComments: function(foodtruckID, callback) {
        commentsRef.child(foodtruckID).on('value', function(snapshot){
          var listofComments = snapshot.val();
          if(typeof callback === 'function') {
            callback(listofComments);
          }
        }, function(errorObject) {
             console.log('The read failed: '+ errorObject.code);
        });
      },


      // ===== SETTERS =====
      // val: string - Name of user
      pushUsername: function(val) {
        currentUserRef.child('name').set(val);
      },

      // pushes memo to the specified restaurant
      // restaurantID: string - unique id of restaurant from dataset
      // memo: string - user specified string from textbox
      pushUserMemo: function(restaurantID,memo) {
        currentUserRef.child('memos').child(restaurantID).set(memo);
      },

      // pushes rating to specified restaurant of user account
      // restaurantID: string - unique id of restaurant from dataset
      // rating: int[0,5] - star rating of currentUser for the restaurant
      pushUserRating: function(restaurantID,rating) {
        currentUserRef.child('ratings').child(restaurantID).set(rating);
      },

      // comment: an object containing comment info: id, name comment
      pushUserComments: function(foodtruckID, comment) {
        commentsRef.child(foodtruckID).push(comment);
      },

      pushCommentLikes: function(foodtruckID, comment) {
        commentsRef.child(foodtruckID).child(comment.id).update(comment);
      },

      // pushes favourites to restaurant of user's account
      // restaurantID: string - unique to restaurant from dataset
      // like: boolean - true/false indictating restairant is favourited by user.
      pushUserFavourite: function(restaurantID, like){
        currentUserRef.child('favourites').child(restaurantID).set(like);
      },

      removeUserComments: function(foodtruckID, commentId) {
        commentsRef.child(foodtruckID).child(commentId).remove();
      }

    });

    return new self_model();
  }

  var Server =  {
    // Get the Singleton instance if one exists
    // or create one if it doesn't
    getInstance: function () {

      if ( !instance ) {
        instance = init();
      }

        return instance;
    }

  };

  WTF.Server = Server.getInstance();

})();
