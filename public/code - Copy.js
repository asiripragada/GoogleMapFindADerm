// @author: Violet(Yafan) Zeng

fetch('/data')
  .then(response => response.json())
  .then(data => {
    var map;
    let dataArray = []; // Array to store CSV data
    let markerArray = [];


    dataArray = data;  
    console.log(dataArray);
    console.log(data);

    function initMap() {

      // Default map
      // const center = { lat: 37.0902, lng: -95.7129 }; // Center coordinates (US)

      const center = { lat: 40.103844, lng: -75.382324 }; // Center to King of Prussia, PA

      map = new google.maps.Map(document.getElementById("map"), {
          zoom: 13,
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
        clear();

        autocomplete.getPlace();

        const address = inputText.value 

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
            markerArray.push(marker_O);

            const infowindow_O = new google.maps.InfoWindow({
                content: address,
            });

            // let clicked_O = false;
            marker_O.addListener("mouseover", () => {
              infowindow_O.open(map, marker_O);
            }); 
            marker_O.addListener("mouseout", () => {
              infowindow_O.close(map, marker_O);
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

                // Display HCPs on map
                HCPDipstance(filteredArray, inputText)
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
                          shape: shape
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
                          }
                        });                   
                        marker_hcp.addListener("mouseout", () => {
                          if (!clicked_hcp){
                            infowindow_hcp.close(map, marker_hcp);
                          }
                        });
                        marker_hcp.addListener("click", () => {
                          clicked_hcp = true;
                          infowindow_hcp.open({map, marker_hcp});
                        });
                        infowindow_hcp.addListener("closeclick",() =>{
                          clicked_hcp = false;
                        });
      
                        
                        Group_HCP_markers.push(marker_hcp);
                      }


                      distanceFilterSelect.addEventListener("change", () => {
                          let selectedDistance = distanceFilterSelect.value;
                          
                          if (selectedDistance === 'Infinity') {
                              selectedDistance = Infinity;
                              
                          } else {
                              selectedDistance = parseInt(selectedDistance);
                          };

                          
                          filterMarkersByDistance(selectedDistance, Group_HCP_markers, Group_Distance);
                      });
                      clearButton.addEventListener("click", function() {
                        // marker_O.setMap(null);
                        // clear(Group_HCP_markers);
                        // inputText.value='';
                        clear()
                        map.setCenter(center);
                      });
                    })
                    .catch((error) => {
                        console.error(error);
                    });

                
                clearButton.addEventListener("click", function() {
                    marker_O.setMap(null);
                    inputText.value='';
                    map.setCenter(center);
                });                        
                
                
            }
            })
            .catch((error) => {
            console.error(error);
            });
          }
      });
    };

    function clear() {
      for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
      }
      markerArray = [];
    };

    function clearMap() {
      map.setZoom(13);
      map.setCenter({ lat: 40.103844, lng: -75.382324 });
      map.data.forEach(function (feature) {
        map.data.remove(feature);
      });
    }


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

   

    function HCPDipstance(locations, inputText) {
        // Adds markers to the map.
      const shape = {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: "poly",
      };

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

    let leftPanel = document.getElementById('left-panel');

    const HCPHeaderElement = document.createElement("div");
    HCPHeaderElement.innerHTML = '<strong> HCP Details </strong>';
    HCPHeaderElement.classList.add("HCP-header");
    leftPanel.appendChild(HCPHeaderElement);
  
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

      // Create a new element for the tooltip text
      const HCPGroupElement = document.createElement("div");
      HCPGroupElement.classList.add("HCP-group-div");
      let HCPGroupElement_Text = '';

      for (let j = 0; j < group.length; j++){

        hcp = group[j]
        tooltips += "<strong> Name: </strong>" + capitalizeFirstLetter(hcp.FIRST_NAME) + " " + capitalizeFirstLetter(hcp.LAST_NAME) +
        "<strong> Address: </strong>" + hcp.ADDRESS_LINE_1 + ' , ' + hcp.ADDRESS_LINE_2  + "<br>"

        const HCPElement = document.createElement("div");
        let HCPElement_Text = "<br>"+ "<strong> Name: </strong>" + capitalizeFirstLetter(hcp.FIRST_NAME) + " " + capitalizeFirstLetter(hcp.LAST_NAME) +"<br>"+
        "<strong> Specialty: </strong>" + 'Temp'+ "<br>" + 
        "<strong> Phone Number: </strong>" + '(xxx)-xxx-xxxx'+ "<br>" + 
        "<strong> Address: </strong>" + hcp.ADDRESS_LINE_1 + ' , ' + hcp.ADDRESS_LINE_2  + "<br>"+
        "<strong> City: </strong>" + hcp.CITY_NAME + "<br>"+
        "<strong> Zipcode: </strong>" + hcp.ZIP_CODE + "<br>"
        HCPElement.innerHTML = HCPElement_Text;
        HCPGroupElement.appendChild(HCPElement);
      }
      const HCPGroupTextElement = document.createElement("div");
      HCPGroupElement_Text +="<br>" + "<strong>Distance: </strong>" + dis + "miles" + "<br>" + "<br>"
      HCPGroupTextElement.innerHTML = HCPGroupElement_Text
      HCPGroupElement.appendChild(HCPGroupTextElement);
      leftPanel.appendChild(HCPGroupElement);

      tooltips += "<strong>Distance: </strong>" + dis + "miles"
      let infowindow_hcp = new google.maps.InfoWindow({content:tooltips});
      

      let clicked_hcp = false;

      marker_hcp.addListener("mouseover", () => {
          if (!clicked_hcp){
          infowindow_hcp.open(map, marker_hcp);
          marker_hcp.setIcon({url:"http://maps.google.com/mapfiles/ms/icons/red-dot.png" ,scaledSize: new google.maps.Size(50, 50)});
          HCPGroupElement.classList.add("active");
          }
      });                   
      marker_hcp.addListener("mouseout", () => {
          if (!clicked_hcp){
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
          const elementTop = HCPGroupElement.offsetTop;
          leftPanel.scrollTop = elementTop;
        });
      infowindow_hcp.addListener("closeclick",() =>{
          clicked_hcp = false;
          marker_hcp.setIcon({url:"http://maps.google.com/mapfiles/ms/icons/red-dot.png"});
          HCPGroupElement.classList.remove("active");
          map.setOptions({center:origin_center,zoom:13});
      });
      
      Group_HCP_markers.push(marker_hcp);

      let clicked_panel = false;

      HCPGroupElement.addEventListener("mouseover", () => {
          if (!clicked_panel){
          infowindow_hcp.open(map, marker_hcp);
          marker_hcp.setIcon({url:"http://maps.google.com/mapfiles/ms/icons/red-dot.png" ,scaledSize: new google.maps.Size(50, 50)});
          HCPGroupElement.classList.add("active");
          }
      });                   
      HCPGroupElement.addEventListener("mouseout", () => {
          if (!clicked_panel){
          infowindow_hcp.close(map, marker_hcp);
          marker_hcp.setIcon({url:"http://maps.google.com/mapfiles/ms/icons/red-dot.png"});
          HCPGroupElement.classList.remove("active");
          }
      });
      HCPGroupElement.addEventListener("click", () => {
        clicked_panel = true;
          infowindow_hcp.open(map, marker_hcp);
          marker_hcp.setIcon({url:"http://maps.google.com/mapfiles/ms/icons/red-dot.png" ,scaledSize: new google.maps.Size(50, 50)});
          HCPGroupElement.classList.add("active");
          map.setOptions({center:marker_hcp.getPosition(),zoom:15});
        });
      HCPGroupElement.addEventListener("closeclick",() =>{
        clicked_panel = false;
          marker_hcp.setIcon({url:"http://maps.google.com/mapfiles/ms/icons/red-dot.png"});
          HCPGroupElement.classList.remove("active");
          map.setOptions({center:origin_center,zoom:13});
      });                  
      Group_HCP_details.push(HCPGroupElement);
    }