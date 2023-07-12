// @author: Violet(Yafan) Zeng

fetch('/data')
  .then(response => response.json())
  .then(data => {
    let map;
    let dataArray = []; // Array to store CSV data
    let markerArray = [];


    dataArray = data;  
    console.log(dataArray);

    // // Create a Set to store unique values
    // const nameValues = new Set();
    // // Get the values from data FULL_NAME
    // data.forEach(item => {
    //   nameValues.add(item.FULL_NAME);
    // });

    // // Convert Set to array and sort alphabetically
    // const sortedNameArray = Array.from(nameValues).sort();

    // JavaScript code to toggle left panel display
    let mapContainer = document.querySelector('.map-container');
    let leftPanel = document.getElementById('left-panel');

    function onLeftPanel() {
      mapContainer.classList.remove("left-panel-hidden");
      leftPanel.style.display = "block";
      leftPanel.innerHTML = "";
    }

    function offLeftPanel() {
      mapContainer.classList.add("left-panel-hidden");
      leftPanel.style.display = "none";
      leftPanel.innerHTML = "";
    }

    function initMap() {

      
      // Default map
      const center = { lat: 37.0902, lng: -95.7129 }; // Center coordinates (US)

      // const center = { lat: 40.103844, lng: -75.382324 }; // Center to King of Prussia, PA

      map = new google.maps.Map(document.getElementById("map"), {
          zoom: 4,
          center: center,
          // mapTypeControl: ,
          streetViewControl: false
      });

      // Hide the loading sign
      document.getElementById("loading-sign").style.display = "none";

      // Input box for user to enter their address
      const inputText = document.createElement("input");
      inputText.id = "inputText";
      inputText.type = "text";
      inputText.placeholder = "Enter a zipcode";

      const submitButton = document.createElement("input");
      submitButton.type = "button";
      submitButton.value = "Search";
      submitButton.classList.add("button", "button-primary");

      const clearButton = document.createElement("input");
      clearButton.type = "button";
      clearButton.value = "Clear";
      clearButton.classList.add("button", "button-secondary");

      const searchOptions = document.createElement("div");
      searchOptions.id = "searchOptions";
      searchOptions.classList.add("btn-group", "btn-group-toggle");
      searchOptions.setAttribute("data-toggle", "buttons");

      const zipcodeOptionButton = document.createElement("input");
      zipcodeOptionButton.type = "button";
      zipcodeOptionButton.value = "Zipcode";
      zipcodeOptionButton.classList.add("search-option-button","active");
      zipcodeOptionButton.name = "searchOption";
      zipcodeOptionButton.id = "zipcodeOption";
      zipcodeOptionButton.autocomplete = "off";

      const addressOptionButton = document.createElement("input");
      addressOptionButton.type = "button";
      addressOptionButton.value = "Current Address";
      addressOptionButton.classList.add("search-option-button");
      addressOptionButton.name = "searchOption";
      addressOptionButton.id = "addressOption";
      addressOptionButton.autocomplete = "off";

      const cityOptionButton = document.createElement("input");
      cityOptionButton.type = "button";
      cityOptionButton.value = "City + HCP Name";
      cityOptionButton.classList.add("search-option-button");
      cityOptionButton.name = "searchOption";
      cityOptionButton.id = "cityOption";
      cityOptionButton.autocomplete = "off";

      searchOptions.appendChild(zipcodeOptionButton);
      searchOptions.appendChild(addressOptionButton);
      searchOptions.appendChild(cityOptionButton);

      // // HCP Name Dropdown
      // const nameSelect = document.createElement("select");
      // nameSelect.id = "name-select";

      // sortedNameArray.forEach(value => {
      //   const nameOption = document.createElement("option");
      //   nameOption.value = value;
      //   nameOption.textContent = value;
      //   nameSelect.appendChild(nameOption);
      // });

      // HCP Name Input
      const nameInput = document.createElement("input");
      nameInput.id = "nameInputText";
      nameInput.type = "text";
      nameInput.placeholder = "Enter a hcp name";

      // Distance filter select element
      const distanceFilterSelect = document.createElement("select");
      distanceFilterSelect.id = "distance-filter-select";

      const distanceOptions = [
          { label: "Any distance", value: Infinity},
          { label: "5 miles", value: 5 },
          { label: "10 miles", value: 10 },
          { label: "20 miles", value: 20 },
          { label: "50 miles", value: 50 },
          { label: "100 miles", value: 100 }
      ];

      distanceOptions.forEach((option) => {
          const optionElement = document.createElement("option");
          optionElement.value = option.value;
          optionElement.textContent = option.label;
          distanceFilterSelect.appendChild(optionElement);
      });

      const controlPanel = document.getElementById("control-panel");
      const searchOptionPanel = document.getElementById("search-option-panel");
      searchOptionPanel.appendChild(searchOptions);

      const inputPanel = document.getElementById("input-panel");
      textInputTitle = document.createElement("p");
      textInputTitle.innerHTML="Please fill in the following fields:";
      inputPanel.appendChild(textInputTitle);
      inputPanel.appendChild(inputText);
      inputPanel.appendChild(nameInput);
      inputPanel.appendChild(distanceFilterSelect);

      const searchClearPanel = document.getElementById("search-clear-panel");
      searchClearPanel.appendChild(submitButton);
      searchClearPanel.appendChild(clearButton);
      
      // set up auto complete
      const address_options = {
        // bounds: defaultBounds,
        componentRestrictions: { country: "us" },
        strictBounds: true,
        types:['postal_code']
      };

      const autocomplete = new google.maps.places.Autocomplete(inputText, address_options);

      // Set initial option
      let selectedOption = "zipcode";

      zipcodeOptionButton.addEventListener("click", () => {
        if (!zipcodeOptionButton.classList.contains("active")) {
          clear();
          distanceFilterSelect.value = Infinity;
          inputText.value="";
          inputText.style.display='block';
          nameInput.style.display='none';
          zipcodeOptionButton.classList.add("active");
          addressOptionButton.classList.remove("active");
          cityOptionButton.classList.remove("active");
          selectedOption = "zipcode";
          inputText.placeholder = "Enter a Zipcode";
          autocomplete.setTypes(['postal_code']);
          autocomplete.getPlace();
        }
      });

      addressOptionButton.addEventListener("click", () => {
        if (!addressOptionButton.classList.contains("active")) {
          clear();
          distanceFilterSelect.value = Infinity;
          inputText.value="";
          inputText.style.display='none';
          nameInput.style.display='none';
          addressOptionButton.classList.add("active");
          zipcodeOptionButton.classList.remove("active");
          cityOptionButton.classList.remove("active");
          selectedOption = "address";
          // locationButton.style.display = "block";
          // inputText.placeholder = "Enter an Address";
          // autocomplete.setTypes(['street_address']);
          // autocomplete.getPlace();
        }
      });
      
      cityOptionButton.addEventListener("click", () => {
        if (!cityOptionButton.classList.contains("active")) {
          clear();
          distanceFilterSelect.value = Infinity;
          inputText.value="";
          inputText.style.display='block';
          nameInput.style.display='block';
          cityOptionButton.classList.add("active");
          addressOptionButton.classList.remove("active");
          zipcodeOptionButton.classList.remove("active");
          selectedOption = "city";
          inputText.placeholder = "Enter a city";
          autocomplete.setTypes(['locality']);
          autocomplete.getPlace();
        }
      });

      submitButton.addEventListener("click", () => {        
        if(zipcodeOptionButton.classList.contains("active")) {
          zipcodeSearch();          
        } else if (addressOptionButton.classList.contains("active")){
          currentAddressSearch();
        } else {
          citySearch();
        };        
      });

                      
      clearButton.addEventListener("click", function() {
        clear();
        map.setCenter(center);
        inputText.value='';
      });  

      function zipcodeSearch(){
        clear();
        
        const zipcode = extractZipCode(inputText.value);
        const selectedDistance = distanceFilterSelect.value;
        console.log(selectedDistance);

        if (zipcode) {
          geocodeAddress(zipcode)
            .then(async (geo_result) => {
              console.log('zipcode geocoding result',geo_result);
              console.log('input zipcode', zipcode);
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
                showHCP(booleanArray,selectedDistance);
              };
            })
            .catch((error) => {
            console.error(error);
            });
          };
      };

      function currentAddressSearch(){
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
      };
  
      function addressSearch(){
        clear();
    
        const address = inputText.value;
        const selectedDistance = distanceFilterSelect.value;
    
        if (address) { 
        geocodeAddress(address)
            .then(async (geo_result) => {
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
    
                  showHCP(booleanArray,selectedDistance);
            };
            })
            .catch((error) => {
            console.error(error);
            });
          };
      };

      function citySearch() {
        clear();
        const city = extractCity(inputText.value);
        console.log("input city:", city);
        const name = nameInput.value.toUpperCase();
        const selectedDistance = distanceFilterSelect.value;

        if (city) {
          geocodeAddress(city)
            .then(async (geo_result) => {
              console.log('city geocoding result',geo_result);
              console.log('input zipcode', city);
              let origin_latlng = geo_result[0].geometry.location;
  
              map.setOptions({center:origin_latlng,zoom:11});
  
              if (city) {
                const booleanArray = await Promise.all(
                  dataArray.map((hcp_location) => {
                    const hcpCity = hcp_location.CITY_NAME;
                    const hcpName = hcp_location.FULL_NAME;
                    try {
                      return hcpCity == city && hcpName.includes(name);
                    } catch (error) {
                      return false;
                    }
                  })
                  );
                console.log('booleanArray',booleanArray);
                showHCP(booleanArray,selectedDistance);
              };
            })
            .catch((error) => {
            console.error(error);
            });
          };
        
      }
  
      function showHCP(booleanArray,selectedDistance) {
        const sum = booleanArray.reduce((accumulator, currentValue) => accumulator + Number(currentValue), 0);
    
        if (sum !== 0) {
          // Filter HCPs array
          const filteredArray = dataArray.filter((_, index) => Boolean(booleanArray[index]));
  
          // Display HCPs on map
          HCPDistance(filteredArray, inputText)
              .then((result) => {
                  
                let distances = result.distance;
                let latlngs = result.latlng;
                let hcps = result.hcp;
                

                let booldistance = [];
                distances.forEach((dis) => {
                  if (parseFloat(dis) <= parseFloat(selectedDistance)) {
                    
                    console.log('distance comparison:',dis, typeof dis, selectedDistance, typeof selectedDistance);
                    booldistance.push(true);
                  } else {
                    booldistance.push(false);
                  }
                });

                console.log(booldistance);

                let final_distances =  distances.filter((_, index) => Boolean(booldistance[index]));
                let final_latlngs = latlngs.filter((_, index) => Boolean(booldistance[index]));
                let final_hcps = hcps.filter((_, index) => Boolean(booldistance[index]));
                
                console.log(final_distances);
  
                  // Sort the combined array based on Distance
                  const combined = final_latlngs.map((hcp_latlng, index) => ({ hcp_latlng, hcp: final_hcps[index], distance: final_distances[index]}));
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
                  
                  Group_HCP_markers = [];
                  Group_HCP_details = [];
  
                  const shape = {
                  coords: [1, 1, 1, 8, 6, 8, 6, 1],
                  type: "poly",
                  };
  
                  onLeftPanel();
                  origin_center = map.getCenter();
                  
                  const HCPHeaderElement = document.createElement("div");
                  HCPHeaderElement.innerHTML = '<strong> HCP Details </strong>';
                  HCPHeaderElement.classList.add("HCP-header");
                  leftPanel.appendChild(HCPHeaderElement);

                  const HCPContentElement = document.createElement("div");
                  HCPContentElement.id = "leftPanelContent";
                  HCPContentElement.classList.add("HCP-content");
                  
                
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

                    if (selectedOption == 'address') {
                      // Encode the addresses for URL compatibility
                      let encodedOrigin = encodeURIComponent(inputText.value);
                      let encodedDestination = encodeURIComponent(hcp.FULL_ADDRESS);
                      // Create the Google Maps URL with the encoded addresses
                      let googleMapsURL = `https://www.google.com/maps/dir/${encodedOrigin}/${encodedDestination}`;


                      const HCPDirElement = document.createElement("a");
                      HCPDirElement.textContent  = "Get Directions";
                      HCPDirElement.href = googleMapsURL;
                      HCPDirElement.target = "_blank"; // Open in a new tab

                      HCPGroupElement.appendChild(HCPDirElement);
                      HCPGroupElement.appendChild(document.createElement("br")); // Add a <br> element
                      HCPGroupElement.appendChild(document.createElement("br")); // Add a <br> element
                    }

                    HCPContentElement.appendChild(HCPGroupElement);
                    leftPanel.appendChild(HCPContentElement);
  
                    tooltips += "<strong>Distance: </strong>" + dis + "miles"
                    let infowindow_hcp = new google.maps.InfoWindow({content:tooltips});
                    
                    let clicked = false;
                    
                    const elementTop = HCPGroupElement.offsetTop;

                    marker_hcp.addListener("mouseover", () => {
                      if (!clicked) {
                        infowindow_hcp.open(map, marker_hcp);
                        marker_hcp.setIcon({ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", scaledSize: new google.maps.Size(50, 50) });
                        HCPGroupElement.classList.add("active");
                        HCPContentElement.scrollTop = elementTop-50;
                      }
                    });
                    
                    marker_hcp.addListener("mouseout", () => {
                      if (!clicked) {
                        infowindow_hcp.close();
                        marker_hcp.setIcon({ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" });
                        HCPGroupElement.classList.remove("active");
                      }
                    });
                    
                    marker_hcp.addListener("click", () => {
                      if (clicked) {
                        clicked = false;
                        infowindow_hcp.close();
                        marker_hcp.setIcon({ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" });
                        HCPGroupElement.classList.remove("active");
                        map.setOptions({ center: origin_center, zoom: 13 });
                        HCPContentElement.scrollTop = elementTop-50;
                      } else {
                        clicked = true;
                        infowindow_hcp.open(map, marker_hcp);
                        marker_hcp.setIcon({ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", scaledSize: new google.maps.Size(50, 50) });
                        HCPGroupElement.classList.add("active");
                        map.setOptions({ center: marker_hcp.getPosition(), zoom: 15 });
                      }
                    });
                    
                    infowindow_hcp.addListener("closeclick", () => {
                      clicked = false;
                      marker_hcp.setIcon({ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" });
                      HCPGroupElement.classList.remove("active");
                      map.setOptions({ center: origin_center, zoom: 13 });
                    });
                    
                    Group_HCP_markers.push(marker_hcp);
                    
                    HCPGroupElement.addEventListener("mouseover", () => {
                      if (!clicked) {
                        infowindow_hcp.open(map, marker_hcp);
                        marker_hcp.setIcon({ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", scaledSize: new google.maps.Size(50, 50) });
                        HCPGroupElement.classList.add("active");
                      }
                    });
                    
                    HCPGroupElement.addEventListener("mouseout", () => {
                      if (!clicked) {
                        infowindow_hcp.close();
                        marker_hcp.setIcon({ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" });
                        HCPGroupElement.classList.remove("active");
                      }
                    });
                    
                    HCPGroupElement.addEventListener("click", () => {
                      if (clicked) {
                        clicked = false;
                        infowindow_hcp.close();
                        marker_hcp.setIcon({ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" });
                        HCPGroupElement.classList.remove("active");
                        map.setOptions({ center: origin_center, zoom: 13 });
                      } else {
                        clicked = true;
                        infowindow_hcp.open(map, marker_hcp);
                        marker_hcp.setIcon({ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", scaledSize: new google.maps.Size(50, 50) });
                        HCPGroupElement.classList.add("active");
                        map.setOptions({ center: marker_hcp.getPosition(), zoom: 15 });
                      }
                    });
                    Group_HCP_details.push(HCPGroupElement);
                  }
  
                  // distanceFilterSelect.style.display="block";
  
                  // distanceFilterSelect.addEventListener("change", () => {
                  //     let selectedDistance = distanceFilterSelect.value;
                      
                  //     if (selectedDistance === 'Infinity') {
                  //         selectedDistance = Infinity;
                          
                  //     } else {
                  //         selectedDistance = parseInt(selectedDistance);
                  //     };
                      
                  //     filterMarkersByDistance(selectedDistance, Group_HCP_markers, Group_Distance, Group_HCP_details);
                  // });
  
              })
              .catch((error) => {
                  console.error(error);
              });
        } else {
          setTimeout(function() {
            alert("There's no HCP near your entered information");
          }, 500); 
        };                                
      };
  
  
      function displayOrigin(origin_latlng, address){
  
        map.setOptions({center:origin_latlng,zoom:13});
        // Display origin location marker & infowindow
        const marker_O = new google.maps.Marker({
          map: map,
          position: origin_latlng,
          zoom:15,
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
        offLeftPanel();
        map.setOptions({center:center,zoom:4});
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
          console.log('geocodeAddress:', address);
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
  
      // Function to extract zip code using regular expression
      function extractZipCode(address) {
        const zipCodeRegex = /\b\d{5}(?:-\d{4})?\b/; // Regular expression pattern for zip code
        const match = address.match(zipCodeRegex);
  
        if (match) {
          return match[0]; // Return the first matched zip code
        } else {
          alert("Unable to get zipcode.")
          return ''; // Return empty string if no zip code found
        }
      }

      function extractCity(address) {
        const city = address.split(",")[0].trim().toUpperCase();
        if (city) {
          return city;
        } else {
          alert("Unable to get city name.")
          return ''; // Return empty string if no zip code found
        }
      }
  
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
          };    
  
            return Promise.all(promises)
              .then(() => {
              // console.log('HCP Distance result', markerLatLng, markerDistance);
              return {hcp:markerHCP, distance: markerDistance, latlng: markerLatLng};
              })
              .catch((error) => {
              console.error(error);
              });
      };
  
      function filterMarkersByDistance(distance, markers, distances, details) {
        for (let i = 0; i < markers.length; i++) {
          const marker = markers[i];
          const markerDistance = distances[i];
          const detail = details[i];
  
          if (markerDistance <= distance) {
            marker.setMap(map);
            detail.style.display = 'block';
          } else {
            marker.setMap(null);
            detail.style.display = 'none';
          }
          console.log('marker distance',markerDistance, 'set distance', distance, 'hcp details', detail);
        }
      };
  
      function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      };

    };

    

    initMap();

    })
  .catch(error => {
    console.error('Error:', error);
  });