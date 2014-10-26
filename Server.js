var server = (function() {
  // Server
  var databaseRef = new Firebase("https://vivid-torch-5902.firebaseio.com/");
  var currentUser = {};

  return {
    login: function(callback) {
        databaseRef.authWithOAuthPopup("facebook", function(error, authData) {
            if(error) console.log('error');
            if(authData) {
              if(typeof callback === 'function') {
                currentUser = authData;
                callback(authData);
              }
            }
          }, {
            remember: "sessionOnly",
            scope: "email"
        });

      },

    pushUserData: function(key, val) {
        databaseRef.child('users').child(key).set(val);
      },

    getCurrentUser: function() {
        return currentUser;
    },

    logout: function() {
        databaseRef.unauth();
    },

    fetchDataset: function() {
    console.log("this is the dataset: " ,databaseRef.child('dataset'));
    }

  };

})();

// module.exports = Backbone.Model.extend(server);
var Server = Backbone.Model.extend(server);
