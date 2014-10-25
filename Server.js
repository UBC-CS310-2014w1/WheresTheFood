// Facebook login
var databaseRef = new Firebase("https://vivid-torch-5902.firebaseio.com/");
var currentUser = {};

var Server = {
  login: function(callback) {
      databaseRef.unauth();
      databaseRef.authWithOAuthPopup("facebook", function(error, authData) {
          if(error) console.log('error');
          console.log('checking cred..');
          if(authData) { 
            console.log('hello: ' + authData.facebook.displayName); 
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
  }
}




