function initialize() {

  var mapOptions = {
    center: { lat: 49.2, lng: -123.1},
    zoom: 11,
    disableDefaultUI: true
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  
  var ctaLayer = new google.maps.KmlLayer({
    url: 'http://napontaratan.com/WheresTheFood/street_food_vendors.kml'});

  google.maps.event.addListener(ctaLayer, 'click', function(kmlEvent) {
    var text = kmlEvent.featureData.name;
    console.log(text);
  });

  ctaLayer.setMap(map);
}