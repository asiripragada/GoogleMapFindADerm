// @author: Violet(Yafan) Zeng

fetch('/data')
  .then(response => response.json())
  .then(data => {
    let markerArray = [];

    console.log(data);

    const dataFull = data.filter(row => row["COORDINATES"] !== 'nan');
    console.log("dataFull.length",dataFull.length);

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
      cityOptionButton.value = "City";
      cityOptionButton.classList.add("search-option-button");
      cityOptionButton.name = "searchOption";
      cityOptionButton.id = "cityOption";

      const nameOptionButton = document.createElement("input");
      nameOptionButton.type = "button";
      nameOptionButton.value = "Name";
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

      // Add event listener for keypress validation
      zipcodeInput.addEventListener("keypress", (event) => {
        const key = event.key;

        // Check if the key pressed is a digit
        if (/\D/.test(key)) {
          // Prevent input if the key is not a digit
          event.preventDefault();
        }

        // Limit the input to 5 digits
        if (zipcodeInput.value.length >= 5) {
          event.preventDefault();
        }
      });



      const inputZipcodeErrorDiv = document.createElement("div");
      inputZipcodeErrorDiv.classList.add("input-text-error-div");

      const inputZipcodeErrorImg = document.createElement("img");
      inputZipcodeErrorImg.src = "pics/Danger.png";
      inputZipcodeErrorDiv.appendChild(inputZipcodeErrorImg);

      const inputZipcodeErrorText = document.createElement("span");
      inputZipcodeErrorText.innerHTML = "Please enter a valid zip code";
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
      inputCityErrorText.innerHTML = "Please enter a valid city name";
      inputCityErrorDiv.appendChild(inputCityErrorText);
      inputCityDiv.appendChild(inputCityErrorDiv);

      inputDiv.appendChild(inputCityDiv);

      // Name Div 
      const inputNameDiv = document.createElement("div");
      inputNameDiv.classList.add("input-text-div");

      const inputNameTextDiv = document.createElement("div");
      inputNameTextDiv.classList.add("input-text-span-div");

      const inputNameText = document.createElement("span");
      inputNameText.innerHTML = "Please enter Name:";
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
      inputNameErrorText.innerHTML = "Please enter minimum 3 characters";
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

      let zoomLevel = 14;


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

      const radioOption_all = document.createElement("label");
      radioOption_all.classList.add("specialty-option-input");

      const radioinput_all = document.createElement("input");
      radioinput_all.classList.add("specialty-option-input");
      radioinput_all.type = "checkbox";
      radioinput_all.value = "all";
      radioinput_all.checked = false;

      const radioLabel_all = document.createElement("span");
      radioLabel_all.classList.add("specialty-option-input");
      radioLabel_all.textContent = "All";
      
      radioOption_all.appendChild(radioinput_all);
      radioOption_all.appendChild(radioLabel_all);      
      specialtyInputOptions.appendChild(radioOption_all);

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
        types:['locality']
      };

      const autocomplete_zipcode = new google.maps.places.Autocomplete(zipcodeInput, auto_zipcode_options);
      const autocomplete_city = new google.maps.places.Autocomplete(cityInput, auto_city_options);

      // Set initial option
      let selectedOption = "zipcode";
      inputZipcodeDiv.style.display='flex';
      inputCityDiv.style.display='none';
      inputNameDiv.style.display='none';
      distanceInputDiv.style.display='flex';

      autocomplete_zipcode.addListener("place_changed", () => {
        zipcodeInput.value = extractZipCode(zipcodeInput.value);
      });
      

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
          zoomLevel = 8;
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
          zoomLevel = 12;
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
          zoomLevel = 4;
          console.log("click on", selectedOption);
        }
      });

      // set initial specialty
      let selectedSpecialty = "derm";

      // add event on specialty
      radioOption_all.addEventListener("click", () => {
        if (radioinput_all.checked) {
          selectedSpecialty = "all";
          radioinput_derm.checked = false;
        } else {
          selectedSpecialty = "derm";
          radioinput_derm.checked = true;
        }
      });

      radioOption_derm.addEventListener("click", () => {
        if (radioinput_derm.checked) {
          selectedSpecialty = "derm";
          radioinput_all.checked = false;
        } else {
          selectedSpecialty = "all";
          radioinput_all.checked = true;
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

        clearmarkers();
        
        if (selectedSpecialty=="derm") {
          dataArray = dataFull.filter(row => row["Spec Group"] == "DERM"); 
        } else {
          dataArray = dataFull;
        };

        if(zipcodeOptionButton.classList.contains("active")) {
          if (zipcodeInput.value != "" && disclosureCheck.checked ) {
            zipcodeSearch();  
          } else {
            showError();
          };
        } else if (cityOptionButton.classList.contains("active")){
          if (cityInput.value != "" && disclosureCheck.checked ) {
            citySearch();
          } else {
            showError();
          };
        } else {
          if ( nameInput.value.trim().length>=3 && disclosureCheck.checked ) {
            nameSearch();  
          } else {
            showError();
          };          
        };        
      });

      function showError() {
        if (zipcodeInput.value == "") {
          inputZipcodeErrorDiv.style.display = "flex";
          zipcodeInput.classList.add("error");
        };
        if (cityInput.value == "") {
          inputCityErrorDiv.style.display = "flex";
          cityInput.classList.add("error");
        };
        if (nameInput.value.trim().length < 3) {
          inputNameErrorDiv.style.display = "flex";
          nameInput.classList.add("error");
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
        
        const zipcode = extractZipCode(zipcodeInput.value);
        const selectedDistance = distanceFilterSelect.value;
        console.log("selectedDistance", selectedDistance);

        console.log(zipcode);

        geocodeAddress(zipcodeInput.value)
          .then((geo_result) => {

            // zipcodeInput.readOnly =  true;
            mapContainer.style.display='flex';

            console.log('zipcode geocoding result',geo_result);
            console.log('input zipcode', zipcode);
            
            let origin_latlng = geo_result[0].geometry.location;

            console.log("origin_latlng", origin_latlng.toString())

            displayOrigin(origin_latlng,"Zipcode: "+zipcode);
            
            const addressComponents = geo_result[0].address_components;
            const zipcodeComponent = addressComponents.find(
              (component) => component.types[0] === "postal_code"
            );
            const geoZipcode = zipcodeComponent ? zipcodeComponent.short_name : null;

            console.log('geo zipcode:', geoZipcode);

            const center_geocode = origin_latlng.toString().match(/-?\d+(\.\d+)?/g);
            const center_lat = parseFloat(center_geocode[0]);
            const center_lng = parseFloat(center_geocode[1]);

            if (geoZipcode) {
              const disArray = [];
              const booleanArray = dataArray.map((hcp_location) => {
                const hcp_geocode = JSON.parse(hcp_location.COORDINATES);
                const distance = mathDistance(hcp_geocode.lat, hcp_geocode.lng, center_lat, center_lng);
                if (distance <= selectedDistance) {
                  disArray.push(distance.toFixed(2));
                } else {
                  disArray.push(false);
                }
                return distance <= selectedDistance;
              });
              console.log('booleanArray',booleanArray);
              console.log('disArray',disArray);
              showHCP(zipcodeInput.value, booleanArray, disArray);
            } else {
              mapErrorMessageBody1.innerHTML = "Unable to get zipcode from geocode result"
              mapErrorDiv.style.display="flex";
            };
          })
          .catch((error) => {
          console.error(error);
          });
      };

      function citySearch() {

        const [city, state] = extractCityState(cityInput.value);

        console.log("input city:", city);
        console.log("input state:", state);
          
        geocodeAddress(cityInput.value)
          .then((geo_result) => {

            // cityInput.readOnly =  true;
            mapContainer.style.display='flex';

            console.log('city geocoding result',geo_result);
            console.log('input city', city);

            let origin_latlng = geo_result[0].geometry.location;

            map.setOptions({center:origin_latlng,zoom:zoomLevel});

            const addressComponents = geo_result[0].address_components;
            const stateComponent = addressComponents.find(
              (component) => component.types[0] === "administrative_area_level_1"
            );
            const geoState = stateComponent ? stateComponent.short_name : null;

            const cityComponent = addressComponents.find(
              (component) => component.types[0] === "locality"
            );
            const geoCity = cityComponent ? cityComponent.short_name : null;

            if (geo_result) {
              const booleanArray = 
                dataArray.map((hcp_location) => {
                  const hcpCity = hcp_location.PRIMARY_CITY;
                  const hcpState = hcp_location.PRIMARY_STATE_CODE;
                  try {
                    return hcpCity == geoCity.toUpperCase() && hcpState==geoState.toUpperCase();
                  } catch (error) {
                    return false;
                  };
                });
              console.log('booleanArray',booleanArray);
              showHCP("", booleanArray,"Infinity");
            } else {
              mapErrorMessageBody1.innerHTML = "Unable to get city from geocode result"
              mapErrorDiv.style.display="flex";
            };
          })
          .catch((error) => {
          console.error(error);
          });
      };

      function nameSearch() {

        const name = nameInput.value.trim().toUpperCase();

        mapContainer.style.display='flex';

        const booleanArray =
          dataArray.map((hcp_location) => {
            const hcpName = hcp_location.FULL_NAME;
            try {
              return hcpName.includes(name);
            } catch (error) {
              return false;
            };
          });
        console.log('booleanArray',booleanArray);
        showHCP("", booleanArray,"Infinity");
      };

      
      function displayHCP(input, pairedArray, sum) {

        // Define the number of items per page
        const itemsPerPage = 50;

        // Calculate the total number of pages needed
        const totalPages = Math.ceil(pairedArray.length / itemsPerPage);

        // Set the initial page to 1
        let currentPage = 1;

        onLeftPanel();
        origin_center = map.getCenter();
        
        const HCPHeaderElement = document.createElement("div");
        HCPHeaderElement.innerHTML = "Search Results (" + sum + ")" ;
        HCPHeaderElement.classList.add("HCP-header");
        leftPanel.appendChild(HCPHeaderElement);

        // Create a container for the pagination buttons
        const paginationContainer = document.createElement('div');
        paginationContainer.classList.add('pagination-container');
        leftPanel.appendChild(paginationContainer);

        const HCPContentElement = document.createElement("div");
        HCPContentElement.id = "leftPanelContent";
        HCPContentElement.classList.add("HCP-content");

        let hcpMakerArray = [];
        let activeMarker = null;
        let activeInfowindow = null;
        let activeHCPCardElement = null;
        let activehcp_clicked = null;

        leftPanel.appendChild(HCPContentElement);
      
        // Display the initial page
        displayPage(currentPage);


        // Update the page numbers initially
        updatePageNumbers();

        function displayPage(pageNumber) {


          // Clear the HCPContentElement before displaying new cards
          HCPContentElement.innerHTML = '';

          for (var i = 0; i < hcpMakerArray.length; i++) {
            hcpMakerArray[i].setMap(null);
          };

          hcpMakerArray = [];

          const shape = {
            coords: [1, 1, 1, 8, 6, 8, 6, 1],
            type: "poly",
          };
  
          // Calculate the start and end index for the current page
          const startIndex = (pageNumber - 1) * itemsPerPage;
          const endIndex = Math.min(startIndex + itemsPerPage, pairedArray.length);

          if (selectedOption == "zipcode") {
            let dis_page = pairedArray[endIndex-1].distance;

            if (dis_page < 1.5) {
              zoomLevel = 14;
            } else if (dis_page < 3) {
              zoomLevel = 13;
            } else if (dis_page < 5) {
              zoomLevel = 12;
            } else if (dis_page < 10) {
              zoomLevel = 11;
            } else if (dis_page < 20) {
              zoomLevel = 10;
            } else if (dis_page < 50) {
              zoomLevel = 9;
            } else {
              zoomLevel = 8;
            }
            map.setOptions({ center: origin_center, zoom: zoomLevel });
          };

          let currentZIndex = 1;

          for (let i = startIndex; i < endIndex; i++) {
  
            let hcp = pairedArray[i].hcp;
            let dis = '';
            let number = i+1;
  
            if (selectedOption == "zipcode") {
              dis = pairedArray[i].distance
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
            hcpMakerArray.push(marker_hcp);
  
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

            let numberWidth = 18;

            if (i >= 100) {
              numberWidth = HCPNumber.offsetWidth + 4;
            };

            // Set the width and height of the div based on the text width
            HCPNumberDiv.style.width = numberWidth + "px";
            HCPNumberDiv.style.height = numberWidth + "px";
  
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
              
  
              // add distance 
              HCPDetail_Route_dis.innerHTML = dis + ' miles';
              HCPDetail_Route.appendChild(routeIcon);
              HCPDetail_Route.appendChild(HCPDetail_Route_dis);
            };
            
  
            HCPDetailDiv_1.appendChild(HCPDetail_Route);
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
  
            const cardHeight = window.getComputedStyle(HCPDetailDiv).height;
  
            let HCPCardtab = document.createElement("div");
            HCPCardtab.classList.add("HCP-card-tab");
            HCPCardtab.style.height = cardHeight+10;
  
            HCPCardElement.appendChild(HCPCardtab);
  
  
            if (selectedOption == "zipcode") {
              infowindow_hcp.setContent(`
                  <p style="margin:0; color: #140065; font-family: Poppins; font-size: 16px; font-weight: 500;">${hcp_name}</p>
                  <div id="info_div_1" style="margin:0; margin-right:0px; display:flex;flex-direction: row;align-items: center;justify-content: space-between;">
                    <p style="margin:0;  color: #D200E6;font-family: Poppins;font-size: 12px;font-style: normal;font-weight: 400;">${hcp_specialty}</p>
                    <a href="${hcp_call}" style="margin-left:22px">
                      <img style="width: 30px;height: 30px;" src="pics/call.png"></img>
                    </a>
                  </div>
                  <hr style="width: 95%; margin:0; margin-top: 5px; border-top: 0.7px solid #929292;"></hr>
                  <p style="margin:0; margin-top: 5px; max-width:300px; color: #0374BB;font-family: Poppins;font-size: 12px;font-style: normal;font-weight: 400;">${hcp_address + ", " + hcp_city}</p>
                  <div id="info_div" style="margin:0; margin-right:0px; display:flex;flex-direction: row;align-items: center;justify-content: space-between;">
                    <div id="distance" style="magin:0;display:flex;flex-direction: row;align-items: center;">
                      <img style="width: 15px;height: 15px;" src="pics/Distance.png"></img>
                      <span style="margin-left:10px;color: #929292; font-family: Poppins;font-size: 12px;font-style: normal;font-weight: 400;">${dis + ' miles'}</span>
                    </div>
                  </div>
              `);
            } else {
              infowindow_hcp.setContent(`
                <p style="margin:0; color: #140065; font-family: Poppins; font-size: 16px; font-weight: 500;">${hcp_name}</p>
                <div id="info_div_1" style="margin:0; margin-right:0px; display:flex;flex-direction: row;align-items: center;justify-content: space-between;">
                  <p style="margin:0;  color: #D200E6;font-family: Poppins;font-size: 12px;font-style: normal;font-weight: 400;">${hcp_specialty}</p>
                  <a href="${hcp_call}" style="margin-left:22px">
                    <img style="width: 30px;height: 30px;" src="pics/call.png"></img>
                  </a>
                </div>
                <hr style="width: 95%; margin:0; margin-top: 5px; border-top: 0.7px solid #929292;"></hr>
                <p style="margin:0; margin-top: 5px; max-width:300px;color: #0374BB;font-family: Poppins;font-size: 12px;font-style: normal;font-weight: 400;">${hcp_address + ", " + hcp_city}</p>
              `);
            };

            let hcp_clicked = false;
            let elementTop = HCPCardElement.offsetTop;
  
            function activeHCP(marker_hcp, infowindow_hcp, HCPCardElement) {
              marker_hcp.setIcon(marker_hcp_icon_hover);
              addClassToAllChildren(HCPCardElement,"active");
              infowindow_hcp.setZIndex(currentZIndex);
              currentZIndex++;
              infowindow_hcp.open(map, marker_hcp);
            }
            
            function deactiveHCP(marker_hcp, infowindow_hcp, HCPCardElement) {
              marker_hcp.setIcon(marker_hcp_icon_normal);
              removeClassToAllChildren(HCPCardElement,"active");
              infowindow_hcp.close();
            }
  
            marker_hcp.addListener("mouseover", () => {
              if (!hcp_clicked || marker_hcp !== activeMarker) {
                activeHCP(marker_hcp, infowindow_hcp, HCPCardElement);
                HCPContentElement.scrollTop = elementTop - 50;
              }
            });
            
            marker_hcp.addListener("mouseout", () => {
              if (!hcp_clicked || marker_hcp !== activeMarker) {
                deactiveHCP(marker_hcp, infowindow_hcp, HCPCardElement);
              }
            });


            marker_hcp.addListener("click", () => {
              if (activeMarker && activeMarker !== marker_hcp) {
                // Deactivate the previously clicked marker and infowindow
                deactiveHCP(activeMarker, activeInfowindow, activeHCPCardElement);
                activehcp_clicked = false;
              }
          
              if (activeMarker === marker_hcp) {
                // Clicked on the already active marker, so deactivate it
                hcp_clicked = false;
                activeMarker = null;
                activeInfowindow = null;
                activeHCPCardElement = null;
                marker_hcp.setIcon(marker_hcp_icon_normal);
                deactiveHCP(marker_hcp, infowindow_hcp, HCPCardElement);
                map.setOptions({ center: origin_center, zoom: zoomLevel });
                HCPContentElement.scrollTop = elementTop - 50;
              } else {
                // Clicked on a new marker, activate it
                hcp_clicked = true;
                activeMarker = marker_hcp;
                activeInfowindow = infowindow_hcp;
                activeHCPCardElement = HCPCardElement;
                infowindow_hcp.open(map, marker_hcp);
                marker_hcp.setIcon(marker_hcp_icon_hover);
                activeHCP(marker_hcp, infowindow_hcp, HCPCardElement);
                map.setOptions({ center: marker_hcp.getPosition(), zoom: 15 });
              }
            });
  
            infowindow_hcp.addListener("closeclick", () => {
              hcp_clicked = false;
              marker_hcp.setIcon(marker_hcp_icon_normal);
              deactiveHCP(marker_hcp, infowindow_hcp, HCPCardElement);
              map.setOptions({ center: origin_center, zoom: zoomLevel });
            });
  
            HCPCardElement.addEventListener("mouseover", () => {
              if (!hcp_clicked || marker_hcp !== activeMarker) {
                activeHCP(marker_hcp, infowindow_hcp, HCPCardElement);
              }
            });
            
            HCPCardElement.addEventListener("mouseout", () => {
              if (!hcp_clicked || marker_hcp !== activeMarker) {
                deactiveHCP(marker_hcp, infowindow_hcp, HCPCardElement);
              }
            });
            

            HCPCardElement.addEventListener("click", () => {
              if (activeMarker && activeMarker !== marker_hcp) {
                // Deactivate the previously clicked marker and infowindow
                deactiveHCP(activeMarker, activeInfowindow, activeHCPCardElement);
                activehcp_clicked = false;
              }
          
              if (activeMarker === marker_hcp) {
                // Clicked on the already active marker, so deactivate it
                hcp_clicked = false;
                activeMarker = null;
                activeInfowindow = null;
                activeHCPCardElement = null;
                activehcp_clicked = null;
                marker_hcp.setIcon(marker_hcp_icon_normal);
                deactiveHCP(marker_hcp, infowindow_hcp, HCPCardElement);
                map.setOptions({ center: origin_center, zoom: zoomLevel });
                HCPContentElement.scrollTop = elementTop - 50;
              } else {
                // Clicked on a new marker, activate it
                hcp_clicked = true;
                activeMarker = marker_hcp;
                activeInfowindow = infowindow_hcp;
                activeHCPCardElement = HCPCardElement;
                activehcp_clicked = hcp_clicked;
                infowindow_hcp.open(map, marker_hcp);
                marker_hcp.setIcon(marker_hcp_icon_hover);
                activeHCP(marker_hcp, infowindow_hcp, HCPCardElement);
                map.setOptions({ center: marker_hcp.getPosition(), zoom: 15 });
              }
            });
            
          };
        };
          
        // Function to handle page number click
        function showPage(pageNumber) {
          if (pageNumber >= 1 && pageNumber <= totalPages) {
            currentPage = pageNumber;
            displayPage(currentPage);
            updatePageNumbers();
          }
        };
  
        function updatePageNumbers() {
          // Clear existing page number buttons
          paginationContainer.innerHTML = '';
        
          // Calculate the range of page numbers to display
          let startPage, endPage;
          if (totalPages <= 5) {
            startPage = 1;
            endPage = totalPages;
          } else {
            if (currentPage <= 3) {
              startPage = 1;
              endPage = 5;
            } else if (currentPage + 1 >= totalPages) {
              startPage = totalPages - 4;
              endPage = totalPages;
            } else {
              startPage = currentPage - 2;
              endPage = currentPage + 2;
            }
          }
        
          // Create page number buttons
          if (currentPage > 1) {
            const prevPageButton = document.createElement('button');
            prevPageButton.textContent = '<';
            prevPageButton.addEventListener('click', () => showPage(currentPage - 1));
            paginationContainer.appendChild(prevPageButton);
          }
        
          for (let i = startPage; i <= endPage; i++) {
            const pageNumberButton = document.createElement('button');
            pageNumberButton.textContent = i;
            pageNumberButton.addEventListener('click', () => showPage(i));
            if (i === currentPage) {
              pageNumberButton.classList.add('active');
            }
            paginationContainer.appendChild(pageNumberButton);
          }
        
          if (currentPage < totalPages) {
            const nextPageButton = document.createElement('button');
            nextPageButton.textContent = '>';
            nextPageButton.addEventListener('click', () => showPage(currentPage + 1));
            paginationContainer.appendChild(nextPageButton);
          }
        }
        
      };  

      function showHCP(input, booleanArray, disArray) {

        const sum = booleanArray.reduce((accumulator, currentValue) => accumulator + Number(currentValue), 0);
    
        if (sum !== 0) {
          // Filter HCPs array
          const filteredArray = dataArray.filter((_, index) => Boolean(booleanArray[index])); 
  
          let pairedArray = [];
          if (selectedOption == "zipcode") {
            const filteredDisArray = disArray.filter((_, index) => Boolean(booleanArray[index]));
            pairedArray = filteredArray.map((hcp, index) => ({
              hcp: hcp,
              distance: filteredDisArray[index]
            }));

            pairedArray.sort((a, b) => {
              // Compare based on "distance" first
              if (a.distance !== b.distance) {
                return a.distance - b.distance;
              }
            
              // If "distance" is the same, compare based on "hcp.FIRST_NAME"
              const firstNameA = a.hcp.FIRST_NAME.toUpperCase();
              const firstNameB = b.hcp.FIRST_NAME.toUpperCase();
              if (firstNameA < firstNameB) {
                return -1;
              }
              if (firstNameA > firstNameB) {
                return 1;
              }
              return 0;
            });

            console.log(pairedArray);

          } else {
            pairedArray = filteredArray.map((hcp, index) => ({
              hcp: hcp
            }));
          }

          displayHCP(input, pairedArray, sum);    

        } else {
          mapErrorMessageBody1.innerHTML = "There's no HCP matches your input";
          mapErrorDiv.style.display = "flex";
        };                                
      };


  
  
      function displayOrigin(origin_latlng, address){

        map.setOptions({center:origin_latlng,zoom:zoomLevel});

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

        const center_geocode = marker_O.getPosition();
        console.log("center_geocode",center_geocode);
  
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

      };

      function setDefault() {
        disclosureCheck.checked = false;
        // selectedOption = "zipcode";
        // zipcodeOptionButton.classList.add("active");
        // nameOptionButton.classList.remove("active");
        // cityOptionButton.classList.remove("active");
        // inputZipcodeDiv.style.display='flex';
        // inputCityDiv.style.display='none';
        // inputNameDiv.style.display='none';
        // distanceInputDiv.style.display='flex';
        selectedSpecialty = "derm";
        radioinput_all.checked = false;
        radioinput_derm.checked = true;
        // zipcodeInput.readOnly =  false;
        // cityInput.readOnly =  false;
        // nameInput.readOnly =  false;
      };
  
      function clear() {
        mapContainer.style.display="none";
        zipcodeInput.value="";
        cityInput.value="";
        nameInput.value="";
        distanceFilterSelect.value=50;
        setDefault();
        clearmarkers();
      };
  
      function clearmarkers() {
        inputZipcodeErrorDiv.style.display="none";
        inputCityErrorDiv.style.display="none";
        inputNameErrorDiv.style.display="none";
        zipcodeInput.classList.remove("error");
        cityInput.classList.remove("error");
        nameInput.classList.remove("error");
        submitErrorDiv.style.display = "none";
        disclosureCheckDiv.classList.remove("error");
        mapErrorMessageBody1.innerHTML = "We were not able find a match"
        mapErrorDiv.style.display="none";
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
              zipcodeInput.classList.add("error");
              inputCityErrorDiv.style.display = "flex";
              cityInput.classList.add("error");
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

      function extractCityState(address) {

        const length = address.split(",").length;
        if (length == 2) {
          const state = address.split(",")[0].trim().toUpperCase();
          return ["all", state]
        // } else if (length == 3) {
        //   const city = address.split(",")[0].trim().toUpperCase();
        //   const state = address.split(',')[1].trim().toUpperCase();
        //   return [city, state]
        } else {
          const city = address;
          return [city, "none"];
        }
        
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
      };

      function mathDistance(lat1, lon1, lat2, lon2) {
        const R = 3958.8; // Radius of the Earth in miles
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
      };
  
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

      function addClassToAllChildren(element, className) {
        // Add the class to the current element
        element.classList.add(className);
      
        // Get the child elements
        const children = element.children;
      
        // Recursively add the class to each child element
        for (let i = 0; i < children.length; i++) {
          addClassToAllChildren(children[i], className);
        }
      }

      function removeClassToAllChildren(element, className) {
        // Add the class to the current element
        element.classList.remove(className);
      
        // Get the child elements
        const children = element.children;
      
        // Recursively add the class to each child element
        for (let i = 0; i < children.length; i++) {
          removeClassToAllChildren(children[i], className);
        }
      }
    };


    initMap();

    })
  .catch(error => {
    console.error('Error:', error);
  });