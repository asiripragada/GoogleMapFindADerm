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

      const map = new google.maps.Map(document.getElementById("map"), {
          zoom: 4,
          center: center,
          streetViewControl: false
      });

      document.getElementById("map").style.display='none';

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

      distanceFilterSelect.value = 50;

      // set up inpur search panel
      const controlPanel = document.getElementById("control-panel");
      const searchOptionPanel = document.getElementById("search-option-panel");
      searchOptionPanel.appendChild(searchOptions);

      const inputPanel = document.getElementById("input-panel");
      textInputTitle = document.createElement("p");
      textInputTitle.classList.add("search-text-p");
      textInputTitle.innerHTML="Please fill in the following fields:";
      inputPanel.appendChild(textInputTitle);
      inputPanel.appendChild(inputText);
      const inputTextAlert = document.createElement("p");
      inputTextAlert.classList.add("alert-p");
      inputTextAlert.innerHTML = "";
      inputPanel.appendChild(inputTextAlert);
      inputPanel.appendChild(nameInput);
      const nameInputAlert = document.createElement("p");
      nameInputAlert.classList.add("alert-p");
      nameInputAlert.innerHTML = "";
      inputPanel.appendChild(nameInputAlert);
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
          distanceFilterSelect.value = 50;
          inputText.value="";
          inputText.style.display='block';
          nameInput.style.display='none';
          inputTextAlert.style.display='block';
          nameInputAlert.style.display='none';
          distanceFilterSelect.style.display='block';
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
          distanceFilterSelect.value = 50;
          inputText.value="";
          inputText.style.display='none';
          nameInput.style.display='none';
          inputTextAlert.style.display='none';
          nameInputAlert.style.display='none';
          distanceFilterSelect.style.display='block';
          addressOptionButton.classList.add("active");
          zipcodeOptionButton.classList.remove("active");
          cityOptionButton.classList.remove("active");
          selectedOption = "address";
        }
      });
      
      cityOptionButton.addEventListener("click", () => {
        if (!cityOptionButton.classList.contains("active")) {
          clear();
          distanceFilterSelect.value = 50;
          inputText.value="";
          inputText.style.display='block';
          nameInput.style.display='block';
          inputTextAlert.style.display='block';
          nameInputAlert.style.display='block';
          distanceFilterSelect.style.display='none';
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
          if (inputText.value != "") {
            zipcodeSearch();  
          } else {
            inputTextAlert.innerHTML="Please enter a zipcode.";
          };
        } else if (addressOptionButton.classList.contains("active")){
          currentAddressSearch();
        } else {
          if (inputText.value != "" || nameInput.value != "") {
            citySearch();  
          } else {
            inputTextAlert.innerHTML="Please enter a city name or a HCP name.";
            nameInputAlert.innerHTML="Please enter a city name or a HCP name.";
          };          
        };        
      });

                      
      clearButton.addEventListener("click", function() {
        clear();
        map.setCenter(center);
        inputText.value='';
      });  

      function zipcodeSearch(){
        clearmarkers();
        
        
        const zipcode = extractZipCode(inputText.value);
        const selectedDistance = distanceFilterSelect.value;
        console.log(selectedDistance);

        if (zipcode) {
          geocodeAddress(zipcode)
            .then(async (geo_result) => {
              document.getElementById("map").style.display='block';

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
        clearmarkers();
    
        const address = inputText.value;
        const selectedDistance = distanceFilterSelect.value;
    
        if (address) { 
        geocodeAddress(address)
            .then(async (geo_result) => {
              document.getElementById("map").style.display='block';

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
        clearmarkers();
        const name = nameInput.value.toUpperCase();

        if (inputText.value != "") {
          const city = extractCity(inputText.value);
          const state = extractState(inputText.value);
          console.log("input city:", city);
          console.log("input state:", state);
          
          const selectedDistance = distanceFilterSelect.value;

          if (city&&state) {
            geocodeAddress(city)
              .then(async (geo_result) => {
                document.getElementById("map").style.display='block';

                console.log('city geocoding result',geo_result);
                console.log('input city', city);
                let origin_latlng = geo_result[0].geometry.location;
    
                map.setOptions({center:origin_latlng,zoom:11});
    
                if (city&&state) {
                  const booleanArray = await Promise.all(
                    dataArray.map((hcp_location) => {
                      const hcpCity = hcp_location.CITY_NAME;
                      const hcpState = hcp_location.STATE_CODE;
                      const hcpName = hcp_location.FULL_NAME;
                      try {
                        return hcpCity == city && hcpState==state && hcpName.includes(name);
                      } catch (error) {
                        return false;
                      }
                    })
                    );
                  console.log('booleanArray',booleanArray);
                  showHCP(booleanArray,"Infinity");
                };
              })
              .catch((error) => {
              console.error(error);
              });
            };
        } else {
          document.getElementById("map").style.display='block';
          const booleanArray =
              dataArray.map((hcp_location) => {
                const hcpName = hcp_location.FULL_NAME;
                try {
                  return hcpName.includes(name);
                } catch (error) {
                  return false;
                }
              })
          console.log('booleanArray',booleanArray);
          showHCP(booleanArray,"Infinity");
        }
      };

      function displayHCP(final_hcps,final_distances) {

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

        for (let i = 0; i < final_hcps.length; i++){
          let hcp = final_hcps[i]

          if (selectedOption == "city") {
            let dis = '';
          } else {
            let dis = final_distances[i]
          };

          let pos = JSON.parse(hcp.COORDINATES)

          let marker_hcp = new google.maps.Marker({
              position: pos,
              map: map,
              shape: shape,
              icon:"http://maps.google.com/mapfiles/ms/icons/red-dot.png"
          });
          markerArray.push(marker_hcp);

          let hcp_name = capitalizeFirstLetter(hcp.FIRST_NAME) + " " + capitalizeFirstLetter(hcp.LAST_NAME);
          let hcp_address = capitalizeFirstLetter(hcp.ADDRESS_LINE_1) + " " + capitalizeFirstLetter(hcp.ADDRESS_LINE_2);
          let hcp_city = capitalizeFirstLetter(hcp.CITY_NAME);

          let infowindow_hcp = new google.maps.InfoWindow();
          
          // Set the content of the InfoWindow
          infowindow_hcp.setContent(
            '<div style="max-width: 200px; margin: 5px;">' +
              '<h4 style="margin: 0; color: #1a73e8; font-size: 14px; font-weight: bold;">'+ hcp_name + '</h4>' +
              '<p style="margin: 0; margin-top: 5px; font-size: 12px; ">'+ hcp_address +'</p>' +
              '<p style="margin: 0; margin-bottom: 5px; font-size: 12px;">'+ hcp_city + ',' + hcp.STATE_CODE + ' ' + hcp.ZIP_CODE +'</p>' +
              // '<div style="margin: 5px 0;">'+ 
              //   '<p style="margin:0; font-weight:bold;">'+ dis + ' miles' +'</p>'+
              //   '</div>'+
            '</div>'
          );
          
          let HCPCardElement = document.createElement("div");
          HCPCardElement.classList.add("HCP-card-div");

          let HCPDetailElement = document.createElement("div");
          HCPDetailElement.classList.add("HCP-detail-div");

          let HCPDetail_Name = document.createElement("h4");
          HCPDetail_Name.classList.add("HCP-detail-name");
          HCPDetail_Name.innerHTML = hcp_name;
          
          let HCPDetail_Address = document.createElement("div");
          HCPDetail_Address.classList.add("HCP-detail");
          let HCPDetail_Address_street = document.createElement("p");
          HCPDetail_Address_street.innerHTML = hcp_address;
          let HCPDetail_Address_city = document.createElement("p");
          HCPDetail_Address_city.innerHTML = hcp_city + ', ' + hcp.STATE_CODE + ' ' + hcp.ZIP_CODE;
          HCPDetail_Address.appendChild(HCPDetail_Address_street);
          HCPDetail_Address.appendChild(HCPDetail_Address_city);
          
          HCPDetailElement.appendChild(HCPDetail_Name);
          HCPDetailElement.appendChild(HCPDetail_Address);

          if (selectedOption != "city") {
            let HCPDetail_Route = document.createElement("div");
            HCPDetail_Route.classList.add("HCP-detail-route");
            let HCPDetail_Distance = document.createElement("span");
            HCPDetail_Distance.classList.add("HCP-detail-dis");
            HCPDetail_Distance.innerHTML = dis + ' miles&nbsp;&nbsp;&nbsp;';
            HCPDetail_Route.appendChild(HCPDetail_Distance);

            if (selectedOption == 'address') {
              // Encode the addresses for URL compatibility
              let encodedOrigin = encodeURIComponent(inputText.value);
              let encodedDestination = encodeURIComponent(hcp.FULL_ADDRESS);
              // Create the Google Maps URL with the encoded addresses
              let googleMapsURL = `https://www.google.com/maps/dir/${encodedOrigin}/${encodedDestination}`;
  
              const HCPDetail_Direction = document.createElement("a");
              HCPDetail_Direction.classList.add("HCP-detail-direction");
              HCPDetail_Direction.textContent  = "Get Directions";
              HCPDetail_Direction.href = googleMapsURL;
              HCPDetail_Direction.target = "_blank"; // Open in a new tab
  
              HCPDetail_Route.appendChild(HCPDetail_Direction);
            };

            HCPDetailElement.appendChild(HCPDetail_Route);
          };

          HCPCardElement.appendChild(HCPDetailElement);

          HCPContentElement.appendChild(HCPCardElement);

          let clicked = false;
          let elementTop = HCPCardElement.offsetTop;

          marker_hcp.addListener("mouseover", () => {
            if (!clicked) {
              infowindow_hcp.open(map, marker_hcp);
              marker_hcp.setIcon({ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", scaledSize: new google.maps.Size(50, 50) });
              HCPCardElement.classList.add("active");
              HCPContentElement.scrollTop = elementTop-50;
            }
          });
          
          marker_hcp.addListener("mouseout", () => {
            if (!clicked) {
              infowindow_hcp.close();
              marker_hcp.setIcon({ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" });
              HCPCardElement.classList.remove("active");
            }
          });
          
          marker_hcp.addListener("click", () => {
            if (clicked) {
              clicked = false;
              infowindow_hcp.close();
              marker_hcp.setIcon({ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" });
              HCPCardElement.classList.remove("active");
              map.setOptions({ center: origin_center, zoom: 13 });
              HCPContentElement.scrollTop = elementTop-50;
            } else {
              clicked = true;
              infowindow_hcp.open(map, marker_hcp);
              marker_hcp.setIcon({ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", scaledSize: new google.maps.Size(50, 50) });
              HCPCardElement.classList.add("active");
              map.setOptions({ center: marker_hcp.getPosition(), zoom: 15 });
            }
          });

          infowindow_hcp.addListener("closeclick", () => {
            clicked = false;
            marker_hcp.setIcon({ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" });
            HCPCardElement.classList.remove("active");
            map.setOptions({ center: origin_center, zoom: 13 });
          });

          HCPCardElement.addEventListener("mouseover", () => {
            if (!clicked) {
              infowindow_hcp.open(map, marker_hcp);
              marker_hcp.setIcon({ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", scaledSize: new google.maps.Size(50, 50) });
              HCPCardElement.classList.add("active");
            }
          });
          
          HCPCardElement.addEventListener("mouseout", () => {
            if (!clicked) {
              infowindow_hcp.close();
              marker_hcp.setIcon({ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" });
              HCPCardElement.classList.remove("active");
            }
          });
          
          HCPCardElement.addEventListener("click", () => {
            if (clicked) {
              clicked = false;
              infowindow_hcp.close();
              marker_hcp.setIcon({ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" });
              HCPCardElement.classList.remove("active");
              map.setOptions({ center: origin_center, zoom: 13 });
            } else {
              clicked = true;
              infowindow_hcp.open(map, marker_hcp);
              marker_hcp.setIcon({ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", scaledSize: new google.maps.Size(50, 50) });
              HCPCardElement.classList.add("active");
              map.setOptions({ center: marker_hcp.getPosition(), zoom: 15 });
            }
          });

        };
        leftPanel.appendChild(HCPContentElement);
      };
  
      function showHCP(booleanArray,selectedDistance) {

        const sum = booleanArray.reduce((accumulator, currentValue) => accumulator + Number(currentValue), 0);
    
        if (sum !== 0) {
          // Filter HCPs array
          const filteredArray = dataArray.filter((_, index) => Boolean(booleanArray[index]));
          
          if (selectedDistance != "Infinity") {
            // Display HCPs on map
            HCPDistance(filteredArray, inputText)
            .then((result) => {
                
              let distances = result.distance;
              let latlngs = result.latlng;
              let hcps = result.hcp;
              

              let booldistance = [];
              distances.forEach((dis) => {
                if (parseFloat(dis) <= parseFloat(selectedDistance)) {                  
                  // console.log('distance comparison:',dis, typeof dis, selectedDistance, typeof selectedDistance);
                  booldistance.push(true);
                } else {
                  booldistance.push(false);
                }
              });

              // console.log(booldistance);

              let final_distances = distances.filter((_, index) => Boolean(booldistance[index]));
              let final_hcps = hcps.filter((_, index) => Boolean(booldistance[index]));
              
              // console.log(final_distances);

              displayHCP(final_hcps,final_distances);
            })
            .catch((error) => {
                console.error(error);
            });
          } else {
            displayHCP(filteredArray,'');
          };
          
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
        document.getElementById("map").style.display='none';
        distanceFilterSelect.value = 50;
        inputText.value="";
        nameInput.vallue="";
        inputTextAlert.innerHTML="";
        nameInputAlert.innerHTML="";
        clearmarkers();
      };
  
      function clearmarkers() {
        offLeftPanel();
        for (var i = 0; i < markerArray.length; i++) {
          markerArray[i].setMap(null);
        }
        markerArray = [];
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
          // alert("Unable to get zipcode.")
          return ''; // Return empty string if no zip code found
        }
      }

      function extractCity(address) {
        const city = address.split(",")[0].trim().toUpperCase();
        if (city) {
          return city;
        } else {
          // alert("Unable to get city name.")
          return ''; // Return empty string if no zip code found
        }
      }

      function extractState(address) {
        const state = address.split(',')[1].trim().toUpperCase();
        if (state) {
          return state;
        } else {
          // alert("Unable to get city name.")
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
  
      function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      };

    };


    initMap();

    })
  .catch(error => {
    console.error('Error:', error);
  });