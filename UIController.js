var map;

// when page is loaded
$(document).ready( function () {
  // load map
  var mapOptions = {
    center: { lat: 49.2, lng: -123.1},
    zoom: 11,
    disableDefaultUI: true
  };

  // display map on the div with id map-canvas
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  // on login click
  $("#login-button").click(function () {
    Server.login(function(userObject) {
      if(userObject) { // if login is successful (userObject is not null)
        $('#login-button').hide();
        $('#overlay').hide();
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

        loadMarkers();
        
        // push user info to server
        Server.pushUserData(userObject.uid, userObject.facebook.displayName);
      }
    });
  }); 
});

// populate the map with markers
function loadMarkers() {
  // parse food truck locations from file to a layer
  var ctaLayer = new google.maps.KmlLayer({
    url: 'http://napontaratan.com/WheresTheFood/street_food_vendors.kml'});

  // example of on marker click event
  google.maps.event.addListener(ctaLayer, 'click', function(kmlEvent) {
    var text = kmlEvent.featureData.name;
    console.log(text);
  });

  // adds the layer to the map
  ctaLayer.setMap(map);
}