var Server = (function() {
  // Server: the data for our app will be stored at this firebase reference
  var databaseRef = new Firebase("https://vivid-torch-5902.firebaseio.com/");
  // current firebase user object
  var currentUser = databaseRef.getAuth();
  // reference to the user node on the firebase
  var currentUserRef = {};

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

checIfUserExist: function() {

},

    pushUsername: function(val) {
      currentUserRef.child('name').set(val);
    },

    // pushes memo to the specified restaurant
    pushUserMemo: function(restaurant,memo) {
      currentUserRef.child('memos').child(restaurant).set(memo, function(error) {
          if (error) {
            alert("Memo could not be saved" + error);
          } else {
            alert("Memo saved successfully");
          }

      });
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
