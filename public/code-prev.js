// @author: Violet(Yafan) Zeng

fetch('/data')
  .then(response => response.json())
  .then(data => {
    let markerArray = [];

    console.log(data);

    const dataArray = data.filter(row => row["COORDINATES"] !== 'nan');
    console.log("dataArray.length",dataArray.length);

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

      const addressOptionButton = document.createElement("input");
      addressOptionButton.type = "button";
      addressOptionButton.value = "Current Address";
      addressOptionButton.classList.add("search-option-button");
      addressOptionButton.name = "searchOption";
      addressOptionButton.id = "addressOption";

      const cityOptionButton = document.createElement("input");
      cityOptionButton.type = "button";
      cityOptionButton.value = "City/HCP Name";
      cityOptionButton.classList.add("search-option-button");
      cityOptionButton.name = "searchOption";
      cityOptionButton.id = "cityOption";

      searchOptions.appendChild(zipcodeOptionButton);
      searchOptions.appendChild(addressOptionButton);
      searchOptions.appendChild(cityOptionButton);

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
      inputCityText.innerHTML = "Please enter City Name:";
      inputCityTextDiv.appendChild(inputCityText);
      inputCityDiv.appendChild(inputCityTextDiv);

      const cityInput = document.createElement("input");
      cityInput.classList.add("input-text-input");
      cityInput.type = "text";
      cityInput.placeholder = "Enter a city";
      inputCityDiv.appendChild(cityInput);

      const inputCityErrorDiv = document.createElement("div");
      inputCityErrorDiv.classList.add("input-text-error-div");

      const inputCityErrorImg = document.createElement("img");
      inputCityErrorImg.src = "pics/Danger.png";
      inputCityErrorDiv.appendChild(inputCityErrorImg);

      const inputCityErrorText = document.createElement("span");
      inputCityErrorText.innerHTML = "Invalid City Name";
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

      const submitErrorDiv = document.createElement("div");
      submitErrorDiv.id = "submit-error-div";

      const submitErrorText = document.createElement("span");
      submitErrorText.innerHTML = "Please fill in all the mandatory details";
      submitErrorDiv.appendChild(submitErrorText);

      searchDiv.appendChild(submitErrorDiv);

      const clearButton = document.createElement("input");
      clearButton.type = "button";
      clearButton.value = "Clear";
      clearButton.id = "clear-button";
      searchDiv.appendChild(clearButton);

      controlPanel.appendChild(searchDiv);
      
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
          addressOptionButton.classList.remove("active");
          cityOptionButton.classList.remove("active");
          selectedOption = "zipcode";
          autocomplete_zipcode.getPlace();
          console.log("click on", selectedOption);
        }
      });

      addressOptionButton.addEventListener("click", () => {
        if (!addressOptionButton.classList.contains("active")) {
          clear();
          inputZipcodeDiv.style.display='none';
          inputCityDiv.style.display='none';
          inputNameDiv.style.display='none';
          distanceInputDiv.style.display='flex';
          addressOptionButton.classList.add("active");
          zipcodeOptionButton.classList.remove("active");
          cityOptionButton.classList.remove("active");
          selectedOption = "address";
          console.log("click on", selectedOption);
        }
      });
      
      cityOptionButton.addEventListener("click", () => {
        if (!cityOptionButton.classList.contains("active")) {
          clear();
          inputZipcodeDiv.style.display='none';
          inputCityDiv.style.display='flex';
          inputNameDiv.style.display='flex';
          distanceInputDiv.style.display='none';
          cityOptionButton.classList.add("active");
          addressOptionButton.classList.remove("active");
          zipcodeOptionButton.classList.remove("active");
          selectedOption = "city";
          autocomplete_city.getPlace();
          console.log("click on", selectedOption);
        }
      });

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

      submitButton.addEventListener("click", () => {        
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
        map.setCenter(center);
        inputText.value='';
      });  

      function zipcodeSearch(){

        clearmarkers();
        
        
        const zipcode = extractZipCode(zipcodeInput.value);
        const selectedDistance = distanceFilterSelect.value;
        console.log("selectedDistance", selectedDistance);

        if (zipcode) {
          geocodeAddress(zipcode)
            .then(async (geo_result) => {

              mapViewContainer.style.display='flex';

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
                const booleanArray = await Promise.all(
                  dataArray.map((hcp_location) => {
                      const hcpZipcode = hcp_location.PRIMARY_ZIP_CODE;
                      try {
                        return hcpZipcode == geoZipcode;
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
            inputZipcodeErrorDiv.style.display = "flex";
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
              // document.getElementById("map").style.display='block';
              document.getElementById("map-shield").style.display='none';

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

      function displayHCP(final_hcps,final_distances) {

        console.log('final_hcps:',final_hcps);
        console.log('final_distances:',final_distances);

        const shape = {
          coords: [1, 1, 1, 8, 6, 8, 6, 1],
          type: "poly",
        };

        onLeftPanel();
        origin_center = map.getCenter();
        
        const HCPHeaderElement = document.createElement("div");
        HCPHeaderElement.innerHTML = 'Search Results';
        HCPHeaderElement.classList.add("HCP-header");
        leftPanel.appendChild(HCPHeaderElement);

        const HCPContentElement = document.createElement("div");
        HCPContentElement.id = "leftPanelContent";
        HCPContentElement.classList.add("HCP-content");

        for (let i = 0; i < final_hcps.length; i++){

          let hcp = final_hcps[i]
          let dis = '';
          let number = i+1;

          if (selectedOption == "city") {
            dis = '';
          } else {
            dis = final_distances[i]
          };

          console.log('dis', dis);

          let pos = JSON.parse(hcp.COORDINATES)

          const marker_hcp_icon_normal = {
            path: MAP_PIN,
            fillColor: '#1a73e8',
            fillOpacity: 1,
            strokeColor: '#000000',
            strokeWeight: 2,
            scale: 0.5,
            labelOrigin: new google.maps.Point(0, -30)
          };

          const marker_hcp_icon_hover = {
            path: MAP_PIN,
            fillColor: '#1a73e8',
            fillOpacity: 1,
            strokeColor: '#000000',
            strokeWeight: 2,
            scale: 0.7,
            labelOrigin: new google.maps.Point(0, -30)
          };

          let marker_hcp = new google.maps.Marker({
              position: pos,
              map: map,
              shape: shape,
              icon:marker_hcp_icon_normal,
              label:{
                text: number+"", 
                fontWeight: "bold",
                fontSize:"16px",
                color:"white"
              }
          });
          markerArray.push(marker_hcp);

          let hcp_name = capitalizeFirstLetter(hcp.FIRST_NAME) + " " + capitalizeFirstLetter(hcp.LAST_NAME);
          let hcp_address = capitalizeFirstLetter(hcp.ADDRESS_LINE_1) + " " + capitalizeFirstLetter(hcp.ADDRESS_LINE_2);
          let hcp_city = capitalizeFirstLetter(hcp.CITY_NAME);
          let hcp_email = "example@example.com";
          // let hcp_phone = "+1234567890"; "tel:"+hcp_phone

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

          let HCPNumberElement = document.createElement("div");
          HCPNumberElement.classList.add("HCP-number-div");
          HCPNumberElement.innerHTML = number;

          HCPCardElement.appendChild(HCPNumberElement);

          let HCPDetailElement = document.createElement("div");
          HCPDetailElement.classList.add("HCP-detail-div");

          let HCPDetail_Name = document.createElement("h4");
          HCPDetail_Name.classList.add("HCP-detail-name");
          HCPDetail_Name.innerHTML = 'Dr. ' + hcp_name;
          
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

          let HCPContactElement = document.createElement("div");
          HCPContactElement.classList.add("HCP-contact-div");

          const HCPDetail_Email = document.createElement("a");
          HCPDetail_Email.classList.add("HCP-detail-icons");
          HCPDetail_Email.href = "mailto:" + hcp_email;

          const emailIcon = document.createElement("img");
          
          emailIcon.src = "pics/call.png"; // Replace with the path to your direction icon image
          emailIcon.alt = "Send Email";
          HCPDetail_Email.appendChild(emailIcon);

          HCPContactElement.appendChild(HCPDetail_Email);


          if (selectedOption != "city") {
            let HCPDetail_line = document.createElement("hr");
            HCPDetail_line.classList.add("HCP-detail-line");
            HCPDetailElement.appendChild(HCPDetail_line);

            let HCPDetail_Route = document.createElement("div");
            HCPDetail_Route.classList.add("HCP-detail-route");
            let HCPDetail_Distance = document.createElement("span");
            HCPDetail_Distance.classList.add("HCP-detail-dis");
            HCPDetail_Distance.innerHTML = dis + ' miles&nbsp;&nbsp;&nbsp;';
            HCPDetail_Route.appendChild(HCPDetail_Distance);

            HCPDetailElement.appendChild(HCPDetail_Route);

            // if (selectedOption == 'address') {
            if (selectedOption != 'city') {
              // Encode the addresses for URL compatibility
              let encodedOrigin = encodeURIComponent(inputText.value);
              let encodedDestination = encodeURIComponent(hcp.FULL_ADDRESS);
              // Create the Google Maps URL with the encoded addresses
              let googleMapsURL = `https://www.google.com/maps/dir/${encodedOrigin}/${encodedDestination}`;
  
              const HCPDetail_Direction = document.createElement("a");
              HCPDetail_Direction.classList.add("HCP-detail-icons");
              HCPDetail_Direction.href = googleMapsURL;
              HCPDetail_Direction.target = "_blank"; // Open in a new tab
  
              const directionIcon = document.createElement("img");
              directionIcon.src = "pics/navigate.png"; 
              directionIcon.alt = "Get Directions";
              // directionIcon.height = 40;
              // directionIcon.width = 40;
              HCPDetail_Direction.appendChild(directionIcon);
              
              HCPContactElement.appendChild(HCPDetail_Direction);

              HCPCardElement.appendChild(HCPContactElement);
            };
          };

          HCPCardElement.appendChild(HCPDetailElement);

          let HCPCardtab = document.createElement("div");
          HCPCardtab.classList.add("HCP-card-tab");
          HCPCardElement.appendChild(HCPCardtab);

          HCPContentElement.appendChild(HCPCardElement);

          let clicked = false;
          let elementTop = HCPCardElement.offsetTop;

          marker_hcp.addListener("mouseover", () => {
            if (!clicked) {
              infowindow_hcp.open(map, marker_hcp);
              marker_hcp.setIcon(marker_hcp_icon_hover);
              HCPCardElement.classList.add("active");
              HCPContentElement.scrollTop = elementTop-50;
            }
          });
          
          marker_hcp.addListener("mouseout", () => {
            if (!clicked) {
              infowindow_hcp.close();
              marker_hcp.setIcon(marker_hcp_icon_normal);
              HCPCardElement.classList.remove("active");
            }
          });
          
          marker_hcp.addListener("click", () => {
            if (clicked) {
              clicked = false;
              infowindow_hcp.close();
              marker_hcp.setIcon(marker_hcp_icon_normal);
              HCPCardElement.classList.remove("active");
              map.setOptions({ center: origin_center, zoom: 13 });
              HCPContentElement.scrollTop = elementTop-50;
            } else {
              clicked = true;
              infowindow_hcp.open(map, marker_hcp);
              marker_hcp.setIcon(marker_hcp_icon_hover);
              HCPCardElement.classList.add("active");
              map.setOptions({ center: marker_hcp.getPosition(), zoom: 15 });
            }
          });

          infowindow_hcp.addListener("closeclick", () => {
            clicked = false;
            marker_hcp.setIcon(marker_hcp_icon_normal);
            HCPCardElement.classList.remove("active");
            map.setOptions({ center: origin_center, zoom: 13 });
          });

          HCPCardElement.addEventListener("mouseover", () => {
            if (!clicked) {
              infowindow_hcp.open(map, marker_hcp);
              marker_hcp.setIcon(marker_hcp_icon_hover);
              HCPCardElement.classList.add("active");
            }
          });
          
          HCPCardElement.addEventListener("mouseout", () => {
            if (!clicked) {
              infowindow_hcp.close();
              marker_hcp.setIcon(marker_hcp_icon_normal);
              HCPCardElement.classList.remove("active");
            }
          });
          
          HCPCardElement.addEventListener("click", () => {
            if (clicked) {
              clicked = false;
              infowindow_hcp.close();
              marker_hcp.setIcon(marker_hcp_icon_normal);
              HCPCardElement.classList.remove("active");
              map.setOptions({ center: origin_center, zoom: 13 });
            } else {
              clicked = true;
              infowindow_hcp.open(map, marker_hcp);
              marker_hcp.setIcon(marker_hcp_icon_hover);
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
        addressOptionButton.classList.remove("active");
        cityOptionButton.classList.remove("active");

        clearmarkers();

        // offLeftPanel();
        // map.setOptions({center:center,zoom:4});
        // document.getElementById("map-shield").style.display='block';
        // controlPanel.classList.remove("error");
        // mapErrorMessageBody1.innerHTML = "We were not able find a match";
        // mapErrorDiv.style.display = "none";
        // distanceSlider.value = 3;
        // inputText.value="";
        // nameInput.value="";
        // inputText.classList.remove("error");
        // nameInput.classList.remove("error");
        // sumbitIcon.src = "pics/Search.png";
        // inputPanel.classList.remove("error");
        // clearmarkers();
        // 
      };
  
      function clearmarkers() {
        offLeftPanel();
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