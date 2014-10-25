var Controller = {
	login : function() {
		 Server.login(function(userObject) {
			if(userObject) {
				console.log('hello controller');
				$('#login-button').hide();
				$('#overlay').hide();
				$('#map-canvas').show();
				$('#user-label').text(userObject.facebook.displayName);
				initialize();
				
	    		Server.pushUserData(userObject.uid, userObject.facebook.displayName);
			}
		});
		
	}
}