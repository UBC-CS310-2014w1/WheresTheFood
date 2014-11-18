var map;
var infowindow;

function initialize() {
  var vancouver = new google.maps.LatLng(49.261226, -123.113927);

  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: vancouver,
    zoom: 15
  });

  var request = {
    location: vancouver,
    radius: 1000,
    query: 'Taser Sandwiches'
  };

  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  // this will return an array of PlaceResult objects
  service.textSearch(request, callback);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}


google.maps.event.addDomListener(window, 'load', initialize);
