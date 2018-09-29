var longUser = -118.243683,
  latUser = 34.052235;

var curDistance = 0;

var geocoder;


initialize();

function initialize() {

  //Unfortunately cannot use with Django local hosts but would get user's location from ip instead of using default Los Angeles.

  /*
   $.get("https://ipinfo.io", function(response) {

       jobComponent.location = response.city;
       jobComponent.zipcode = response.postal;

       latUser = parseFloat(response.loc.split(',')[0]);
       longUser = parseFloat(response.loc.split(',')[1]);



    }, "jsonp").done(function() {

     //initDistCheck();

     });
*/


  //Calls Rest Framework API to get Data gathered by BackEnd Database
  $.getJSON("http://127.0.0.1:8000/shop/api/jobs/?format=json", function(data) {

    for (var i = data.length - 1; i >= 0; i--) {
      //if (i == (data.length - 9)) return;
      var myObject = {
        id: data[i]['id'],
        title: data[i]['title'],
        description: data[i]['description'],
        estimatedTime: data[i]['hours'],
        pay: data[i]['payPerHour'],
        city: data[i]['city'],
        image: data[i]['image'],
        distance: 'N/A',
        lat: 0,
        long: 0,

      }
      jobComponent.products.push(myObject);
    }

  }).done(function() {
    //After API info is gathered we will initiate the distance checks
    initDistCheck();
  });



}

//vue component used to dynamically update screen info
var jobComponent = new Vue({
  el: '#app',
  data: {
    location: "Los Angeles",
    zipcode: "9001",
    products: [],
  },
  computed: {

  },


  methods: {
    //updates city and zip code in the vue component based on user input in dropdown for city/zipcode
    updateCityAndZipCode: function() {

      jobComponent.location = $("#cityInput").val();
      jobComponent.zipcode = $("#zipInput").val();
      reinitLocation(initDistCheck);

    }
  },

});


//reinitializes location, used when user inputs city/zipcode in dropdown
function reinitLocation(callback) {
  //inits google map's api used to calculate distance between user and job
  geocoder = new google.maps.Geocoder();

  var city = jobComponent.location;
  if (geocoder) {
    geocoder.geocode({
      'address': city
    }, function(results, status) {


      if (status == google.maps.GeocoderStatus.OK) {

        var location = results[0].geometry.location,
          latUser = location.lat(),
          longUser = location.lng();


        const j = jobComponent.products.length;

        for (let i = 0; i < j; i++) {


          var tempLat = jobComponent.products[i].lat;
          var tempLong = jobComponent.products[i].long;
          jobComponent.products[i].distance = distance(tempLat, tempLong, latUser, longUser).toFixed(1);

        }



        //if warning text was shown from previous failure it will slowly go away
        $("#warningText").hide("slow");
      } else {
        //if user didint input viable city name will send warning text
        $("#warningText").show();
      }


    });

  }

}

//function to calculate distance between 2 locations using latitudes and longitudes
function distance(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}
//method used by distance to convert from degree to radians
function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

//initiates the distance check
function initDistCheck() {
  $.when(getLocationData(getDistanceFromAPI)).done(function() {

  });
}

//gets location data and intakes a callback to get called after the async task is finished
function getLocationData(callback) {

  geocoder = new google.maps.Geocoder();

  var city = "Anaheim";
  if (geocoder) {
    const j = jobComponent.products.length;

    for (let i = 0; i < j; i++) {

      city = jobComponent.products[i].city;

      geocoder.geocode({
        'address': city
      }, function(results, status) {

        if (status == google.maps.GeocoderStatus.OK) {
          callback(results, i);
        }


      });
    }
  }

}

//gatheres distance from our API
function getDistanceFromAPI(results, id) {


  var distanceCalculated = 0;
  var location = results[0].geometry.location,
    lat = location.lat(),
    lng = location.lng();
  jobComponent.products[id].lat = lat;
  jobComponent.products[id].long = lng;
  distanceCalculated = distance(lat, lng, latUser, longUser);

  jobComponent.products[id].distance = distanceCalculated.toFixed(1);

  return distanceCalculated;
}
