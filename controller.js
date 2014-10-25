var Controller = {
	login : function() {
		 Server.login(function(userObject) {
			if(userObject) {
				$('#login-button').hide();
				$('#overlay').hide();
				$('#map-canvas').show();
				$('#user-label').text(userObject.facebook.displayName)
					.css("cursor","pointer")
					.hover(function() {
						$('#user-label').text('Logout');
					}, function() {
						$('#user-label').text(userObject.facebook.displayName);
					})
					.click(function () {
						Server.logout();
						location.reload();
					});

				initialize();
				
	    		Server.pushUserData(userObject.uid, userObject.facebook.displayName);
			}
		});
		
	}
}