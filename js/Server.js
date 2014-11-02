var WTF = WTF || {};

WTF.Server = (function() {
  // Server: the data for our app will be stored at this firebase reference
  var databaseRef = new Firebase("https://vivid-torch-5902.firebaseio.com/");
  // current firebase user object
  var currentUser = databaseRef.getAuth();
  // reference to the user node on the firebase
  var currentUserRef;
  if(currentUser !== null)
    currentUserRef = databaseRef.child('users').child(currentUser.uid);

  var instance = null;

  function init() {

     var self_model =  Backbone.Model.extend({

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

      // pushes favourites to restaurant of user's account
      // restaurantID: string - unique to restaurant from dataset
      // like: boolean - true/false indictating restairant is favourited by user.
      pushUserFavourite: function(restaurantID, like){
        currentUserRef.child('favourites').child(restaurantID).set(like);
      },

      // Use this function to fetch data from the dataset in Firebase.
      // It is called in UIController.js with parseData
      fetchDataset: function(callback) {
        // Attach an asynchronous callback to read the data at our dataset reference
        databaseRef.child('dataset').on('value', function(snapShot){
            if(callback) callback(snapShot.val());
          },function(errorObject){
            console.log('The read failed: ' + errorObject.code);
            callback(null);
          });
      }

    });

    return new self_model();
  }


  return {
    // Get the Singleton instance if one exists
    // or create one if it doesn't
    getInstance: function () {

      if ( !instance ) {
        instance = init();
      }

      return instance;
    }

  };

})();
