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
    const mapHeader = document.getElementById('map-header');
    const mapElement = document.getElementById("map");

    function onLeftPanel() {
      mapViewContainer.classList.remove("left-panel-hidden");
      leftPanel.style.display = "flex";
      leftPanel.innerHTML = "";      
    }

    function offLeftPanel() {
      mapViewContainer.classList.add("left-panel-hidden");
      leftPanel.style.display = "none";
      leftPanel.innerHTML = "";
      mapHeader.innerHTML = "";
    }

    function isMobileView() {
      return window.innerWidth < 768; // Change the threshold to match your mobile view breakpoint
    }

    function initMap() {
      
      // Default map
      const center = { lat: 37.0902, lng: -95.7129 }; // Center coordinates (US)

      const map = new google.maps.Map(document.getElementById("map"), {
          zoom: 4,
          center: center,
          streetViewControl: false,
          mapTypeControl:false,
          fullscreenControl: true
      });

      // map.style.height = window.innerWidth + "px";

      // Hide the loading sign
      document.getElementById("loading-sign").style.display = "none";
      document.getElementById("container").style.display = "flex";


      // Search Input Div
      const controlPanel = document.getElementById("control-panel");

      // Search Options Div (zipcode, city&hcp, current location)

      const zipcodeOptionButton = document.getElementById("zipcodeOption");

      const cityOptionButton = document.getElementById("cityOption");

      const nameOptionButton = document.getElementById("nameOption");

      // Inputs Div (zipcode/city, name, distance)

      // Name Div 
      const inputNameDiv = document.getElementById("input-text-name-div");

      const nameInput = document.getElementById("name-input");

      const inputNameErrorDiv = document.getElementById("name-error-div");

      // Zipcode Div 
      const inputZipcodeDiv = document.getElementById("input-text-zipcode-div");

      const inputZipcodeText = document.getElementById("input-text-zipcode-span")

      const zipcodeInput = document.getElementById("zipcode-input");

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

      const inputZipcodeErrorDiv = document.getElementById("zipcode-error-div");

      // City Div 
      const inputCityDiv = document.getElementById("input-text-city-div");

      const cityInput = document.getElementById("city-input");

      const inputCityErrorDiv = document.getElementById("city-error-div");

      // Distance Div
      const distanceInputDiv = document.getElementById("distance-input-div");

      const distanceFilterSelect = document.getElementById("distance-filter-select");

      distanceFilterSelect.value = 50;

      let zoomLevel = 14;

      // Specialty Options

      const radioOption_derm = document.getElementById("derm-label");

      const radioinput_derm = document.getElementById("derm-input-check");
      radioinput_derm.checked = true;

      const radioOption_all = document.getElementById("all-label");

      const radioinput_all = document.getElementById("all-input-check");
      radioinput_all.checked = false;

      // Disclosure Div (zipcode/city, name, distance)


      const disclosureCheckDiv = document.getElementById("disclosure-check-div");

      const disclosureCheck = document.getElementById("disclosure-input");
      disclosureCheck.checked = false;

      disclosureCheck.addEventListener("click", () => {
        disclosureCheckDiv.classList.remove("error");
      });

      // Search & Clear Div

      // Search button
      const submitButton = document.getElementById("submit-button");

      const clearButton = document.getElementById("clear-button");

      const submitErrorDiv = document.getElementById("submit-error-div");
      
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
          inputZipcodeText.innerHTML = "Please enter Zip Code:";
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
          inputZipcodeDiv.style.display='flex';
          inputZipcodeText.innerHTML = "Please enter Zip Code (optional):";
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
              showHCP("", booleanArray,"");
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
        const zipcode = extractZipCode(zipcodeInput.value);

        let booleanArray = [];
        if (zipcode){
          geocodeAddress(zipcodeInput.value)
            .then((geo_result) => {
              mapContainer.style.display='flex';
              let origin_latlng = geo_result[0].geometry.location;

              zoomLevel = 11;
              map.setOptions({center:origin_latlng,zoom:zoomLevel});

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
                const booleanArray = 
                  dataArray.map((hcp_location) => {
                      const hcpName = hcp_location.FULL_NAME;
                      const hcpZipcode = hcp_location.PRIMARY_ZIP_CODE;
                      const hcp_geocode = JSON.parse(hcp_location.COORDINATES);
                      const distance = mathDistance(hcp_geocode.lat, hcp_geocode.lng, center_lat, center_lng);
                      if (hcpZipcode == geoZipcode && hcpName.includes(name)) {
                        disArray.push(distance.toFixed(2));
                      } else {
                        disArray.push(false);
                      };
                      return (hcpZipcode == geoZipcode && hcpName.includes(name))
                    })
                  console.log('booleanArray',booleanArray);
                  showHCP("", booleanArray,disArray);
                } else {
                  mapErrorMessageBody1.innerHTML = "Unable to get city from geocode result"
                  mapErrorDiv.style.display="flex";
                };
            }).catch((error) => {
              console.log(error);
            });
        }else {
          zoomLevel=4;
          mapContainer.style.display='flex';
          booleanArray =
            dataArray.map((hcp_location) => {
              const hcpName = hcp_location.FULL_NAME;
              try {
                return hcpName.includes(name);
              } catch (error) {
                return false;
              };
            });
          showHCP("", booleanArray,"");
        }
      };

      
      function displayHCP(input, pairedArray, sum) {

        // Define the number of items per page
        let itemsPerPage = 50;

        if (isMobileView()) {
          itemsPerPage = 25; // Change to the mobile value (25 in this case)
        }


        // Calculate the total number of pages needed
        const totalPages = Math.ceil(pairedArray.length / itemsPerPage);

        // Set the initial page to 1
        let currentPage = 1;

        onLeftPanel();
        origin_center = map.getCenter();
        
        const HCPHeaderElement = document.createElement("div");

        HCPHeaderElement.innerHTML = "<strong> Search Results </strong>(" + sum + ")" ;
        HCPHeaderElement.classList.add("HCP-header");
        

        // Create a container for the pagination buttons
        const paginationContainer = document.createElement('div');
        paginationContainer.classList.add('pagination-container');

        if (isMobileView()) {
          mapHeader.appendChild(HCPHeaderElement);
          mapHeader.appendChild(paginationContainer);
        } else {
          leftPanel.appendChild(HCPHeaderElement);
          leftPanel.appendChild(paginationContainer);
        };

      
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

          if (pairedArray[0].distance) {
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
  
            if (pairedArray[0].distance) {
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
  
            if (pairedArray[0].distance) {
  
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

            if (isMobileView()) {
              HCPDetail_Address_city.style.display="none";
              HCPDetail_Address_street.innerHTML = hcp_address + ", " +hcp_city + ", " + hcp.PRIMARY_STATE_CODE + " " + hcp.PRIMARY_ZIP_CODE;
            }
  
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
            const HCPDetail_phone_number = document.createElement("a");
            HCPDetail_phone_number.classList.add("HCP-detail-phone");
            HCPDetail_phone_number.href = hcp_call;
            HCPDetail_phone_number.innerHTML = hcp_phone

            HCPDetail_phone.appendChild(HCPDetail_phone_number);
  
            HCPDetailDiv_2.appendChild(HCPDetail_phone);
  
            HCPDetailDiv.appendChild(HCPDetailDiv_2);
            HCPCardElement.appendChild(HCPDetailDiv);
  
            const cardHeight = window.getComputedStyle(HCPDetailDiv).height;
  
            let HCPCardtab = document.createElement("div");
            HCPCardtab.classList.add("HCP-card-tab");
            HCPCardtab.style.height = cardHeight+10;
  
            HCPCardElement.appendChild(HCPCardtab);
  
            if (!isMobileView()) {
              if (pairedArray[0].distance) {
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
            } else {
              if (pairedArray[0].distance) {
                infowindow_hcp.setContent(`
                    <p style="margin:0; color: #140065; font-family: Poppins; font-size: 12px; font-weight: 500;">${hcp_name}</p>
                    <div id="info_div_1" style="margin:0; margin-right:0px; display:flex;flex-direction: row;align-items: center;justify-content: space-between;">
                      <p style="margin:0;  color: #D200E6;font-family: Poppins;font-size: 10px;font-style: normal;font-weight: 400;">${hcp_specialty}</p>
                      <a href="${hcp_call}" style="margin-left:22px">
                        <img style="width: 20px;height: 20px;" src="pics/call.png"></img>
                      </a>
                    </div>
                    <hr style="width: 95%; margin:0; margin-top: 5px; border-top: 0.7px solid #929292;"></hr>
                    <p style="margin:0; margin-top: 5px; max-width:300px; color: #0374BB;font-family: Poppins;font-size: 10px;font-style: normal;font-weight: 400;">${hcp_address + ", " + hcp_city}</p>
                    <div id="info_div" style="margin:0; margin-right:0px; display:flex;flex-direction: row;align-items: center;justify-content: space-between;">
                      <div id="distance" style="magin:0;display:flex;flex-direction: row;align-items: center;">
                        <img style="width: 12px;height: 12px;" src="pics/Distance.png"></img>
                        <span style="margin-left:10px;color: #929292; font-family: Poppins;font-size: 10px;font-style: normal;font-weight: 400;">${dis + ' miles'}</span>
                      </div>
                    </div>
                `);
              } else {
                infowindow_hcp.setContent(`
                  <p style="margin:0; color: #140065; font-family: Poppins; font-size: 12px; font-weight: 500;">${hcp_name}</p>
                  <div id="info_div_1" style="margin:0; margin-right:0px; display:flex;flex-direction: row;align-items: center;justify-content: space-between;">
                    <p style="margin:0;  color: #D200E6;font-family: Poppins;font-size: 10px;font-style: normal;font-weight: 400;">${hcp_specialty}</p>
                    <a href="${hcp_call}" style="margin-left:22px">
                      <img style="width: 20px;height: 20px;" src="pics/call.png"></img>
                    </a>
                  </div>
                  <hr style="width: 95%; margin:0; margin-top: 5px; border-top: 0.7px solid #929292;"></hr>
                  <p style="margin:0; margin-top: 5px; max-width:300px;color: #0374BB;font-family: Poppins;font-size: 10px;font-style: normal;font-weight: 400;">${hcp_address + ", " + hcp_city}</p>
                `);
              };
            }

            let hcp_clicked = false;
            let elementTop = HCPCardElement.offsetTop;


            if (isMobileView()) {
              elementTop = HCPCardElement.offsetTop - mapElement.offsetHeight - 10;
            }

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

            marker_hcp.addListener("click", () => {
              if (activeMarker && activeMarker !== marker_hcp) {
                // Deactivate the previously clicked marker and infowindow
                deactiveHCP(activeMarker, activeInfowindow, activeHCPCardElement);
                activehcp_clicked = false;
                HCPContentElement.scrollTop = elementTop - 30;
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
                HCPContentElement.scrollTop = elementTop - 30;
              }
            });
  
            infowindow_hcp.addListener("closeclick", () => {
              hcp_clicked = false;
              marker_hcp.setIcon(marker_hcp_icon_normal);
              deactiveHCP(marker_hcp, infowindow_hcp, HCPCardElement);
              map.setOptions({ center: origin_center, zoom: zoomLevel });
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

            if (!isMobileView()){
              

              marker_hcp.addListener("mouseover", () => {
                if (!hcp_clicked || marker_hcp !== activeMarker) {
                  activeHCP(marker_hcp, infowindow_hcp, HCPCardElement);
                  HCPContentElement.scrollTop = elementTop - 30;
                }
              });
              
              marker_hcp.addListener("mouseout", () => {
                if (!hcp_clicked || marker_hcp !== activeMarker) {
                  deactiveHCP(marker_hcp, infowindow_hcp, HCPCardElement);
                }
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
              
            }
            
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
          if (disArray.length >0) {
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

          } else {
            pairedArray = filteredArray.map((hcp, index) => ({
              hcp: hcp
            }));

            pairedArray.sort((a, b) => {
              // If "distance" is the same, compare based on "hcp.FIRST_NAME"
              const stateA = a.hcp.PRIMARY_STATE_CODE.toUpperCase();
              const stateB = b.hcp.PRIMARY_STATE_CODE.toUpperCase();
              if (stateA < stateB) {
                return -1;
              }
              if (stateA > stateB) {
                return 1;
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

          }
          console.log("pairedArray",pairedArray);
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