// @author: Violet(Yafan) Zeng

fetch('/data')
  .then(response => response.json())
  .then(data => {
    let markerArray = [];

    console.log(data);

    const dataArray = data.filter(row => row["COORDINATES"] !== 'nan');
    console.log("dataArray.length",dataArray.length);

    const mapMain = document.getElementById("map-main-container");

    // set up error box
    const mapErrorDiv = document.createElement("div");
    mapErrorDiv.id = "map-error-div";
    mapMain.appendChild(mapErrorDiv);

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

    let mapContainer = document.querySelector('.map-container');
    let leftPanel = document.getElementById('left-panel');

    function onLeftPanel() {
      mapContainer.classList.remove("left-panel-hidden");
      leftPanel.style.display = "flex";
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

      // Add control panel
      const controlContainer = document.getElementById("control-container");
      const controlPanel = document.getElementById("control-panel");

      // Search Options
      const searchOptionPanel = document.createElement("div");
      searchOptionPanel.id = "search-option-panel"

      const searchOptionText = document.createElement("span");
      searchOptionText.id = "searchOptionText";
      searchOptionText.innerHTML = "Please select search criteria:";

      searchOptionPanel.appendChild(searchOptionText);

      const searchOptions = document.createElement("div");
      searchOptions.classList.add("radio-options");

      
      // set zipcode option
      const radioOption_zipcode = document.createElement("label");
      radioOption_zipcode.classList.add("search-option");
      
      const radioInput_zipcode = document.createElement("input");
      radioInput_zipcode.classList.add("search-option");
      radioInput_zipcode.type = "radio";
      radioInput_zipcode.name = "searchOption";
      radioInput_zipcode.value = "zipcode";
      radioInput_zipcode.checked = true;
      
      const radioLabel_zipcode = document.createElement("span");
      radioLabel_zipcode.classList.add("search-option");
      radioLabel_zipcode.textContent = "Zipcode";
      
      radioOption_zipcode.appendChild(radioInput_zipcode);
      radioOption_zipcode.appendChild(radioLabel_zipcode);
      searchOptions.appendChild(radioOption_zipcode);
      
      // set address option
      const radioOption_address = document.createElement("label");
      radioOption_address.classList.add("search-option");
      
      const radioInput_address = document.createElement("input");
      radioInput_address.classList.add("search-option");
      radioInput_address.type = "radio";
      radioInput_address.name = "searchOption";
      radioInput_address.value = "address";
      radioInput_address.checked = false;
      
      const radioLabel_address = document.createElement("span");
      radioLabel_address.classList.add("search-option");
      radioLabel_address.textContent = "Current Address";
      
      radioOption_address.appendChild(radioInput_address);
      radioOption_address.appendChild(radioLabel_address);
      searchOptions.appendChild(radioOption_address);

      // set city option
      const radioOption_city = document.createElement("label");
      radioOption_city.classList.add("search-option");
      
      const radioInput_city = document.createElement("input");
      radioInput_city.classList.add("search-option");
      radioInput_city.type = "radio";
      radioInput_city.name = "searchOption";
      radioInput_city.value = "city";
      radioInput_city.checked = false;
      
      const radioLabel_city = document.createElement("span");
      radioLabel_city.classList.add("search-option");
      radioLabel_city.textContent = "City + HCP Name";
      
      radioOption_city.appendChild(radioInput_city);
      radioOption_city.appendChild(radioLabel_city);
      searchOptions.appendChild(radioOption_city);
    
      searchOptionPanel.appendChild(searchOptions);
      controlPanel.appendChild(searchOptionPanel);
      
      // set zipcode/city div
      const distanceFilterSelectDiv = document.createElement("div");
      distanceFilterSelectDiv.classList.add("input-div");

      // set divider 
      const inputDivider_1 = document.createElement("div");
      inputDivider_1.classList.add("vertical-line");
      distanceFilterSelectDiv.appendChild(inputDivider_1);

      // // Distance filter select element
      // const distanceFilterSelect = document.createElement("select");
      // distanceFilterSelect.id = "distance-filter-select";

      // const distanceOptions = [
      //     { label: "5 miles", value: 5 },
      //     { label: "10 miles", value: 10 },
      //     { label: "20 miles", value: 20 },
      //     { label: "50 miles", value: 50 },
      //     { label: "100 miles", value: 100 }
      // ];

      // distanceOptions.forEach((option) => {
      //     const optionElement = document.createElement("option");
      //     optionElement.value = option.value;
      //     optionElement.textContent = option.label;
      //     distanceFilterSelect.appendChild(optionElement);
      // });

      // distanceFilterSelect.value = 50;

      // distanceFilterSelectDiv.appendChild(distanceFilterSelect);
      // controlPanel.appendChild(distanceFilterSelectDiv);

      const distanceText = document.createElement("div");
      distanceText.id = "distance-text";
      distanceText.innerHTML = "Select radius (miles): ";
      distanceFilterSelectDiv.appendChild(distanceText);

      const distanceChoices = [5,10,20,50,100];
      
      let distanceSelected = 50;

      const distanceFilterDiv = document.createElement("div");
      distanceFilterDiv.id = "distance-filter-div";

      const distanceButtonDiv = document.createElement("div");
      distanceButtonDiv.id = "distance-button-div";

      const distanceButton = document.createElement("div");
      distanceButton.id = "distance-button";
      distanceButton.innerHTML = distanceSelected;
      distanceButtonDiv.appendChild(distanceButton);

      distanceFilterDiv.appendChild(distanceButtonDiv);


      const distanceSliderDiv = document.createElement("div");
      distanceSliderDiv.id = "distance-slider-div";


      const distanceSlider = document.createElement("input");
      distanceSlider.type = "range";
      distanceSlider.id = "distance-slider";
      distanceSlider.min = "0";
      distanceSlider.max = "4";
      distanceSlider.step = "1";
      distanceSlider.value = "3";

      distanceSlider.addEventListener("input",() => {
        distanceSelected = distanceChoices[distanceSlider.value];
        distanceButton.innerHTML = distanceSelected;
        console.log('distanceSelected',distanceSelected);
      });

      distanceSliderDiv.appendChild(distanceSlider);

      const distanceMarker = document.createElement("div");
      distanceMarker.id = "distance-markers-div";

      for (let i = 0; i < 5; i++){
        const marker = document.createElement('div');
        marker.classList.add("distance-markers");
        distanceMarker.appendChild(marker);
      };
      distanceSliderDiv.appendChild(distanceMarker);

      distanceFilterDiv.appendChild(distanceSliderDiv);

      const distanceLabel = document.createElement("div");
      distanceLabel.id = "distance-labels-div";

      distanceChoices.forEach(option => {
        const label = document.createElement('div');
        label.classList.add("distance-labels")
        label.innerHTML = option;
        distanceLabel.appendChild(label);
      });

      distanceSliderDiv.appendChild(distanceLabel);

      distanceFilterDiv.appendChild(distanceSliderDiv);

      distanceSliderDiv.style.display="none";

      let distance_clicked = false;
      
      distanceButton.addEventListener("click", () => {
        if (distance_clicked) {
          distance_clicked = false;
          distanceSliderDiv.style.display="none";
        } else {
          distance_clicked = true;
          
          distanceSliderDiv.style.display="flex";
        }
      });

      distanceFilterSelectDiv.appendChild(distanceFilterDiv);
      controlPanel.appendChild(distanceFilterSelectDiv);

       // Input box
       const inputPanel = document.createElement("div");
       inputPanel.id="input-panel";

      // set zipcode/city div
      const inputTextDiv = document.createElement("div");
      inputTextDiv.classList.add("input-div");

      // set divider 
      const inputDivider_2 = document.createElement("div");
      inputDivider_2.classList.add("vertical-line");
      inputTextDiv.appendChild(inputDivider_2);

      // const inputTextBox = document.createElement("div");
      // inputTextBox.classList.add("input-box");
      
      const inputText = document.createElement("input");
      inputText.id = "inputText";
      inputText.classList.add("input-text");
      inputText.type = "text";
      inputText.placeholder = "Enter Zipcode";

      inputTextDiv.appendChild(inputText);

      inputPanel.appendChild(inputTextDiv);

      // set name div
      const nameInputDiv = document.createElement("div");
      nameInputDiv.classList.add("input-div");

      // set divider
      const inputDivider_3 = document.createElement("div");
      inputDivider_3.classList.add("vertical-line");
      nameInputDiv.appendChild(inputDivider_3);

      // HCP Name Input
      const nameInput = document.createElement("input");
      nameInput.id = "nameInputText";
      nameInput.classList.add("input-text");
      nameInput.type = "text";
      nameInput.placeholder = "Enter HCP Name";

      nameInputDiv.appendChild(nameInput);

      inputPanel.appendChild(nameInputDiv);
      controlPanel.appendChild(inputPanel);

      // submit icon
      const submitDiv = document.createElement("div");
      submitDiv.classList.add("submit-icon-div");
      const sumbitIcon = document.createElement("img");

      sumbitIcon.src = "pics/Search.png"; // Replace with the path to your direction icon image
      sumbitIcon.alt = "Submit";
      submitDiv.appendChild(sumbitIcon);

      controlPanel.appendChild(submitDiv);

      // clear icon
      const clearDiv = document.createElement("div");
      clearDiv.classList.add("clear-icon-div");
      const clearIcon = document.createElement("img");

      clearIcon.src = "pics/reload.png"; // Replace with the path to your direction icon image
      clearIcon.alt = "Clear";
      clearDiv.appendChild(clearIcon);

      controlContainer.appendChild(clearDiv);

      // set up auto complete
      const address_options = {
        // bounds: defaultBounds,
        componentRestrictions: { country: "us" },
        strictBounds: true,
        types:['postal_code']
      };

      const autocomplete = new google.maps.places.Autocomplete(inputText, address_options);

      let selectedOption = "zipcode";
      nameInputDiv.style.display='none';

      radioOption_zipcode.addEventListener("click", () => {
        if (radioInput_zipcode.checked) {
          selectedOption = "zipcode";
          clear();
          radioOption_address.checked = false;
          radioOption_city.checked = false;
          inputTextDiv.style.display='flex';
          inputTextDiv.style.flexDirection='row';
          nameInputDiv.style.display='none';
          distanceFilterSelectDiv.style.display='flex';
          inputText.placeholder = "Enter Zipcode";
          autocomplete.setTypes(['postal_code']);
          autocomplete.getPlace();
        }
      });

      radioOption_address.addEventListener("click", () => {
        if (radioInput_address.checked) {
          selectedOption = "address";
          clear();
          radioOption_zipcode.checked = false;
          radioOption_city.checked = false;
          inputTextDiv.style.display='none';
          nameInputDiv.style.display='none';
          distanceFilterSelectDiv.style.display='flex';
          distanceFilterSelectDiv.style.flexDirection='row';
        }
      });

      radioOption_city.addEventListener("click", () => {
        if (radioInput_city.checked) {
          selectedOption = "city";
          clear();
          radioOption_address.checked = false;
          radioOption_city.checked = false;
          inputTextDiv.style.display='flex';
          inputTextDiv.style.flexDirection='row';
          nameInputDiv.style.display='flex';
          nameInputDiv.style.flexDirection='row';
          distanceFilterSelectDiv.style.display='none';
          inputText.placeholder = "Enter City Name";
          autocomplete.setTypes(['locality']);
          autocomplete.getPlace();
        }
      });

      sumbitIcon.addEventListener("click", () => {     
        clearmarkers();
        console.log("selectedOption",selectedOption);   
        document.getElementById("map-shield").style.display='none';
        if(selectedOption == "zipcode") {
          console.log("inputText.value",inputText.value);
          if (inputText.value != "") {
            zipcodeSearch();  
          } else {
            showError();
          };
        } else if (selectedOption == "address"){
          currentAddressSearch();
        } else {
          if (inputText.value != "" || nameInput.value != "") {
            citySearch();  
          } else {
            showError();
          };          
        };        
      });
                      
      clearIcon.addEventListener("click", function() {
        clear();
      });  

      function zipcodeSearch(){
        clearmarkers();
        
        const zipcode = extractZipCode(inputText.value);
        const selectedDistance = distanceChoices[distanceSlider.value];
        console.log(selectedDistance);

        if (zipcode) {
          geocodeAddress(zipcode)
            .then(async (geo_result) => {
              // document.getElementById("map").style.display='block';


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
                      const hcpZipcode = hcp_location.PRIMARY_ZIP_CODE;
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
        const selectedDistance = distanceChoices[distanceSlider.value];
    
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
                      const hcpZipcode = hcp_location.PRIMARY_ZIP_CODE;
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
                      const hcpCity = hcp_location.PRIMARY_CITY;
                      const hcpState = hcp_location.PRIMARY_STATE_CODE;
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

      function displayHCP(final_hcps,final_distances, sum) {

        console.log('final_hcps:',final_hcps);
        console.log('final_distances:',final_distances);

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

          if (selectedOption == "city") {
            dis = '';
          } else {
            dis = final_distances[i]
          };

          console.log('dis', dis);

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

          let hcp_name = 'Dr. ' + capitalizeFirstLetter(hcp.FIRST_NAME) + " " + capitalizeFirstLetter(hcp.LAST_NAME);
          let hcp_address = capitalizeFirstLetter(hcp.PRIMARY_ADDRESS_LINE_1) + " " + capitalizeFirstLetter(hcp.PRIMARY_ADDRESS_LINE_2);
          let hcp_city = capitalizeFirstLetter(hcp.PRIMARY_CITY);
          let hcp_phone = "(000) 000-000";
          let hcp_call = "tel:" + hcp_phone;
          // Create the Google Maps URL with the encoded addresses
          let encodedOrigin = encodeURIComponent(inputText.value);
          let encodedDestination = encodeURIComponent(hcp.FULL_ADDRESS);
          let googleMapsURL = `https://www.google.com/maps/dir/${encodedOrigin}/${encodedDestination}`;

          let infowindow_hcp = new google.maps.InfoWindow();

          // set hcp card
          let HCPCardElement = document.createElement("div");
          HCPCardElement.classList.add("HCP-card-div");

          // set hcp number
          let HCPNumberDiv = document.createElement("div");
          HCPNumberDiv.classList.add("HCP-number-div");

          let HCPNumber = document.createElement("p");
          HCPNumber.innerHTML = number;

          HCPNumberDiv.appendChild(HCPNumber);
          HCPCardElement.appendChild(HCPNumberDiv);

          // set hcp details
          let HCPDetailElement = document.createElement("div");
          HCPDetailElement.classList.add("HCP-detail-div");

          // set hcp name
          let HCPDetail_Name = document.createElement("h4");
          HCPDetail_Name.classList.add("HCP-detail-name");
          HCPDetail_Name.innerHTML = hcp_name;
          HCPDetailElement.appendChild(HCPDetail_Name);
          
          // set hcp name
          let HCPDetail_Address = document.createElement("div");
          HCPDetail_Address.classList.add("HCP-detail");
          let HCPDetail_Address_street = document.createElement("p");
          HCPDetail_Address_street.innerHTML = hcp_address;
          HCPDetail_Address.appendChild(HCPDetail_Address_street);
          let HCPDetail_Address_city = document.createElement("p");
          HCPDetail_Address_city.innerHTML = hcp_city + ", " + hcp.PRIMARY_STATE_CODE + " " + hcp.PRIMARY_ZIP_CODE;
          HCPDetail_Address.appendChild(HCPDetail_Address_city);
          HCPDetailElement.appendChild(HCPDetail_Address);

          // set divider
          let HCPDetail_line = document.createElement("hr");
          HCPDetail_line.classList.add("HCP-detail-line");
          HCPDetailElement.appendChild(HCPDetail_line);

          // set contact div
          let HCPContactElement = document.createElement("div");
          HCPContactElement.classList.add("HCP-contact-div");

          // add phone icon
          const HCPDetail_phone = document.createElement("div");

          const phoneIcon = document.createElement("img");
          
          phoneIcon.src = "pics/Phone call.png"; // Replace with the path to your direction icon image
          phoneIcon.alt = "Phone: ";
          HCPDetail_phone.appendChild(phoneIcon);

          HCPContactElement.appendChild(HCPDetail_phone);

          // add phone number
          const HCPDetail_phone_number = document.createElement("span");
          HCPDetail_phone_number.innerHTML = hcp_phone;

          HCPContactElement.appendChild(HCPDetail_phone_number);
          
          // add distance icon
          const HCPDetail_Route = document.createElement("div");

          const routeIcon = document.createElement("img");
          const HCPDetail_Route_dis = document.createElement("span");

          if (selectedOption != "city") {
            
            // add space between phone and distance
            const HCPDetail_space = document.createElement("div");
            HCPDetail_space.id = "HCP-contact-div-space"
            HCPContactElement.appendChild(HCPDetail_space);

            // add distance icon            
            routeIcon.src = "pics/Distance.png"; // Replace with the path to your direction icon image
            routeIcon.alt = "Distance: ";
            HCPDetail_Route.appendChild(routeIcon);

            HCPContactElement.appendChild(HCPDetail_Route);

            // add distance 
            HCPDetail_Route_dis.innerHTML = dis + ' miles';

            HCPContactElement.appendChild(HCPDetail_Route_dis);
          };
        
          HCPDetailElement.appendChild(HCPContactElement);

          HCPCardElement.appendChild(HCPDetailElement);
          

          let HCPCardtab = document.createElement("div");
          HCPCardtab.classList.add("HCP-card-tab");
          HCPCardElement.appendChild(HCPCardtab);

          HCPContentElement.appendChild(HCPCardElement);

          if (selectedOption != "city") {
            infowindow_hcp.setContent(`
                <p style="margin:0; color: #140065; font-family: Poppins; font-size: 16px; font-weight: 500;">${hcp_name}</p>
                <p style="margin:0; color: #818181;font-family: Poppins;font-size: 12px;font-style: normal;font-weight: 400;">${hcp_address + ', ' + hcp_city}</p>
                <hr style="width: 80%; margin:0; margin-top: 6px; border-top: 0.7px solid #929292;"></hr>
                <div id="info_div_3" style="margin-top: 7px; margin-right:0px; display:flex;flex-direction: row;align-items: center;">
                  <img style="width: 15px;height: 15px;" src="pics/Distance.png"></img>
                  <span style="margin-left:10px;color: #929292; font-family: Poppins;font-size: 12px;font-style: normal;font-weight: 400;">${dis + ' miles'}</span>
                  <a href="${hcp_call}" style="margin-left:22px">
                    <img style="width: 30px;height: 30px;" src="pics/call.png"></img>
                  </a>
                  <a href="${googleMapsURL}" target="_blank">
                    <img style="width: 30px;height: 30px;" src="pics/navigate.png"></img>
                  </a>
                </div>
            `);
          } else {
            infowindow_hcp.setContent(`
            <p style="margin:0; color: #140065; font-family: Poppins; font-size: 16px; font-weight: 500;">${hcp_name}</p>
            <p style="margin:0; color: #818181;font-family: Poppins;font-size: 12px;font-style: normal;font-weight: 400;">${hcp_address + ', ' + hcp_city}</p>
            <hr style="width: 168px;margin:0; margin-top: 6px; border-top: 0.7px solid #929292;"></hr>
            <div id="info_div_3" style="margin-top: 7px; margin-right:0px; display:flex;flex-direction: row;align-items: center;">
              <img style="width: 15px;height: 15px;" src="pics/Phone call.png"></img>
              <span style="margin-left:10px;color: #929292; font-family: Poppins;font-size: 12px;font-style: normal;font-weight: 400;">${hcp_phone}</span>
              <a href="${hcp_call}" style="margin-left:22px">
                <img style="width: 30px;height: 30px;" src="pics/call.png"></img>
              </a>
            </div>
            `);
          };

          let clicked = false;
          let elementTop = HCPCardElement.offsetTop;

          function activeHCP(){
            HCPCardElement.classList.add("active");
            HCPCardtab.classList.add("active");
            HCPNumberDiv.classList.add("active");
            HCPNumber.classList.add("active");
            HCPDetail_Name.classList.add("active");
            HCPDetail_Address_street.classList.add("active");
            HCPDetail_Address_city.classList.add("active");
            phoneIcon.src = "pics/Phone call_active.png";
            HCPDetail_phone_number.classList.add("active");
            if(selectedOption != "city") {
              routeIcon.src = "pics/Distance_active.png";
              HCPDetail_Route_dis.classList.add("active");
            };
          };

          function disactiveHCP(){
            HCPCardElement.classList.remove("active");
            HCPCardtab.classList.remove("active");
            HCPNumberDiv.classList.remove("active");
            HCPNumber.classList.remove("active");
            HCPDetail_Name.classList.remove("active");
            HCPDetail_Address_street.classList.remove("active");
            HCPDetail_Address_city.classList.remove("active");
            phoneIcon.src = "pics/Phone call.png";
            HCPDetail_phone_number.classList.remove("active");
            if(selectedOption != "city") {
              routeIcon.src = "pics/Distance.png";
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

              displayHCP(final_hcps,final_distances, sum);
            })
            .catch((error) => {
                console.error(error);
            });
          } else {
            displayHCP(filteredArray,'',sum);
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
  
        const infowindow_O = new google.maps.InfoWindow({
            content: "Center",
        });
  
        infowindow_O.setContent(
        // <div id="img_div" style="margin:0; display:flex;flex-direction: row;align-items: center;">
        //   <img style="width: 20px;height: 20px;" src="pics/Location.png"></img>
        // </div>
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
  
      function showError() {
        controlPanel.classList.add("error");
        if (inputText.value == "") {
          inputText.classList.add("error");
          inputText.placeholder = 'Invalid search value';
        };
        if (nameInput.value == "") {
          nameInput.classList.add("error");
          nameInput.placeholder = 'Invalid search value';
        };
        sumbitIcon.src = "pics/Search-error.png";
        mapErrorDiv.style.display = "flex";
      };

      function clear() {
        offLeftPanel();
        map.setOptions({center:center,zoom:4});
        document.getElementById("map-shield").style.display='block';
        controlPanel.classList.remove("error");
        mapErrorMessageBody1.innerHTML = "We were not able find a match";
        mapErrorDiv.style.display = "none";
        distanceSlider.value = 3;
        inputText.value="";
        nameInput.value="";
        inputText.classList.remove("error");
        nameInput.classList.remove("error");
        sumbitIcon.src = "pics/Search.png";
        inputPanel.classList.remove("error");
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

    };


    initMap();

    })
  .catch(error => {
    console.error('Error:', error);
  });