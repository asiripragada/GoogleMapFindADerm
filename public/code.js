// @author: Violet(Yafan) Zeng

fetch('/data')
  .then(response => response.json())
  .then(data => {
    let markerArray = [];

    console.log(data);

    const dataFull = data.filter(row => row["COORDINATES"] !== 'nan');
    console.log("dataArray.length",dataFull.length);

    // JavaScript code to toggle left panel display
    const mapContainer = document.getElementById('map-container');
    const mapViewContainer = document.getElementById('map-view-container');
    const leftPanel = document.getElementById('left-panel');



    function onLeftPanel() {
      mapViewContainer.classList.remove("left-panel-hidden");
      leftPanel.style.display = "flex";
      leftPanel.innerHTML = "";
    }

    function offLeftPanel() {
      mapViewContainer.classList.add("left-panel-hidden");
      leftPanel.style.display = "none";
      leftPanel.innerHTML = "";
    }

    function initMap() {
      
      // Default map
      const center = { lat: 37.0902, lng: -95.7129 }; // Center coordinates (US)

      const map = new google.maps.Map(document.getElementById("map"), {
          zoom: 4,
          center: center,
          streetViewControl: false,
          mapTypeControl:false,
          fullscreenControl: false
      });

      // document.getElementById("map").style.display='none';

      // Hide the loading sign
      document.getElementById("loading-sign").style.display = "none";

      // Search Input Div
      const controlPanel = document.getElementById("control-panel");

      // Search Options Div (zipcode, city&hcp, current location)
      const searchOptionDiv = document.createElement("div");
      searchOptionDiv.id = "search-option-div";

      const searchOptionText = document.createElement("span");
      searchOptionText.innerHTML = "Search by:";
      searchOptionDiv.appendChild(searchOptionText);

      const searchOptions = document.createElement("div");
      searchOptions.id = "search-options";
      searchOptions.classList.add("btn-group", "btn-group-toggle");
      searchOptions.setAttribute("data-toggle", "buttons");

      const zipcodeOptionButton = document.createElement("input");
      zipcodeOptionButton.type = "button";
      zipcodeOptionButton.value = "Zipcode";
      zipcodeOptionButton.classList.add("search-option-button","active");
      zipcodeOptionButton.name = "searchOption";
      zipcodeOptionButton.id = "zipcodeOption";

      const cityOptionButton = document.createElement("input");
      cityOptionButton.type = "button";
      cityOptionButton.value = "State & City";
      cityOptionButton.classList.add("search-option-button");
      cityOptionButton.name = "searchOption";
      cityOptionButton.id = "cityOption";

      const nameOptionButton = document.createElement("input");
      nameOptionButton.type = "button";
      nameOptionButton.value = "HCP Name";
      nameOptionButton.classList.add("search-option-button");
      nameOptionButton.name = "searchOption";
      nameOptionButton.id = "nameOption";

      // const addressOptionButton = document.createElement("input");
      // addressOptionButton.type = "button";
      // addressOptionButton.value = "Current Address";
      // addressOptionButton.classList.add("search-option-button");
      // addressOptionButton.name = "searchOption";
      // addressOptionButton.id = "addressOption";

      searchOptions.appendChild(zipcodeOptionButton);
      searchOptions.appendChild(cityOptionButton);
      searchOptions.appendChild(nameOptionButton);
      // searchOptions.appendChild(addressOptionButton);

      searchOptionDiv.appendChild(searchOptions);
      controlPanel.appendChild(searchOptionDiv);

      // Inputs Div (zipcode/city, name, distance)
      const inputDiv = document.createElement("div");
      inputDiv.id = "input-div";

      // Zipcode Div 
      const inputZipcodeDiv = document.createElement("div");
      inputZipcodeDiv.classList.add("input-text-div");

      const inputZipcodeTextDiv = document.createElement("div");
      inputZipcodeTextDiv.classList.add("input-text-span-div");

      const inputZipcodeText = document.createElement("span");
      inputZipcodeText.innerHTML = "Please enter Zip Code:";
      inputZipcodeTextDiv.appendChild(inputZipcodeText);
      inputZipcodeDiv.appendChild(inputZipcodeTextDiv);

      const zipcodeInput = document.createElement("input");
      zipcodeInput.classList.add("input-text-input");
      zipcodeInput.type = "text";
      zipcodeInput.placeholder = "Enter a zipcode";
      inputZipcodeDiv.appendChild(zipcodeInput);

      const inputZipcodeErrorDiv = document.createElement("div");
      inputZipcodeErrorDiv.classList.add("input-text-error-div");

      const inputZipcodeErrorImg = document.createElement("img");
      inputZipcodeErrorImg.src = "pics/Danger.png";
      inputZipcodeErrorDiv.appendChild(inputZipcodeErrorImg);

      const inputZipcodeErrorText = document.createElement("span");
      inputZipcodeErrorText.innerHTML = "Invalid Zip Code";
      inputZipcodeErrorDiv.appendChild(inputZipcodeErrorText);
      inputZipcodeDiv.appendChild(inputZipcodeErrorDiv);

      inputDiv.appendChild(inputZipcodeDiv);

      // City Div 
      const inputCityDiv = document.createElement("div");
      inputCityDiv.classList.add("input-text-div");

      const inputCityTextDiv = document.createElement("div");
      inputCityTextDiv.classList.add("input-text-span-div");

      const inputCityText = document.createElement("span");
      inputCityText.innerHTML = "Please enter State or City Name:";
      inputCityTextDiv.appendChild(inputCityText);
      inputCityDiv.appendChild(inputCityTextDiv);

      const cityInput = document.createElement("input");
      cityInput.classList.add("input-text-input");
      cityInput.type = "text";
      cityInput.placeholder = "Enter a state or city";
      inputCityDiv.appendChild(cityInput);

      const inputCityErrorDiv = document.createElement("div");
      inputCityErrorDiv.classList.add("input-text-error-div");

      const inputCityErrorImg = document.createElement("img");
      inputCityErrorImg.src = "pics/Danger.png";
      inputCityErrorDiv.appendChild(inputCityErrorImg);

      const inputCityErrorText = document.createElement("span");
      inputCityErrorText.innerHTML = "Invalid State or City Name";
      inputCityErrorDiv.appendChild(inputCityErrorText);
      inputCityDiv.appendChild(inputCityErrorDiv);

      inputDiv.appendChild(inputCityDiv);

      // Name Div 
      const inputNameDiv = document.createElement("div");
      inputNameDiv.classList.add("input-text-div");

      const inputNameTextDiv = document.createElement("div");
      inputNameTextDiv.classList.add("input-text-span-div");

      const inputNameText = document.createElement("span");
      inputNameText.innerHTML = "Please enter HCP Name:";
      inputNameTextDiv.appendChild(inputNameText);
      inputNameDiv.appendChild(inputNameTextDiv);

      const nameInput = document.createElement("input");
      nameInput.classList.add("input-text-input");
      nameInput.type = "text";
      nameInput.placeholder = "Enter a name";
      inputNameDiv.appendChild(nameInput);

      const inputNameErrorDiv = document.createElement("div");
      inputNameErrorDiv.classList.add("input-text-error-div");

      const inputNameErrorImg = document.createElement("img");
      inputNameErrorImg.src = "pics/Danger.png";
      inputNameErrorDiv.appendChild(inputNameErrorImg);

      const inputNameErrorText = document.createElement("span");
      inputNameErrorText.innerHTML = "Invalid HCP Name";
      inputNameErrorDiv.appendChild(inputNameErrorText);
      inputNameDiv.appendChild(inputNameErrorDiv);

      inputDiv.appendChild(inputNameDiv);

      // Distance Div
      const distanceInputDiv = document.createElement("div");
      distanceInputDiv.id = "distance-input-div";

      const distanceInputTextDiv = document.createElement("div");
      distanceInputTextDiv.id = "distance-input-span-div";

      const distanceInputText = document.createElement("span");
      distanceInputText.innerHTML = "Please define the radius:";
      distanceInputTextDiv.appendChild(distanceInputText);
      distanceInputDiv.appendChild(distanceInputTextDiv);

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

      distanceInputDiv.appendChild(distanceFilterSelect);

      inputDiv.appendChild(distanceInputDiv);

      // Specialty Options
      const specialtyInputDiv = document.createElement("div");
      specialtyInputDiv.id = "specialty-input-div";

      const specialtyInputTextDiv = document.createElement("div");
      specialtyInputTextDiv.id = "specialty-input-span-div";

      const specialtyInputText = document.createElement("span");
      specialtyInputText.innerHTML = "Please choose area of specialty:";
      specialtyInputTextDiv.appendChild(specialtyInputText);
      specialtyInputDiv.appendChild(specialtyInputTextDiv);

      const specialtyInputOptions = document.createElement("div");
      specialtyInputOptions.classList.add("specialty-options");

      const radioOption_all = document.createElement("label");
      radioOption_all.classList.add("specialty-option-input");

      const radioinput_all = document.createElement("input");
      radioinput_all.classList.add("specialty-option-input");
      radioinput_all.type = "checkbox";
      radioinput_all.value = "all";
      radioinput_all.checked = false;

      const radioLabel_all = document.createElement("span");
      radioLabel_all.classList.add("specialty-option-input");
      radioLabel_all.textContent = "All Prescribers";
      
      radioOption_all.appendChild(radioinput_all);
      radioOption_all.appendChild(radioLabel_all);      
      specialtyInputOptions.appendChild(radioOption_all);

      const radioOption_derm = document.createElement("label");
      radioOption_derm.classList.add("specialty-option-input");

      const radioinput_derm = document.createElement("input");
      radioinput_derm.classList.add("specialty-option-input");
      radioinput_derm.type = "checkbox";
      radioinput_derm.value = "derm";
      radioinput_derm.checked = true;

      const radioLabel_derm = document.createElement("span");
      radioLabel_derm.classList.add("specialty-option-input");
      radioLabel_derm.textContent = "Dermatologist";
      
      radioOption_derm.appendChild(radioinput_derm);
      radioOption_derm.appendChild(radioLabel_derm);      
      specialtyInputOptions.appendChild(radioOption_derm);


      specialtyInputDiv.appendChild(specialtyInputOptions);
      inputDiv.appendChild(specialtyInputDiv);

      controlPanel.appendChild(inputDiv);

      // Disclosure Div (zipcode/city, name, distance)
      const disclosureDiv = document.createElement("div");
      disclosureDiv.id = "disclosure-div";

      const disclosureCheckDiv = document.createElement("div");
      disclosureCheckDiv.id = "disclosure-check-div";

      const disclosureCheck = document.createElement("input");
      disclosureCheck.type = "checkbox";
      disclosureCheck.checked = false;

      disclosureCheck.addEventListener("click", () => {
        disclosureCheckDiv.classList.remove("error");
      });

      disclosureCheckDiv.appendChild(disclosureCheck);
      disclosureDiv.appendChild(disclosureCheckDiv);

      const disclosureTextDiv = document.createElement("div");
      disclosureTextDiv.id = "disclosure-text-div";

      const disclosureTextHeader = document.createElement("h");
      disclosureTextHeader.id = "disclosure-text";
      disclosureTextHeader.innerHTML = "By checking this box you acknowledge that you have read and agree with the statement below."

      const disclosureTextMessage = document.createElement("p");
      disclosureTextMessage.id = "disclosure-text";
      disclosureTextMessage.innerHTML = `Dermavant Sciences, Inc. offers this service to assist patients in locating local specialists experienced in VTAMA. 
        Inclusion in this directory does not imply endorsement or recommendation by Dermavant Sciences, Inc., nor does it guarantee that specialists listed will 
        determine VTAMA to be the appropriate treatment for you. Selecting a physician is your sole responsibility, and it is a crucial decision that requires 
        careful consideration. This specialist locator is just one of several sources of information available to you. Dermavant Sciences, Inc. manufactures 
        and markets VTAMA.`

      disclosureTextDiv.appendChild(disclosureTextHeader);
      disclosureTextDiv.appendChild(disclosureTextMessage);
      disclosureDiv.appendChild(disclosureTextDiv);

      controlPanel.appendChild(disclosureDiv);

      // Search & Clear Div
      const searchDiv = document.createElement("div");
      searchDiv.id = "search-clear-div";

      // Search button
      const submitButton = document.createElement("input");
      submitButton.type = "button";
      submitButton.value = "Search";
      submitButton.id = "submit-button";
      searchDiv.appendChild(submitButton);

      const clearButton = document.createElement("input");
      clearButton.type = "button";
      clearButton.value = "Clear";
      clearButton.id = "clear-button";
      searchDiv.appendChild(clearButton);

      controlPanel.appendChild(searchDiv);

      const submitErrorDiv = document.createElement("div");
      submitErrorDiv.id = "submit-error-div";

      const submitErrorText = document.createElement("p");
      submitErrorText.innerHTML = "Please fill in all the mandatory details";
      submitErrorDiv.appendChild(submitErrorText);

      controlPanel.appendChild(submitErrorDiv);
      
      // set up auto complete
      const auto_zipcode_options = {
        componentRestrictions: { country: "us" },
        strictBounds: true,
        types:['postal_code']
      };

      const auto_city_options = {
        componentRestrictions: { country: "us" },
        strictBounds: true,
        types:['locality',"administrative_area_level_1"]
      };

      const autocomplete_zipcode = new google.maps.places.Autocomplete(zipcodeInput, auto_zipcode_options);
      const autocomplete_city = new google.maps.places.Autocomplete(cityInput, auto_city_options);

      // Set initial option
      let selectedOption = "zipcode";
      inputZipcodeDiv.style.display='flex';
      inputCityDiv.style.display='none';
      inputNameDiv.style.display='none';
      distanceInputDiv.style.display='flex';

      zipcodeOptionButton.addEventListener("click", () => {
        if (!zipcodeOptionButton.classList.contains("active")) {
          clear();
          zipcodeInput.value="";
          inputZipcodeDiv.style.display='flex';
          inputCityDiv.style.display='none';
          inputNameDiv.style.display='none';
          distanceInputDiv.style.display='flex';
          zipcodeOptionButton.classList.add("active");
          nameOptionButton.classList.remove("active");
          cityOptionButton.classList.remove("active");
          selectedOption = "zipcode";
          autocomplete_zipcode.getPlace();
          console.log("click on", selectedOption);
        }
      });
      
      cityOptionButton.addEventListener("click", () => {
        if (!cityOptionButton.classList.contains("active")) {
          clear();
          inputZipcodeDiv.style.display='none';
          inputCityDiv.style.display='flex';
          inputNameDiv.style.display='none';
          distanceInputDiv.style.display='none';
          cityOptionButton.classList.add("active");
          nameOptionButton.classList.remove("active");
          zipcodeOptionButton.classList.remove("active");
          selectedOption = "city";
          autocomplete_city.getPlace();
          console.log("click on", selectedOption);
        }
      });

      nameOptionButton.addEventListener("click", () => {
        if (!nameOptionButton.classList.contains("active")) {
          clear();
          inputZipcodeDiv.style.display='none';
          inputCityDiv.style.display='none';
          inputNameDiv.style.display='flex';
          distanceInputDiv.style.display='none';
          cityOptionButton.classList.remove("active");
          nameOptionButton.classList.add("active");
          zipcodeOptionButton.classList.remove("active");
          selectedOption = "name";
          console.log("click on", selectedOption);
        }
      });

            // addressOptionButton.addEventListener("click", () => {
      //   if (!addressOptionButton.classList.contains("active")) {
      //     clear();
      //     inputZipcodeDiv.style.display='none';
      //     inputCityDiv.style.display='none';
      //     inputNameDiv.style.display='none';
      //     distanceInputDiv.style.display='flex';
      //     addressOptionButton.classList.add("active");
      //     zipcodeOptionButton.classList.remove("active");
      //     cityOptionButton.classList.remove("active");
      //     selectedOption = "address";
      //     console.log("click on", selectedOption);
      //   }
      // });

      // set initial specialty
      let selectedSpecialty = "derm";

      // add event on specialty
      radioOption_all.addEventListener("click", () => {
        if (radioinput_all.checked) {
          selectedSpecialty = "all";
          radioinput_all.checked = true;
          radioinput_derm.checked = false;
        }
      });

      radioOption_derm.addEventListener("click", () => {
        if (radioinput_derm.checked) {
          selectedSpecialty = "derm";
          radioinput_all.checked = false;
          radioinput_derm.checked = true;
        }
      });

      // set up error box
      const mapErrorDiv = document.createElement("div");
      mapErrorDiv.id = "map-error-div";

      const mapErrorTab = document.createElement("div");
      mapErrorTab.id = "map-error-tab";
      mapErrorDiv.appendChild(mapErrorTab);

      const mapErrorContent = document.createElement("div");
      mapErrorContent.id = "map-error-content";

      const mapErrorImgDiv = document.createElement("div");
      mapErrorImgDiv.id = "map-error-img-div";
      const mapErrorImg = document.createElement("img");
      mapErrorImg.src = "pics/Warning.png";
      mapErrorImgDiv.appendChild(mapErrorImg);
      mapErrorContent.appendChild(mapErrorImgDiv);

      const mapErrorMessage = document.createElement("div");
      mapErrorMessage.id = "map-error-message";

      const mapErrorMessageHeader = document.createElement("h2");
      mapErrorMessageHeader.innerHTML = "We're sorry!";
      mapErrorMessage.appendChild(mapErrorMessageHeader);

      const mapErrorMessageBody1 = document.createElement("p");
      mapErrorMessageBody1.innerHTML = "We were not able find a match";
      mapErrorMessage.appendChild(mapErrorMessageBody1);

      const mapErrorMessageBody2 = document.createElement("p");
      mapErrorMessageBody2.innerHTML = "Please try again.";
      mapErrorMessage.appendChild(mapErrorMessageBody2);

      mapErrorContent.appendChild(mapErrorMessage);
      mapErrorDiv.appendChild(mapErrorContent);

      mapContainer.appendChild(mapErrorDiv);


      submitButton.addEventListener("click", () => {
        
        if (selectedSpecialty=="derm") {
          dataArray = dataFull.filter(row => row["Spec Group"] == "DERM"); 
        } else {
          dataArray = dataFull;
        }
        if(zipcodeOptionButton.classList.contains("active")) {
          if (zipcodeInput.value != "" && disclosureCheck.checked ) {
            zipcodeSearch();  
          } else {
            showError();
          };
        } else if (addressOptionButton.classList.contains("active")){
          if (disclosureCheck.checked ) {
            currentAddressSearch();
          } else {
            showError();
          };
        } else {
          if ((cityInput.value != "" || nameInput.value != "") && disclosureCheck.checked ) {
            citySearch();  
          } else {
            showError();
          };          
        };        
      });

      function showError() {
        if (zipcodeInput.value == "") {
          inputZipcodeErrorDiv.style.display = "flex";
        };
        if (cityInput.value == "") {
          inputCityErrorDiv.style.display = "flex";
        };
        if (nameInput.value == "") {
          inputNameErrorDiv.style.display = "flex";
        };
        if (!disclosureCheck.checked) {
          disclosureCheckDiv.classList.add("error");
        };
        submitErrorDiv.style.display = "flex";
      };
                      
      clearButton.addEventListener("click", function() {
        clear();
      });  

      function zipcodeSearch(){

        clearmarkers();
        
        
        const zipcode = extractZipCode(zipcodeInput.value);
        const selectedDistance = distanceFilterSelect.value;
        console.log("selectedDistance", selectedDistance);

        console.log(zipcode);
        if (zipcode) {
          geocodeAddress(zipcode)
            .then((geo_result) => {

              mapContainer.style.display='flex';

              console.log('zipcode geocoding result',geo_result);
              console.log('input zipcode', zipcode);
              
              let origin_latlng = geo_result[0].geometry.location;
  
              displayOrigin(origin_latlng,"Zipcode: "+zipcode);
              
              const addressComponents = geo_result[0].address_components;
              const zipcodeComponent = addressComponents.find(
                (component) => component.types[0] === "postal_code"
              );
              const geoZipcode = zipcodeComponent ? zipcodeComponent.short_name : null;
  
              console.log('geo zipcode:', geoZipcode)
  
              if (geoZipcode) {
                const booleanArray = 
                  dataArray.map((hcp_location) => {
                      const hcpZipcode = hcp_location.PRIMARY_ZIP_CODE;
                      try {
                        return hcpZipcode == geoZipcode;
                      } catch (error) {
                        console.error(error);
                        return false; // or handle the error in an appropriate way
                      }
                    })
                console.log('booleanArray',booleanArray);
                showHCP(zipcodeInput.value, booleanArray, selectedDistance);
              } else {
                mapErrorMessageBody1.innerHTML = "Unable to get zipcode from geocode result"
                mapErrorDiv.style.display="flex";
              };

            })
            .catch((error) => {
            console.error(error);
            });
        } else {
          inputZipcodeErrorDiv.style.display = "flex";
        }
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
              // document.getElementById("map").style.display='block';
              mapContainer.style.display="flex";

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
                // document.getElementById("map").style.display='block';
                document.getElementById("map-shield").style.display='none';

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
          // document.getElementById("map").style.display='block';
          document.getElementById("map-shield").style.display='none';
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

      function displayHCP(input, final_hcps,final_distances, sum) {

        // console.log('final_hcps:',final_hcps);
        // console.log('final_distances:',final_distances);

        const shape = {
          coords: [1, 1, 1, 8, 6, 8, 6, 1],
          type: "poly",
        };

        onLeftPanel();
        origin_center = map.getCenter();
        
        const HCPHeaderElement = document.createElement("div");
        HCPHeaderElement.innerHTML = "Search Results (" + sum + ")" ;
        HCPHeaderElement.classList.add("HCP-header");
        leftPanel.appendChild(HCPHeaderElement);

        const HCPContentElement = document.createElement("div");
        HCPContentElement.id = "leftPanelContent";
        HCPContentElement.classList.add("HCP-content");

        for (let i = 0; i < final_hcps.length; i++){

          let hcp = final_hcps[i]
          let dis = '';
          let number = i+1;

          if (selectedOption != "zipcode") {
            dis = '';
          } else {
            dis = final_distances[i]
          };

          // console.log('dis', dis);

          let pos = JSON.parse(hcp.COORDINATES)

          const marker_hcp_icon_normal = {
            url: 'pics/Placeholder_hcp.png',
          };

          const marker_hcp_icon_hover = {
            url: 'pics/Placeholder_hcp.png',
            scaledSize: new google.maps.Size(50, 50)
          };

          let marker_hcp = new google.maps.Marker({
              position: pos,
              map: map,
              shape: shape,
              icon:marker_hcp_icon_normal
          });
          markerArray.push(marker_hcp);

          let hcp_name = capitalizeFirstLetter(hcp.FIRST_NAME) + " " + capitalizeFirstLetter(hcp.LAST_NAME);
          let hcp_specialty = capitalizeFirstLetter(hcp.PRIMARY_SPECIALTY_LONG_NAME);
          let hcp_address = capitalizeFirstLetter(hcp.PRIMARY_ADDRESS_LINE_1) + " " + capitalizeFirstLetter(hcp.PRIMARY_ADDRESS_LINE_2);
          let hcp_city = capitalizeFirstLetter(hcp.PRIMARY_CITY);
          let hcp_phone = formatPhoneNumber(hcp.PRIMARY_PHONE_NUMBER);
          let hcp_call = "tel:" + hcp_phone;
          // Create the Google Maps URL with the encoded addresses
          let encodedOrigin = encodeURIComponent(input);
          let encodedDestination = encodeURIComponent(hcp.FULL_ADDRESS);
          let googleMapsURL = `https://www.google.com/maps/dir/${encodedOrigin}/${encodedDestination}`;

          let infowindow_hcp = new google.maps.InfoWindow();

          // set hcp card
          let HCPCardElement = document.createElement("div");
          HCPCardElement.classList.add("HCP-card-div");

          HCPContentElement.appendChild(HCPCardElement);

          // set hcp number
          let HCPNumberDiv = document.createElement("div");
          HCPNumberDiv.classList.add("HCP-number-div");

          let HCPNumber = document.createElement("p");
          HCPNumber.innerHTML = number;

          HCPNumberDiv.appendChild(HCPNumber);
          HCPCardElement.appendChild(HCPNumberDiv);

          // set hcp details
          let HCPDetailDiv = document.createElement("div");
          HCPDetailDiv.classList.add("HCP-detail-div");

          // set hcp name
          let HCPDetail_Name = document.createElement("h4");
          HCPDetail_Name.classList.add("HCP-detail-name");
          HCPDetail_Name.innerHTML = hcp_name;
          HCPDetailDiv.appendChild(HCPDetail_Name);

          // set hcp specialty + distance
          let HCPDetailDiv_1 = document.createElement("div");
          HCPDetailDiv_1.classList.add("HCP-detail-div-sub");
          
          // set hcp specialty 
          let HCPDetail_Specialty = document.createElement("div");
          HCPDetail_Specialty.classList.add("HCP-detail-specialty");
          let HCPDetail_Specialty_text = document.createElement("p");
          HCPDetail_Specialty_text.innerHTML = hcp_specialty;
          HCPDetail_Specialty.appendChild(HCPDetail_Specialty_text);
          HCPDetailDiv_1.appendChild(HCPDetail_Specialty);

          // add distance icon
          const HCPDetail_Route = document.createElement("div");
          HCPDetail_Route.classList.add("HCP-detail-route");

          const routeIcon = document.createElement("img");
          routeIcon.classList.add("HCP-detail-route");
          const HCPDetail_Route_dis = document.createElement("span");
          HCPDetail_Route_dis.classList.add("HCP-detail-route");

          if (selectedOption == "zipcode") {

            // add distance icon            
            routeIcon.src = "pics/Distance.png"; // Replace with the path to your direction icon image
            routeIcon.alt = "Distance: ";
            HCPDetail_Route.appendChild(routeIcon);

            // add distance 
            HCPDetail_Route_dis.innerHTML = dis + ' miles';
            HCPDetail_Route.appendChild(HCPDetail_Route_dis);

            HCPDetailDiv_1.appendChild(HCPDetail_Route);
          };
          HCPDetailDiv.appendChild(HCPDetailDiv_1);

          // set divider
          let HCPDetail_line = document.createElement("hr");
          HCPDetail_line.classList.add("HCP-detail-line");
          HCPDetailDiv.appendChild(HCPDetail_line);

          // bottom div 
          let HCPDetailDiv_2 = document.createElement("div");
          HCPDetailDiv_2.classList.add("HCP-detail-div-sub");

          // set hcp address
          let HCPDetail_Address = document.createElement("div");
          HCPDetail_Address.classList.add("HCP-detail-address");
          let HCPDetail_Address_street = document.createElement("p");
          HCPDetail_Address_street.innerHTML = hcp_address;
          HCPDetail_Address.appendChild(HCPDetail_Address_street);
          let HCPDetail_Address_city = document.createElement("p");
          HCPDetail_Address_city.innerHTML = hcp_city + ", " + hcp.PRIMARY_STATE_CODE + " " + hcp.PRIMARY_ZIP_CODE;
          HCPDetail_Address.appendChild(HCPDetail_Address_city);

          HCPDetailDiv_2.appendChild(HCPDetail_Address);

          // phone div
          const HCPDetail_phone = document.createElement("div");
          HCPDetail_phone.classList.add("HCP-detail-phone");

          // add phone icon
          const phoneIcon = document.createElement("img");
          phoneIcon.classList.add("HCP-detail-phone");
          
          phoneIcon.src = "pics/Phone call.png"; // Replace with the path to your direction icon image
          phoneIcon.alt = "Phone: ";
          HCPDetail_phone.appendChild(phoneIcon);

          // add phone number
          const HCPDetail_phone_number = document.createElement("span");
          HCPDetail_phone_number.classList.add("HCP-detail-phone");
          HCPDetail_phone_number.innerHTML = hcp_phone;

          HCPDetail_phone.appendChild(HCPDetail_phone_number);

          HCPDetailDiv_2.appendChild(HCPDetail_phone);

          HCPDetailDiv.appendChild(HCPDetailDiv_2);
          HCPCardElement.appendChild(HCPDetailDiv);

          const cardHeight = window.getComputedStyle(HCPCardElement).height;

          let HCPCardtab = document.createElement("div");
          HCPCardtab.classList.add("HCP-card-tab");
          HCPCardtab.style.height = cardHeight;

          HCPCardElement.appendChild(HCPCardtab);


          if (selectedOption == "zipcode") {
            infowindow_hcp.setContent(`
                <p style="margin:0; color: #140065; font-family: Poppins; font-size: 16px; font-weight: 500;">${hcp_name}</p>
                <p style="margin:0;  color: #D200E6;font-family: Poppins;font-size: 12px;font-style: normal;font-weight: 400;">${hcp_specialty}</p>
                <hr style="width: 90%; margin:0; margin-top: 5px; border-top: 0.7px solid #929292;"></hr>
                <p style="margin:0; margin-top: 5px; color: #0374BB;font-family: Poppins;font-size: 12px;font-style: normal;font-weight: 400;">${hcp_address}</p>
                <p style="margin:0; color: #0374BB;font-family: Poppins;font-size: 12px;font-style: normal;font-weight: 400;">${hcp_city + ", " + hcp.PRIMARY_STATE_CODE + " " + hcp.PRIMARY_ZIP_CODE}</p>
                <div id="info_div" style="margin:0; margin-right:0px; display:flex;flex-direction: row;align-items: center;justify-content: space-between;">
                  <div id="distance" style="magin:0;display:flex;flex-direction: row;align-items: center;">
                    <img style="width: 15px;height: 15px;" src="pics/Distance.png"></img>
                    <span style="margin-left:10px;color: #929292; font-family: Poppins;font-size: 12px;font-style: normal;font-weight: 400;">${dis + ' miles'}</span>
                  </div>
                  <div id="url_links" style="magin:0;display:flex;flex-direction: row;align-items: center;">
                    <a href="${hcp_call}" style="margin-left:22px">
                      <img style="width: 30px;height: 30px;" src="pics/call.png"></img>
                    </a>
                    <a href="${googleMapsURL}" target="_blank">
                      <img style="width: 30px;height: 30px;" src="pics/navigate.png"></img>
                    </a>
                  </div>
                </div>
            `);
          } else {
            infowindow_hcp.setContent(`
                <p style="margin:0; color: #140065; font-family: Poppins; font-size: 16px; font-weight: 500;">${hcp_name}</p>
                <p style="margin:0;  color: #D200E6;font-family: Poppins;font-size: 12px;font-style: normal;font-weight: 400;">${hcp_specialty}</p>
                <hr style="width: 90%; margin:0; margin-top: 5px; border-top: 0.7px solid #929292;"></hr>
                <p style="margin:0; margin-top: 5px; color: #0374BB;font-family: Poppins;font-size: 12px;font-style: normal;font-weight: 400;">${hcp_address}</p>
                <p style="margin:0; color: #0374BB;font-family: Poppins;font-size: 12px;font-style: normal;font-weight: 400;">${hcp_city + ", " + hcp.PRIMARY_STATE_CODE + " " + hcp.PRIMARY_ZIP_CODE}</p>
                <div id="info_div" style="margin:0; margin-right:0px; display:flex;flex-direction: row;align-items: center;justify-content: right;">
                  <div id="url_links" style="magin:0;display:flex;flex-direction: row;align-items: center;">
                    <a href="${hcp_call}" style="margin-left:22px">
                      <img style="width: 30px;height: 30px;" src="pics/call.png"></img>
                    </a>
                  </div>
                </div>
            `);
          };

          let clicked = false;
          let elementTop = HCPCardElement.offsetTop;

          function activeHCP(){
            HCPCardElement.classList.add("active");
            HCPCardtab.classList.add("active");
            HCPDetail_Name.classList.add("active");
            HCPDetail_Specialty_text.classList.add("active");
            HCPDetail_phone_number.classList.add("active");
            HCPDetail_Address_street.classList.add("active");  
            HCPDetail_Address_city.classList.add("active");            
            if(selectedOption != "city") {
              HCPDetail_Route_dis.classList.add("active");
            };
          };

          function disactiveHCP(){
            HCPCardElement.classList.remove("active");
            HCPCardtab.classList.remove("active");
            HCPDetail_Name.classList.remove("active");
            HCPDetail_Specialty_text.classList.remove("active");
            HCPDetail_phone_number.classList.remove("active");
            HCPDetail_Address_street.classList.remove("active");  
            HCPDetail_Address_city.classList.remove("active");            
            if(selectedOption != "city") {
              HCPDetail_Route_dis.classList.remove("active");
            };
          };

          marker_hcp.addListener("mouseover", () => {
            if (!clicked) {
              infowindow_hcp.open(map, marker_hcp);
              marker_hcp.setIcon(marker_hcp_icon_hover);
              activeHCP();
              HCPContentElement.scrollTop = elementTop-50;
            }
          });
          
          marker_hcp.addListener("mouseout", () => {
            if (!clicked) {
              infowindow_hcp.close();
              marker_hcp.setIcon(marker_hcp_icon_normal);
              disactiveHCP();
            }
          });
          
          marker_hcp.addListener("click", () => {
            if (clicked) {
              clicked = false;
              infowindow_hcp.close();
              marker_hcp.setIcon(marker_hcp_icon_normal);
              disactiveHCP();
              map.setOptions({ center: origin_center, zoom: 13 });
              HCPContentElement.scrollTop = elementTop-50;
            } else {
              clicked = true;
              infowindow_hcp.open(map, marker_hcp);
              marker_hcp.setIcon(marker_hcp_icon_hover);
              activeHCP();
              map.setOptions({ center: marker_hcp.getPosition(), zoom: 15 });
            }
          });

          infowindow_hcp.addListener("closeclick", () => {
            clicked = false;
            marker_hcp.setIcon(marker_hcp_icon_normal);
            disactiveHCP();
            map.setOptions({ center: origin_center, zoom: 13 });
          });

          HCPCardElement.addEventListener("mouseover", () => {
            if (!clicked) {
              infowindow_hcp.open(map, marker_hcp);
              marker_hcp.setIcon(marker_hcp_icon_hover);
              activeHCP();
            }
          });
          
          HCPCardElement.addEventListener("mouseout", () => {
            if (!clicked) {
              infowindow_hcp.close();
              marker_hcp.setIcon(marker_hcp_icon_normal);
              disactiveHCP();
            }
          });
          
          HCPCardElement.addEventListener("click", () => {
            if (clicked) {
              clicked = false;
              infowindow_hcp.close();
              marker_hcp.setIcon(marker_hcp_icon_normal);
              disactiveHCP();
              map.setOptions({ center: origin_center, zoom: 13 });
            } else {
              clicked = true;
              infowindow_hcp.open(map, marker_hcp);
              marker_hcp.setIcon(marker_hcp_icon_hover);
              activeHCP();
              map.setOptions({ center: marker_hcp.getPosition(), zoom: 15 });
            }
          });
          
        };
        leftPanel.appendChild(HCPContentElement);
      };
  
      function showHCP(input, booleanArray,selectedDistance) {

        const sum = booleanArray.reduce((accumulator, currentValue) => accumulator + Number(currentValue), 0);
    
        if (sum !== 0) {
          // Filter HCPs array
          const filteredArray = dataArray.filter((_, index) => Boolean(booleanArray[index]));
          
          if (selectedDistance != "Infinity") {
            // Display HCPs on map
            HCPDistance(input, filteredArray)
            .then((result) => {
                
              let distances = result.distance;
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

              displayHCP(input, final_hcps,final_distances,sum);
            })
            .catch((error) => {
                console.error(error);
            });
          } else {
            displayHCP(input, filteredArray,'',sum);
          };
          
        } else {
          mapErrorMessageBody1.innerHTML = "There's no HCP near your location";
          mapErrorDiv.style.display = "flex";
        };                                
      };


  
  
      function displayOrigin(origin_latlng, address){
  
        map.setOptions({center:origin_latlng,zoom:13});

        const marker_O_icon_normal = {
          url: 'pics/Placeholder_O.png',
        };

        const marker_O_icon_hover = {
          url: 'pics/Placeholder_O.png',
          scaledSize: new google.maps.Size(50, 50)
        };

        // Display origin location marker & infowindow
        const marker_O = new google.maps.Marker({
          map: map,
          position: origin_latlng,
          zoom:15,
          icon:marker_O_icon_normal
        });
  
        markerArray.push(marker_O);
  
        const infowindow_O = new google.maps.InfoWindow();
  
        infowindow_O.setContent(
        `
        <div id="message_div" style="margin:0; display:flex;flex-direction: column;">
        <p style="margin:0; color: #140065;font-family: Poppins;font-size: 14px;font-style: normal;font-weight: 500;">My current location</p>
        <p style="margin:0; margin-top: 4px;color: #1A73E8;font-family: Poppins;font-size: 12px;font-style: normal;font-weight: 400;">${address}</p>
        </div>
        `);


        marker_O.addListener("mouseover", () => {
          infowindow_O.open(map, marker_O);
          marker_O.setIcon(marker_O_icon_hover);
        }); 
        marker_O.addListener("mouseout", () => {
          infowindow_O.close(map, marker_O);
          marker_O.setIcon(marker_O_icon_normal);
        }); 
      }
  
      function clear() {
        mapContainer.style.display="none";
        zipcodeInput.value="";
        cityInput.value="";
        nameInput.value="";
        distanceFilterSelect.value=50;
        inputZipcodeErrorDiv.style.display="none";
        inputCityErrorDiv.style.display="none";
        inputNameErrorDiv.style.display="none";
        submitErrorDiv.style.display = "none";
        disclosureCheckDiv.classList.remove("error");
        disclosureCheck.checked = false;
        selectedOption = "zipcode";
        zipcodeOptionButton.classList.add("active");
        nameOptionButton.classList.remove("active");
        cityOptionButton.classList.remove("active");
        selectedSpecialty = "derm";
        radioinput_all.checked = false;
        radioinput_derm.checked = true;
        clearmarkers();
      };
  
      function clearmarkers() {
        offLeftPanel();
        for (var i = 0; i < markerArray.length; i++) {
          markerArray[i].setMap(null);
        }
        markerArray = [];
        map.setOptions({center:center,zoom:4});
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
            console.log("geocode status", status)
            if (status === "OK") {
              const geo_result = results;
              resolve(geo_result);
            } else {
              reject("Geocode was not successful for the following reason: " + status);
              inputZipcodeErrorDiv.style.display = "flex";
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
  
      
  
      function HCPDistance(input, locations) {
  
        const originAddress = input;
  
        const promises = [];
        let markerDistance = [];
        let markerLatLng = [];
        let markerHCP = []
  
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
                console.error("calculate distance error:", error);
            });
            promises.push(distancePromise);
          };    
  
            return Promise.all(promises)
              .then(() => {
              // console.log('HCP Distance result', markerLatLng, markerDistance);
              return {hcp:markerHCP, distance: markerDistance, latlng: markerLatLng};
              })
              .catch((error) => {
              console.error("failed to return distance result",error);
              });
      };
  
      function capitalizeFirstLetter(address) {
        // Split the address into words
        const words = address.split(' ');

        // Convert the first letter of each word to uppercase and the rest to lowercase
        const formattedWords = words.map((word) => {
          const lowercaseWord = word.toLowerCase();
          return lowercaseWord.charAt(0).toUpperCase() + lowercaseWord.slice(1);
        });

        // Join the formatted words back into an address string
        const formattedAddress = formattedWords.join(' ');

        return formattedAddress;
      };

      function formatPhoneNumber(number) {
        // Remove all non-digit characters from the number
        const cleanedNumber = number.replace(/\D/g, '');
        
        // Format the number as "(xxx) xxx-xxxx"
        const areaCode = cleanedNumber.slice(0, 3);
        const firstPart = cleanedNumber.slice(3, 6);
        const secondPart = cleanedNumber.slice(6);
        
        return `(${areaCode}) ${firstPart}-${secondPart}`;
      }

    };


    initMap();

    })
  .catch(error => {
    console.error('Error:', error);
  });