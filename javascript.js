
// This function does the local ajax call
$(function() {    // do once original document loaded and ready
      $('#load').click(function() {
              $.getJSON("favorite_places.json", function(responseObject, diditwork) {
                      console.log(diditwork);
                      var displayText = 
                              "";
                      for (var i = 0; i<responseObject.locations.length; i++) {
                              var location = responseObject.locations[i];
                              displayText += "<br>" + location.name + " - " 
                                                      + location.address;
                              }
              $("#favplaces").append(displayText);
              } );  // getJSON
              $("#load").fadeOut(10);
      } );  // click

      $( "#fadein" ).click(function() {
        $("#favplaces").fadeIn(1000);
      });
      $( "#fadeout" ).click(function() {
        $("#favplaces").fadeOut(1000);
      });      

      $( "#barfadein" ).click(function() {
        $("#location_history").fadeIn(1000);
      });
      $( "#barfadeout" ).click(function() {
        $("#location_history").fadeOut(1000);
      });      

}); // onReady

// Gets the geolocation from HTML5
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        $("#map-canvas").html("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    createMap(position.coords.latitude,position.coords.longitude);
    getLocations(position.coords.latitude,position.coords.longitude);
}

// When the page loads, get the geolocation
$( document ).ready(function() {
  getLocation();
});

// Function to create the map
function createMap(lat, lon){

  // This creates the map after you are geolocated
  var myLatlng = new google.maps.LatLng(lat,lon);
  mylat = lat
  mylon = lon
  var mapOptions = {
    zoom: 14,
    center: myLatlng
  }
  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions) 

  // This is the marker highlighting where you are
  var contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h1 id="firstHeading" class="firstHeading">Your Location</h1>'+
        '<div id="bodyContent">'+
        '<p>This is where you\'re currently located.'+
        '</div>'+
        '</div>';
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Your Location'
    });
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map,marker);
    });
}

// Gets the location history from foursquare
function getLocations(lat, lon) {
  
  try {
  $.ajax({
    url:"https://api.foursquare.com/v2/venues/search",
    data: {
      ll : lat + "," + lon,
      categoryId : "4bf58dd8d48988d116941735", // Gets bars only
      radius : "1600", // Mile radius
      oauth_token : "DRPFAC0SDFKJONOGN5DH2N043SBIJHC53GNYVTMTJH3QN55P", // Token from a dummy account
      format : "json",
      callback : "displayLocations", // Pass foursquare the callback function
      v : "20140921" // Pass foursquare the callback function
      },
    jsonp: false,
    dataType: "jsonp",      // treat the request as JSONP
    crossDomain: true
    } );
  return false;
  } catch (e) {console.log(e.description);}
}

// Prints out the list of bars that are nearby
function displayLocations(response) {
  var items = response.response.venues

  // HTML to create the jQuery list view
  $("#location_history").append("<ul data-role=\"listview\" data-inset=\"true\">");

  for (var i=1;i<items.length;i++){
    var p = items[i];
    var name = p.name;
    var location = p.location;
    var id = p.id;
    getMarker(name, p.location.lat, p.location.lng, location.address)

    // Adds a bar to the list of bars
    $("#location_history").append("<li><a href=\"#\"><h2>" + p.name + "</h2>" + "<p>1 mile away</p>" + "</a></li>");
    

    // Previous code that allowed you to click on items to create markers
    // $("#location_history").append("<br><a href=\"#\" onclick=\"getMarker('" + p.name.replace(/[^A-Za-z ]/g, "") + "', " + 
    //   p.location.lat + ", " + p.location.lng + ")\">" + p.name  + " - " + p.location.address + "</a>");
  }
}

// Creates and places the markers for the bars on the map
function getMarker(name, lat, lon, address){
  var myLatlng = new google.maps.LatLng(lat,lon);
    // This is the marker highlighting the info of the restaurant
  var contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h1 id="firstHeading" class="firstHeading">' + name + '</h1>'+
        '<div id="bodyContent">'+
        '<p>'+ address +
        '</div>'+
        '</div>';
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Bar'
    });
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map,marker);
    });
}
