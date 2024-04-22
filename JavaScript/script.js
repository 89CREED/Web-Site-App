//initializaea si afisarea google maps
let map;
let directionService;
let directionsRenderer;
let marker;


async function initMap() {
    const position = {lat: 47.0278, lng: 28.8335 };
    const { Map } = await google.maps.importLibrary("maps");
    const { places } = await google.maps.importLibrary("places");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    //Centering a map
    map = new Map(document.getElementById('map'), {
        zoom: 12,
        center: position,
        mapId: "Demo_Map_Id",
    });

    //Add a marker on the map at the predefined location
    marker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: position,
        title: 'Center',
    });

    //Auto complete for input field for adresses
    let inputFrom = document.getElementById('text-input');
    let autoCompleteFrom = new google.maps.places.Autocomplete(inputFrom);
    let inputTo = document.getElementById('text-input1');
    let autoCompleteTo = new google.maps.places.Autocomplete(inputTo);

    //Create a route service
    directionService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

}
document.getElementById('route').addEventListener('click', async function(event){
    let inputFrom = document.getElementById('text-input').value;
    let inputTo = document.getElementById('text-input1').value;
    let passengerCount = document.getElementById('passenger').value;
    let select = document.getElementById('carType').value;
    let km = document.getElementById('km').textContent;
    let price = document.getElementById("price").textContent;
    let user = document.getElementById("main");
    
    
    event.preventDefault();
    if((inputFrom === "") || (inputTo === "") || (passengerCount <= 0) || (select === "")){
        window.alert("Please fill in all the required information.");
        console.log(this.textContent);
        return;
    }

    if(this.textContent === "Place the order"){
        await calculateAndDisplayRoute();
        console.log(this.textContent);
        passengerCount.disabled = true;
        select.disabled = true;
        if(user.textContent !== "Login"){
            PlaceOrder();
        }else{
            alert("Please login or register");
            localStorage.setItem("inputFrom", inputFrom);
            localStorage.setItem("inputTo", inputTo);
            localStorage.setItem("passengerCount", passengerCount);
            localStorage.setItem("carType", select);
            localStorage.setItem("km", km);
            localStorage.setItem("price", price);
            window.location.href = "authentication.html";
        }
    }else{
        await calculateAndDisplayRoute();
    }
    console.log(JSON.parse(localStorage.getItem("orderInfo")));

});

window.onload = function() {
    initMap();
    if(localStorage.getItem("inputFrom") && localStorage.getItem("inputTo") && localStorage.getItem("passengerCount") && localStorage.getItem("carType") && localStorage.getItem("km") && localStorage.getItem("price")) {
        document.getElementById('text-input').value = localStorage.getItem("inputFrom");
        document.getElementById('text-input1').value = localStorage.getItem("inputTo");
        document.getElementById('passenger').value = localStorage.getItem("passengerCount");
        document.getElementById('carType').value = localStorage.getItem("carType");
        document.getElementById('km').textContent = localStorage.getItem("km");
        document.getElementById("price").textContent = localStorage.getItem("price");
        let mapBtn = document.getElementById("route");
        mapBtn.textContent = "Place the order";

        localStorage.removeItem("inputFrom");
        localStorage.removeItem("inputTo");
        localStorage.removeItem("passengerCount");
        localStorage.removeItem("carType");
        localStorage.removeItem("km");
        localStorage.removeItem("price");
    }
}
// -------------------------------------------------------------------------------------------

//Calculate and display the route on map
async function calculateAndDisplayRoute() {
    let from = document.getElementById('text-input').value;
    let to = document.getElementById('text-input1').value;
    let passengerCount = document.getElementById('passenger').value;
    let btn = document.getElementById('route');
    const request = {
        origin: from,
        destination: to,
        travelMode: google.maps.TravelMode.DRIVING,
    };
    directionService.route(request, function (result, status){
        if(status === 'OK'){
            marker ? marker.setMap(null) : null;
            directionsRenderer.setDirections(result);
            let distance = result.routes[0].legs[0].distance.text;
            let km = document.getElementById('km');
            km.textContent = "Km: "+ distance.replace(" km", "");
            calculatePrice();
            btn.textContent = "Place the order";
        }else{
            window.alert('No route found');
            btn.textContent = "Calculate route";
        }
    });
}

// -------------------------------------------------------------------------------------------

//Saving the order in local storage for a specific client
function PlaceOrder() {
    let from = document.getElementById("text-input").value;
    let to = document.getElementById("text-input1").value;
    let passengerCount = parseInt(document.getElementById('passenger').value);
    let carType = document.getElementById("carType").value;
    let km = document.getElementById("km");
    let kmContent = km.textContent.replace("Km: ", "");
    let price = document.getElementById("price").textContent;
    let priceContent = price.replace(" lei", "");
    let user = document.getElementById("main").textContent;

    //Adress validation
    if(from.trim() === "" && from.trim().length < 5 && to.trim() === "" && to.trim().length < 5){
        alert("Please enter valid addresses!");
        return;
    }
    else if(passengerCount <= 0){
        alert("Please enter a valid number of passengers!");
        return;
    }
    else if(carType === "" || carType === "Car type"){
        alert("Please select a car type!");
        return;
    }

    //get today date
    const currentDate = new Date();
    const serializedDate = currentDate.toISOString()
    

    const order = {
        from: from,
        to: to,
        passenger: passengerCount,
        carType: carType.value,
        km: kmContent,
        price: priceContent,
        user: user,
        date: serializedDate,
    }
    
    let orderInfo = JSON.parse(localStorage.getItem("orderInfo")) || [];
    orderInfo.push(order);
    localStorage.setItem("orderInfo", JSON.stringify(orderInfo));

    window.location.reload(true);
}

//--------------------------------------------------------------------------------------------

//Switching to authentication page when pressing the button "Login"
let mainLogin = document.getElementById('main'); 

mainLogin.addEventListener('click', function() {
    window.location.href = "authentication.html";
});

// -------------------------------------------------------------------------------------------

//Setting number type input only to positive numbers
const numberPassenger = document.getElementById('passenger');
numberPassenger.addEventListener('input', function() {
    if(this.value < 0) this.value = 0;
});

// -------------------------------------------------------------------------------------------

//"Cancel" button from the map
const cancelBtn = document.getElementById('cancel');
cancelBtn.addEventListener('click', function(event) {
    let route = document.getElementById('route');
    let from = document.getElementById('text-input');
    let to = document.getElementById('text-input1');
    let price = document.getElementById('price');
    let numberPassenger = document.getElementById('passenger');
    let select = document.getElementById('carType');
    event.preventDefault();
    route.textContent = "Calculate route";
    from.value = "";
    to.value = "";
    km.textContent = "Km: ";
    directionsRenderer.setMap(null);
    const position = {lat: 47.0278, lng: 28.8335 };
    marker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: position,
        title: 'Center',
    });
    map.setCenter(position);
    numberPassenger.value = "";
    numberPassenger.disabled = false;
    select.value = "";
    select.disabled = false;
    price.textContent = "";
});

// -------------------------------------------------------------------------------------------

//Calculate a price for a route
function calculatePrice() {
    let economyPrice = 5;
    let standardPrice = 7;
    let premiumPrice = 10;
    let luxuryPrice = 15;
    let km = document.getElementById('km').textContent;
    let select = document.getElementById('carType');
    let price = document.getElementById('price');
    let distance = parseFloat(km.replace("Km: ", "").replace(",", "").replace(" km", "").trim());
    if(!isNaN(distance)){
        switch (select.value) {
            case 'economy':
                price.textContent = (distance * economyPrice).toFixed(1) + " lei";
                break;
            case'standard':
                price.textContent = (distance * standardPrice).toFixed(1) + " lei";
                break;
            case 'premium':
                price.textContent = (distance * premiumPrice).toFixed(1) + " lei";
                break;
            case 'luxury':
                price.textContent = (distance * luxuryPrice).toFixed(1) + " lei";
                break;
            default:
                window.alert("Please select car type");
                break;
        }
    }   
}

//--------------------------------------------------------------------------------

// Change text content on Login button with username when somebody is logged in and create a "Logout" button
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

if(urlParams.has("username")){
    const username = urlParams.get("username");
    let loginBtn = document.getElementById("main");
    loginBtn.textContent = username;
    loginBtn.disabled = true;
    let logoutBtn = document.createElement('a');
    logoutBtn.id = "logout";
    logoutBtn.href = "#";
    logoutBtn.textContent = "Logout";
    let nav = document.querySelector(".nav-bar");
    nav.appendChild(logoutBtn);

    logoutBtn.addEventListener('click', function(event) {
        event.preventDefault();
        logout();
    });
}else{
    console.log("username not found");
}

//--------------------------------------------------------------------------------

//Logout function
function logout () {
    window.location.reload(true);
    window.location.href = "main.html";
}

//--------------------------------------------------------------------------------
//If user = admin, show admin section in menu

if(urlParams.has("username")){
    const username = urlParams.get("username");
    if(username === "admin"){
        let admin = document.getElementById("admin");
        admin.style.display = "block";
    }
}else{
    admin.style.display = "none";
}












