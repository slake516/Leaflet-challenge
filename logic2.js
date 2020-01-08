// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log(data.features);
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define two function we want to run once for each feature in the features array
  // Creates markers for each earthquake. Github reference: OlgaTaranukha
  function pointToLayer(feature, latlng) {
    //  Style for each feature 
    return L.circleMarker(latlng, {
      fillOpacity: 0.5,
      opacity: 1,
      weight: 1.5,
      color: getColor(feature.properties.mag),
      fillColor: getColor(feature.properties.mag),
      radius:  markerSize(feature.properties.mag)
    });
  }
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    
      
    // Giving each feature a pop-up with information about that specific feature   
    layer.bindPopup("<h3>Location:" + feature.properties.place +
        "</h3><hr><p>Date/Time" + new Date(feature.properties.time) + "<br>" +
        "Magnitude: " + feature.properties.mag + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  // Define darkmap layers
  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
        40.75, -111.87  //37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Create a legend to display information about our map
  var legend = L.control({
    position: 'bottomright'
  });
  
  // When the layer control is added, insert a div with the class of "legend"
  legend.onAdd = function () {
      var div = L.DomUtil.create('div', 'legend'),
        grades = [0,1,2,3,4,5],
        labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
  
      // Loop  through the density intervals and generate labels
      for (var i = 0; i < grades.length; i++)
      {
        div.innerHTML +=
          '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
      console.log('div' + div);
      return div;
  };   

  legend.addTo(myMap);  
}

// Get size of markers
function markerSize(magnitude) {
    return magnitude * 5;
}

// Get color based on earthquake magnitude
function getColor(grade) {
  var color;

    if (grade > 5) {
      color = "red" ; 
    }
    else if (grade > 4) {
      color = "yellow";
    }
    else if (grade > 3) {
      color = "orange";
    }
    else if (grade > 2) {
      color = "blue";
    }
    else if (grade > 1) {
      color = "purple";
    }
    else {
      color = "lt green";
    }

  return color;
} 