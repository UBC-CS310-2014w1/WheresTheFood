var server = (function() {
  // Server
  var databaseRef = new Firebase("https://vivid-torch-5902.firebaseio.com/");
  // current firebase user object
  var currentUser = {};
  // reference to the user node on the firebase
  var currentUserRef = {};

  return {
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

    fetchDataset: function() {
      console.log("this is the dataset: " ,databaseRef.child('dataset'));
    },

    pushUsername: function(val) {
      currentUserRef.child('name').set(val);
    },

    // pushes memo to the specified restaurant
    pushUserMemo: function(restaurant,memo) {
      currentUserRef.child('memos').child(restaurant).set(memo);
    },

    getCurrentUser: function() {
      return currentUser;
    },

    logout: function() {
      databaseRef.unauth();
    },

  };

})();

// module.exports = Backbone.Model.extend(server);
var Server = Backbone.Model.extend(server);
