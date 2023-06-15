fetch('/data')
        .then(response => response.json())
        .then(data => {
          var map;
          let dataArray = []; // Array to store CSV data
          let filteredMarkers = []; // Array to store filtered markers

          dataArray = data;  
          console.log(dataArray);
          console.log(data);

          function initMap() {

            // Default map
            const center = { lat: 37.0902, lng: -95.7129 }; // Center coordinates (US)

            map = new google.maps.Map(document.getElementById("map"), {
                zoom: 5,
                center: center,
            });

            // Input box for user to enter their address
            const inputText = document.createElement("input");
            inputText.id = "inputText"
            inputText.type = "text";
            inputText.placeholder = "Enter a location";

            const submitButton = document.createElement("input");
            submitButton.type = "button";
            submitButton.value = "Search";
            submitButton.classList.add("button", "button-primary");

            const clearButton = document.createElement("input");
            clearButton.type = "button";
            clearButton.value = "Clear";
            clearButton.classList.add("button", "button-secondary");

            const locationButton = document.createElement("input");
            locationButton.type = "button";
            locationButton.value = "Use Current Location";
            locationButton.classList.add("button", "button-secondary");


            map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputText);
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(submitButton);
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(clearButton);
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(locationButton);

            // Distance filter select element
            const distanceFilterSelect = document.createElement("select");
            distanceFilterSelect.id = "distance-filter-select";

            const distanceOptions = [
                { label: "Any distance", value: Infinity},
                { label: "1 mile", value: 1 },
                { label: "3 miles", value: 3 },
                { label: "5 miles", value: 5 },
            ];

            distanceOptions.forEach((option) => {
                const optionElement = document.createElement("option");
                optionElement.value = option.value;
                optionElement.textContent = option.label;
                distanceFilterSelect.appendChild(optionElement);
            });

            map.controls[google.maps.ControlPosition.TOP_LEFT].push(distanceFilterSelect);


            locationButton.addEventListener("click", () => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const currentLocation = {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude,
                    };
                        getAddress(currentLocation)
                    .then((address) => {
                        inputText.value = address;
                    })
                    .catch((error) => {
                        console.error(error);
                    });
                  },
                  (error) => {
                    console.error(error);
                  }
                );
              } else {
                console.error("Geolocation is not supported by this browser.");
              }
            });

            submitButton.addEventListener("click", () => {
                const address = inputText.value;
                if (address) { 
                geocodeAddress(address)
                    .then(async (location) => {
                    var origin_latlng = location;

                    // Create map options
                    const mapOptions = {
                        zoom: 13,
                        center: origin_latlng,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                    };

                    // Center the map to the input location
                    map.setOptions(mapOptions);

                    // Display origin location marker & infowindow
                    const marker_O = new google.maps.Marker({
                        map: map,
                        position: origin_latlng,
                        label: "O",
                    });

                    const infowindow_O = new google.maps.InfoWindow({
                        content: address,
                    });

                    marker_O.addListener("click", () => {
                        infowindow_O.open({
                        anchor: marker_O,
                        map: map,
                        });
                    });

                    // Created a boolean array to filter HCPs based on initial address (if available)
                    const initialAddress = inputText.value;

                    console.log('filter initial address:', initialAddress);

                    if (initialAddress) {
                        const booleanArray = await Promise.all(
                        dataArray.map(async (location) => {
                            const locationZipcode = location.ZIP_CODE;
                            try {
                            const result = await getZipcodeFromAddress(initialAddress);

                            return locationZipcode == result;
                            } catch (error) {
                            console.error(error);
                            return false; // or handle the error in an appropriate way
                            }
                        })
                        );
                        console.log(booleanArray);

                        // Filter HCPs array
                        const filteredArray = dataArray.filter((_, index) => Boolean(booleanArray[index]));
                        console.log('Filter HCPs array',filteredArray);

                        // Display HCPs on map
                        setMarkers(filteredArray, inputText)
                            .then((result) => {
                                distanceFilterSelect.addEventListener("change", () => {
                                    let selectedDistance = distanceFilterSelect.value;
                                    
                                    if (selectedDistance === 'Infinity') {
                                        selectedDistance = Infinity;
                                        
                                    } else {
                                        selectedDistance = parseInt(selectedDistance);
                                    };

                                    markers = result.markers;
                                    distances = result.distances;

                                    // console.log('selectedDistance',selectedDistance);

                                    filterMarkersByDistance(selectedDistance, markers, distances);
                                });
                                clearButton.addEventListener("click", function() {
                                    marker_O.setMap(null);
                                    clear(markers);
                                    inputText.value='';
                                });
                            })
                            .catch((error) => {
                                console.error(error);
                            });

                        
                        clearButton.addEventListener("click", function() {
                            marker_O.setMap(null);
                            inputText.value='';
                        });                        
                        
                        
                    }
                    })
                    .catch((error) => {
                    console.error(error);
                    });
                }
            });
          };

          function clear(markers) {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            markers = [];
          };

          function getAddress(latlng) {
            return new Promise((resolve, reject) => {
              const geocoder = new google.maps.Geocoder();
              geocoder.geocode({ location: latlng }, (results, status) => {
                if (status === "OK") {
                  const address = results[0].formatted_address;
                  resolve(address);
                } else {
                  reject("Geocode was not successful for the following reason: " + status);
                }
              });
            });
          };

          function geocodeAddress(address) {
            return new Promise((resolve, reject) => {
              const geocoder = new google.maps.Geocoder();
              geocoder.geocode({ address: address }, (results, status) => {
                if (status === "OK") {
                  const location = results[0].geometry.location;
                  resolve(location);
                } else {
                  reject("Geocode was not successful for the following reason: " + status);
                }
              });
            });
          };

          function calculateDistance(originAddress, destinationLatLng) {
            return new Promise((resolve, reject) => {
                const service = new google.maps.DistanceMatrixService();
                service.getDistanceMatrix(
                    {
                    origins: [originAddress],
                    destinations: [destinationLatLng],
                    travelMode: google.maps.TravelMode.DRIVING,
                    unitSystem: google.maps.UnitSystem.IMPERIAL
                    }, (response, status) => {
                        if (status === "OK") {
                            const distance = response.rows[0].elements[0].distance.value;
                            const distance_mile = (distance * 0.000621371192).toFixed(2)
      
                            resolve(distance_mile);
                        } else {
                            console.error("Error: " + status);
                        }
                    });
            })
          }

          function getZipcodeFromAddress(address) {
            return new Promise((resolve, reject) => {
              const geocoder = new google.maps.Geocoder();
              geocoder.geocode({ address: address }, (results, status) => {
                if (status === "OK") {
                  const addressComponents = results[0].address_components;
                  const zipcodeComponent = addressComponents.find(
                    (component) => component.types[0] === "postal_code"
                  );
                  const zipcode = zipcodeComponent ? zipcodeComponent.short_name : null;
                  if (zipcode) {
                    resolve(zipcode);
                  } else {
                    reject("Unable to retrieve the zipcode.");
                  }
                } else {
                  reject("Geocoder failed due to: " + status);
                }
              });
            });
          };

          function setMarkers(locations, inputText) {
              // Adds markers to the map.
            const shape = {
              coords: [1, 1, 1, 20, 18, 20, 18, 1],
              type: "poly",
            };

            const originAddress = inputText.value;

            const promises = [];
            filteredMarkers = [];
            markerDistance = [];

            for (let i = 0; i < locations.length; i++) {
              const location = locations[i];
              const pos = JSON.parse(location.COORDINATES);

              const marker = new google.maps.Marker({
                position: pos,
                map: map,
                shape: shape,
                title: location.NPI,
              });


              // Calculate and update the distance in the infowindow
              const destinationLatLng = new google.maps.LatLng(pos.lat, pos.lng);

   
              const distancePromise = calculateDistance(originAddress, destinationLatLng)
                .then((distance_mile) => {
                    markerDistance.push(distance_mile);
                    const infowindow = new google.maps.InfoWindow({
                    content: "<strong>HCP Name: </strong>" + capitalizeFirstLetter(location.FIRST_NAME) + " " + capitalizeFirstLetter(location.LAST_NAME) +
                        "<br>" + "<strong>Address: </strong>" + location.FULL_ADDRESS +
                        "<br>" + "<strong>Distance: </strong>" + distance_mile + ' miles',
                    });
                    marker.addListener("click", () => {
                    infowindow.open(map, marker);
                    });
                    filteredMarkers.push(marker);
                })
                .catch((error) => {
                    console.error(error);
                });

                promises.push(distancePromise);
            }   

                return Promise.all(promises)
                    .then(() => {
                    console.log('last', filteredMarkers, markerDistance);
                    return { markers: filteredMarkers, distances: markerDistance };
                    })
                    .catch((error) => {
                    console.error(error);
                    });
            }

          function filterMarkersByDistance(distance, markers, distances) {
            for (let i = 0; i < markers.length; i++) {
              const marker = markers[i];
              const markerDistance = distances[i];

              if (markerDistance <= distance) {
                marker.setMap(map);
              } else {
                marker.setMap(null);
              }
            //   console.log('marker distance',markerDistance);
            }
          };

          function capitalizeFirstLetter(str) {
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
          };

          initMap();
        
        })
        .catch(error => {
          console.error('Error:', error);
        });