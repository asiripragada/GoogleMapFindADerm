// @author: Violet(Yafan) Zeng

fetch('/data')
  .then(response => response.json())
  .then(data => {
    var map;
    let dataArray = []; // Array to store CSV data
    let markerArray = [];


    dataArray = data;  
    console.log(dataArray);

    function initMap() {

      // Default map
      // const center = { lat: 37.0902, lng: -95.7129 }; // Center coordinates (US)

      const center = { lat: 40.103844, lng: -75.382324 }; // Center to King of Prussia, PA

      map = new google.maps.Map(document.getElementById("map"), {
          zoom: 13,
          center: center,
          mapTypeControl: false,
          streetViewControl: false
      });

      // Input box for user to enter their address
      const inputText = document.createElement("input");
      inputText.id = "inputText";
      inputText.type = "text";
      inputText.placeholder = "Enter an Address";

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

      const searchOptions = document.createElement("div");
      searchOptions.id = "searchOptions";
      searchOptions.classList.add("btn-group", "btn-group-toggle");
      searchOptions.setAttribute("data-toggle", "buttons");

      const addressOptionButton = document.createElement("input");
      addressOptionButton.type = "button";
      addressOptionButton.value = "Address";
      addressOptionButton.classList.add("search-option-button","active");
      addressOptionButton.name = "searchOption";
      addressOptionButton.id = "addressOption";
      addressOptionButton.autocomplete = "off";

      const zipcodeOptionButton = document.createElement("input");
      zipcodeOptionButton.type = "button";
      zipcodeOptionButton.value = "Zipcode";
      zipcodeOptionButton.classList.add("search-option-button");
      zipcodeOptionButton.name = "searchOption";
      zipcodeOptionButton.id = "zipcodeOption";
      zipcodeOptionButton.autocomplete = "off";

      searchOptions.appendChild(addressOptionButton);
      searchOptions.appendChild(zipcodeOptionButton);
      
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchOptions);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputText);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(submitButton);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(clearButton);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(locationButton);

      // Set initial option
      let selectedOption = "address";

      // Add click event listeners to the labels
      addressOptionButton.addEventListener("click", () => {
        if (!addressOptionButton.classList.contains("active")) {
          addressOptionButton.classList.add("active");
          zipcodeOptionButton.classList.remove("active");
          selectedOption = "address";
          inputText.placeholder = "Enter an Address";
          locationButton.style.display = "block";
        }
      });
      
      zipcodeOptionButton.addEventListener("click", () => {
        if (!zipcodeOptionButton.classList.contains("active")) {
          zipcodeOptionButton.classList.add("active");
          addressOptionButton.classList.remove("active");
          selectedOption = "zipcode";
          inputText.placeholder = "Enter a Zipcode";
          locationButton.style.display = "none";
        }
      });
      
      
      const defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(40.082528, -75.407858),
        new google.maps.LatLng(40.108210, -75.356826));

      const options = {
        bounds: defaultBounds,
        componentRestrictions: { country: "us" },
        fields: ["formatted_address"],
        strictBounds: true
      };

      const autocomplete = new google.maps.places.Autocomplete(inputText, options);

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
                  addressSearch();
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
        
        if(addressOptionButton.classList.contains("active")) {
          autocomplete.getPlace();
          addressSearch();
        } else {
          zipcodeSearch();
        };
        
      });

                      
      clearButton.addEventListener("click", function() {
        clear();
        map.setCenter(center);
        inputText.value='';
      });  
    };

    function zipcodeSearch(){
      clear();
      const zipcode = inputText.value;
      if (zipcode) {
        geocodeAddress(zipcode)
          .then(async (geo_result) => {
            console.log('zipcode geocoding result',geo_result);
            let origin_latlng = geo_result[0].geometry.location;

            displayOrigin(origin_latlng,"Zipcode: "+zipcode);
            
            const addressComponents = geo_result[0].address_components;
            const zipcodeComponent = addressComponents.find(
              (component) => component.types[0] === "postal_code"
            );
            const initialZipcode = zipcodeComponent ? zipcodeComponent.short_name : null;

            console.log('initial zipcode:', initialZipcode)

            if (initialZipcode) {
              const booleanArray = await Promise.all(
                dataArray.map((hcp_location) => {
                    const hcpZipcode = hcp_location.ZIP_CODE;
                    try {
                      return hcpZipcode == initialZipcode;
                    } catch (error) {
                      console.error(error);
                      return false; // or handle the error in an appropriate way
                    }
                })
                );
              console.log('booleanArray',booleanArray);
              showHCP(booleanArray);
            };
          })
          .catch((error) => {
          console.error(error);
          });
        };
    };

    function addressSearch(){
      clear();
  
      const address = inputText.value;
  
      if (address) { 
      geocodeAddress(address)
          .then(async (geo_result) => {
            console.log(geo_result);
            let origin_latlng = geo_result[0].geometry.location;
    
            displayOrigin(origin_latlng, address);

            // Created a boolean array to filter HCPs based on initial address (if available)
            const initialAddress = inputText.value;
  
            console.log('initial address:', initialAddress);
  
            if (initialAddress) {
                const booleanArray = await Promise.all(
                dataArray.map((hcp_location) => {
                    const hcpZipcode = hcp_location.ZIP_CODE;
                    try {
                      const addressComponents = geo_result[0].address_components;
                      const zipcodeComponent = addressComponents.find(
                        (component) => component.types[0] === "postal_code"
                      );
                      const origin_zipcode = zipcodeComponent ? zipcodeComponent.short_name : null;
  
                      return hcpZipcode == origin_zipcode;
                    } catch (error) {
                      console.error(error);
                      return false; // or handle the error in an appropriate way
                    }
                })
                );
                console.log('booleanArray',booleanArray);
  
                showHCP(booleanArray);
          };
          })
          .catch((error) => {
          console.error(error);
          });
        };
    };

    function showHCP(booleanArray) {
      const sum = booleanArray.reduce((accumulator, currentValue) => accumulator + Number(currentValue), 0);
  
      if (sum !== 0) {
        // Filter HCPs array
        const filteredArray = dataArray.filter((_, index) => Boolean(booleanArray[index]));

        // Display HCPs on map
        HCPDistance(filteredArray, inputText)
            .then((result) => {
                distances = result.distance;
                latlngs = result.latlng;
                hcps = result.hcp;

                // Sort the combined array based on Distance
                const combined = latlngs.map((hcp_latlng, index) => ({ hcp_latlng, hcp: hcps[index], distance: distances[index]}));
                const sortedCombined = combined.sort((a, b) => {
                if (a.hcp_latlng.lat !== b.hcp_latlng.lat) {
                    return a.hcp_latlng.lat - b.hcp_latlng.lat;
                } else {
                    return a.hcp_latlng.lng - b.hcp_latlng.lng;
                }
                });

                // Initialize the result arrays
                let Group_HCP = [];
                let Group_latlng = []
                let Group_Distance = [];

                // Iterate over the sorted combined array and group HCPs based on Distance
                let currentlatlng = {lat:null, lng:null};
                let currentGroup = [];
                let currentDistance = [];

                sortedCombined.forEach(({ hcp_latlng, hcp, distance }) => {
                if (hcp_latlng.lat === currentlatlng.lat & hcp_latlng.lng === currentlatlng.lng) {
                    currentGroup.push(hcp);
                    currentDistance=distance;
                } else {
                    if (currentlatlng.lat !== null) {
                    Group_HCP.push(currentGroup);
                    Group_latlng.push(currentlatlng);
                    Group_Distance.push(currentDistance);
                    }
                    currentlatlng = hcp_latlng;
                    currentGroup = [hcp];
                    currentDistance = distance;
                }
                });

                // Add the last group to the result arrays
                Group_HCP.push(currentGroup);
                Group_latlng.push(currentlatlng);
                Group_Distance.push(currentDistance);
                
                Group_HCP_markers = []

                const shape = {
                coords: [1, 1, 1, 20, 18, 20, 18, 1],
                type: "poly",
                };

                for (let i = 0; i < Group_HCP.length; i++){
                group = Group_HCP[i]
                dis = Group_Distance[i]

                group_pos = JSON.parse(group[0].COORDINATES)

                let marker_hcp = new google.maps.Marker({
                    position: group_pos,
                    map: map,
                    shape: shape,
                    icon:"http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                });
                markerArray.push(marker_hcp);

                tooltips = '<strong>HCP</strong>' + "<br>"
                for (let j = 0; j < group.length; j++){
                    hcp = group[j]
                    tooltips += "<strong> Name: </strong>" + capitalizeFirstLetter(hcp.FIRST_NAME) + " " + capitalizeFirstLetter(hcp.LAST_NAME) +
                    "<strong> Address: </strong>" + hcp.ADDRESS_LINE_1 + ' , ' + hcp.ADDRESS_LINE_2  + "<br>"

                }
                tooltips += "<strong>Distance: </strong>" + dis + "miles"

                let infowindow_hcp = new google.maps.InfoWindow({content:tooltips});
                
                let clicked_hcp = false;

                marker_hcp.addListener("mouseover", () => {
                    if (!clicked_hcp){
                    infowindow_hcp.open(map, marker_hcp);
                    marker_hcp.setIcon({url:"http://maps.google.com/mapfiles/ms/icons/red-dot.png" ,scaledSize: new google.maps.Size(50, 50)});
                    }
                });                   
                marker_hcp.addListener("mouseout", () => {
                    if (!clicked_hcp){
                    infowindow_hcp.close(map, marker_hcp);
                    marker_hcp.setIcon({url:"http://maps.google.com/mapfiles/ms/icons/red-dot.png"});
                    }
                });
                marker_hcp.addListener("click", () => {
                    clicked_hcp = true;
                    infowindow_hcp.open({map, marker_hcp});
                    marker_hcp.setIcon({url:"http://maps.google.com/mapfiles/ms/icons/red-dot.png" ,scaledSize: new google.maps.Size(50, 50)});
                });
                infowindow_hcp.addListener("closeclick",() =>{
                    clicked_hcp = false;
                    marker_hcp.setIcon({url:"http://maps.google.com/mapfiles/ms/icons/red-dot.png"});
                });

                
                Group_HCP_markers.push(marker_hcp);
                }

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

                distanceFilterSelect.addEventListener("change", () => {
                    let selectedDistance = distanceFilterSelect.value;
                    
                    if (selectedDistance === 'Infinity') {
                        selectedDistance = Infinity;
                        
                    } else {
                        selectedDistance = parseInt(selectedDistance);
                    };
                    
                    filterMarkersByDistance(selectedDistance, Group_HCP_markers, Group_Distance);
                });

            })
            .catch((error) => {
                console.error(error);
            });
      } else {
        alert("There's no HCP near your entered address");
      };                                
    };


    function displayOrigin(origin_latlng, address){

      map.setCenter(origin_latlng)
      // Display origin location marker & infowindow
      const marker_O = new google.maps.Marker({
        map: map,
        position: origin_latlng,
        icon:"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
      });

      markerArray.push(marker_O);

      const infowindow_O = new google.maps.InfoWindow({
          content: address,
      });

      marker_O.addListener("mouseover", () => {
        infowindow_O.open(map, marker_O);
        marker_O.setIcon({url:"http://maps.google.com/mapfiles/ms/icons/blue-dot.png" ,scaledSize: new google.maps.Size(50, 50)});
      }); 
      marker_O.addListener("mouseout", () => {
        infowindow_O.close(map, marker_O);
        marker_O.setIcon({url:"http://maps.google.com/mapfiles/ms/icons/blue-dot.png" });
      }); 
    }

    function clear() {

      for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
      }
      markerArray = [];
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
            const geo_result = results;
            console.log(geo_result);
            resolve(geo_result);
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

    

    function HCPDistance(locations, inputText) {

      const originAddress = inputText.value;

      const promises = [];
      markerDistance = [];
      markerLatLng = [];
      markerHCP = []

      for (let i = 0; i < locations.length; i++) {
        const location = locations[i];
        const pos = JSON.parse(location.COORDINATES);

        // Calculate and update the distance in the infowindow
        const destinationLatLng = new google.maps.LatLng(pos.lat, pos.lng);
        

        const distancePromise = calculateDistance(originAddress, destinationLatLng)
          .then((distance_mile) => {
              markerDistance.push(distance_mile);
              markerLatLng.push(pos);
              markerHCP.push(location);
          })
          .catch((error) => {
              console.error(error);
          });

          promises.push(distancePromise);
      }   

          return Promise.all(promises)
              .then(() => {
              console.log('HCP Distance result', markerLatLng, markerDistance);
              return {hcp:markerHCP, distance: markerDistance, latlng: markerLatLng};
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
        console.log('marker distance',markerDistance, 'set distance', distance);
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

  marker_hcp.addListener("mouseover", () => {
    if (!clicked_panel && !clicked_hcp) {
      infowindow_hcp.open(map, marker_hcp);
      marker_hcp.setIcon({url:"http://maps.google.com/mapfiles/ms/icons/red-dot.png" ,scaledSize: new google.maps.Size(50, 50)});
      HCPGroupElement.classList.add("active");
      HCPContentElement.scrollTop = elementTop-50;
      }
  });                   
  marker_hcp.addListener("mouseout", () => {
    if (!clicked_panel && !clicked_hcp) {
      infowindow_hcp.close(map, marker_hcp);
      marker_hcp.setIcon({url:"http://maps.google.com/mapfiles/ms/icons/red-dot.png"});
      HCPGroupElement.classList.remove("active");
      }
  });
  marker_hcp.addListener("click", () => {
      clicked_hcp = true;
      infowindow_hcp.open(map, marker_hcp);
      marker_hcp.setIcon({url:"http://maps.google.com/mapfiles/ms/icons/red-dot.png" ,scaledSize: new google.maps.Size(50, 50)});
      HCPGroupElement.classList.add("active");
      map.setOptions({center:marker_hcp.getPosition(),zoom:15});
      // Scroll the left panel to the related HCPGroupElement
      HCPContentElement.scrollTop = elementTop-50;
    });
  infowindow_hcp.addListener("closeclick",() =>{
      clicked_hcp = false;
      marker_hcp.setIcon({url:"http://maps.google.com/mapfiles/ms/icons/red-dot.png"});
      HCPGroupElement.classList.remove("active");
      map.setOptions({center:origin_center,zoom:13});
  });
  
  Group_HCP_markers.push(marker_hcp);

  HCPGroupElement.addEventListener("mouseover", () => {
    if (!clicked_panel && !clicked_hcp) {
      infowindow_hcp.open(map, marker_hcp);
      marker_hcp.setIcon({url:"http://maps.google.com/mapfiles/ms/icons/red-dot.png" ,scaledSize: new google.maps.Size(50, 50)});
      HCPGroupElement.classList.add("active");
      }
  });                   
  HCPGroupElement.addEventListener("mouseout", () => {
    if (!clicked_panel && !clicked_hcp) {
      infowindow_hcp.close(map, marker_hcp);
      marker_hcp.setIcon({url:"http://maps.google.com/mapfiles/ms/icons/red-dot.png"});
      HCPGroupElement.classList.remove("active");
      }
  });
  HCPGroupElement.addEventListener("click", () => {
    if (clicked_panel) {
      infowindow_hcp.close();
      marker_hcp.setIcon({
        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
      });
      HCPGroupElement.classList.remove("active");
      map.setOptions({ center: origin_center, zoom: 13 });
      clicked_panel = false;
    } else {
      clicked_panel = true;
      infowindow_hcp.open(map, marker_hcp);
      marker_hcp.setIcon({
        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        scaledSize: new google.maps.Size(50, 50)
      });
      HCPGroupElement.classList.add("active");
      map.setOptions({ center: marker_hcp.getPosition(), zoom: 15 });
    }
  });                