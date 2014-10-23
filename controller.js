var Controller = {
	login : function() {
		 Server.login(function(userObject) {
			if(userObject) {
				console.log('hello controller');
				$('#login').hide();
				$('#map-canvas').show();
				initialize();
				
	    		Server.pushUserData(userObject.uid, userObject.facebook.displayName);
			}
		});
		
	}
}