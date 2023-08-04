// JavaScript code to toggle left panel display
var container = document.querySelector('.container');
var leftPanel = document.getElementById('left-panel');

function onLeftPanel() {
  leftPanel.style.display = leftPanel.style.display === 'none' ? 'block' : 'none';
  container.classList.toggle('left-panel-hidden');
  if (!container.classList.contains("left-panel-hidden")) {
    container.classList.add("left-panel-hidden");
    locationButton.style.display = "block";
  }
}
function offLeftPanel() {
  if (container.classList.contains("left-panel-hidden")) {
    container.classList.add("left-panel-hidden");
    locationButton.style.display = "none";
  }
}

// Example usage
toggleLeftPanel(); // Hides the left panel
toggleLeftPanel(); // Shows the left panel




function runsearch(){
    clear();

    const address = inputText.value 

    if (address) { 
    geocodeAddress(address)
        .then(async (geo_result) => {
          console.log(geo_result);
          const location = geo_result[0].geometry.location;;
          console.log(location);

          // Created a boolean array to filter HCPs based on initial address (if available)
          const initialAddress = inputText.value;

          console.log('filter initial address:', initialAddress);

          if (initialAddress) {
              
              const booleanArray = [true, false, false, false, false, true, true, true, false, true, true];
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
                          shape: shape
                        });
                        markerArray.push(marker_hcp);

                        
                        Group_HCP_markers.push(marker_hcp);
                      }

                    })
                    .catch((error) => {
                        console.error(error);
                    });
              } else {
                alert("There's no HCP near your entered address");
              }; 
        console.log(Group_Distance);                               
        };
        })
        .catch((error) => {
        console.error(error);
        });
      };
  };

  function runsearch(){
    clear();

    const address = inputText.value 

    if (address) { 
    geocodeAddress(address)
        .then(async (geo_result) => {
          console.log(geo_result);
          const location = geo_result[0].geometry.location;;
          console.log(location);

          var origin_latlng = location;

          // Center the map to the input location
          map.setCenter(origin_latlng);

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

          // Created a boolean array to filter HCPs based on initial address (if available)
          const initialAddress = inputText.value;

          console.log('filter initial address:', initialAddress);

          if (initialAddress) {
              const booleanArray = await Promise.all(
              dataArray.map((hcp_location) => {
                  const locationZipcode = hcp_location.ZIP_CODE;
                  try {
                    const addressComponents = geo_result[0].address_components;
                    const zipcodeComponent = addressComponents.find(
                      (component) => component.types[0] === "postal_code"
                    );
                    const hcp_zipcode = zipcodeComponent ? zipcodeComponent.short_name : null;

                    return locationZipcode == hcp_zipcode;
                  } catch (error) {
                    console.error(error);
                    return false; // or handle the error in an appropriate way
                  }
              })
              );
              console.log(booleanArray);

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
        })
        .catch((error) => {
        console.error(error);
        });
      };
  };