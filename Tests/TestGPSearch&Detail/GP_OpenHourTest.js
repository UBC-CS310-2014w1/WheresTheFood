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
    radius: 500,
    //name: 'Taser Sandwiches',
    query: 'Falafel Plus'
    //type: ['store']
  };


  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  // request is the info we send the remote server to obtain specific info
  // We add callback b/c we want to make sure that our textSearch actually completed before
  // being used by other functions ( callback returns two stuff
  //(that's why we make a helper function called callback with 2 paramters))
  service.textSearch(request, callback);
}


/*
*
*/
function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      //createMarker(results[i]);
       if (checkSubString(results[i].name.toLowerCase(), 'Falafel Plus'.toLowerCase())) {
       createMarker(results[i]);
       break;
        }
    }
  }
}

// check substring now
function checkSubString(mainOne, needCheck) {
  return mainOne.indexOf(needCheck) >= 0;
}

// function createMarker(place) {
//   var placeLoc = place.geometry.location;
//   var marker = new google.maps.Marker({
//     map: map,
//     position: place.geometry.location
//   });

//   var open_hours = place.opening_hours;

//   google.maps.event.addListener(marker, 'click', function() {
//     infowindow.setContent(place.place_id);
//     infowindow.open(map, this);
//   });
// }

 function createMarker(place) {
  var placeID = place.place_id;

  var request = {
    placeId: placeID
  };

// Time to get the more detail boys
  var service = new google.maps.places.PlacesService(map);
  service.getDetails(request, function(place2, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      var marker = new google.maps.Marker({
        map: map,
        position: place2.geometry.location
      });


     var OpenDays = "Not Available";
     if (place2.hasOwnProperty("opening_hours")) {
       OpenDays = place2.opening_hours.weekday_text[checkDay()];
     }

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent("This place is: " + place2.name + "Today we open: " +OpenDays);
        infowindow.open(map, this);

      });

    }
  });

}

function checkDay(){
  var day = new Date();
  return day.getDay();
}

google.maps.event.addDomListener(window, 'load', initialize);
