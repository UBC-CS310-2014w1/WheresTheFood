var Server = (function() {
  // Server: the data for our app will be stored at this firebase reference
  var databaseRef = new Firebase("https://vivid-torch-5902.firebaseio.com/");
  // current firebase user object
  var currentUser = databaseRef.getAuth();
  // reference to the user node on the firebase
  var currentUserRef; 
  if(currentUser != null)
    currentUserRef = databaseRef.child('users').child(currentUser.uid);

  return Backbone.Model.extend({

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
	  
	  // retrieve the latest memo from a specific restaurant
	  getCurrentMemo: function(restaurantID, callback) {
      currentUserRef.child('memos').child(restaurantID).on('value', function(snapshot){
  	     var newpost = snapshot.val();
         callback(newpost);
		  }, function(errorObject) {
	       console.log('The read failed: '+ errorObject.code);
      });
	  },

    pushUsername: function(val) {
      currentUserRef.child('name').set(val);
    },

    // pushes memo to the specified restaurant
    pushUserMemo: function(restaurantID,memo) {
      currentUserRef.child('memos').child(restaurantID).set(memo);
    },

    logout: function() {
      databaseRef.unauth();
      currentUser = null;
      currentUserRef = null;
    },


    getUser: function() { return currentUser; },

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
    },
});

})();
