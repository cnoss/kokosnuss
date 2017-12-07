
// document.addEventListener('onload', initMap());

var map;
var infoWindow;
var service;
var pos;
var res;

function initMap() {
	// Create a map object and specify the DOM element for display.
	var gm = {lat: 51.0237731, lng: 7.5609185};

	pos = gm;

	map = new google.maps.Map(document.getElementById('js-map'), {
	  	center: pos,
	  	zoom: 13
	});

	infoWindow = new google.maps.InfoWindow({map: map});
  	service = new google.maps.places.PlacesService(map);

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
     	navigator.geolocation.getCurrentPosition(function(position) {
        	pos = {
          		lat: position.coords.latitude,
          		lng: position.coords.longitude
        	};

        	infoWindow.setPosition(pos);
        	infoWindow.setContent('Location found.');
        	map.setCenter(pos);
      	}, function() {
        	handleLocationError(true, infoWindow, map.getCenter());
      	});
    } else {
      	// Browser doesn't support Geolocation
     	 handleLocationError(false, infoWindow, map.getCenter());
    }

	// The idle event is a debounced event, so we can query & listen without
	// throwing too many requests at the server.
	map.addListener('tilesloaded', performSearch);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
      	'Error: The Geolocation service failed.':
      	'Error: Your browser doesn\'t support geolocation.');
}

function performSearch() {
	navigator.geolocation.getCurrentPosition(function(position) {
    	var loc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    	var request = {
  			location: loc,
  			radius: 2000,
    		keyword: 'Sehenswürdigkeit'
  		};
  		service.radarSearch(request, callback);
    });
}

function callback(results, status) {
  if (status !== google.maps.places.PlacesServiceStatus.OK) {
    console.error(status);
    return;
  }
  res = [null, null, null];
  for (var i = 0, result; result = results[i]; i++) {
    if (i < 3) {
      // var text = "<li>" + result.name + "</li>";
      // document.querySelector('#js-list').innerHTML += text;
      res[i] = result;
    }
    addMarker(result);

  }
  // showResults(res);
}

function addMarker(place) {
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    icon: {
      url: 'https://developers.google.com/maps/documentation/javascript/images/circle.png',
      anchor: new google.maps.Point(10, 10),
      scaledSize: new google.maps.Size(10, 17)
    }
  });

      var text = "<li>" + place.formatted_address + "</li>";
      document.querySelector('#js-list').innerHTML += text;

  google.maps.event.addListener(marker, 'click', function() {
    service.getDetails(place, function(result, status) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
      }
      infoWindow.setContent(result.name);
      infoWindow.open(map, marker);

    });
  });
}


function showResults (array) {
	document.querySelector('#js-list').innerHTML = "";
	for (var i = 0; i < 3; i++){
		if(array[i] != null){
			var text = "<li>" + array[i].name + "</li>";
		}
		document.querySelector('#js-list').innerHTML += text;
	}
}