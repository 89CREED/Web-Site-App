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
    // window.location.reload(true);
    window.location.href = "main.html";
}

//---------------------------------------------------------------------------------

//show users
const info = localStorage.getItem("info");

if(info){
    const user = JSON.parse(info);
    let userForm = document.getElementById("users");
    let userCount = 1;
    let description = document.createElement("h2");
    description.className = "user-description";
    description.textContent = "Users";
    userForm.appendChild(description);

    user.forEach(item => {
        let userList = document.createElement("ul");
        userList.className = "user-list";

        let userNumber = document.createElement("li");
        userNumber.textContent = `User ${userCount}`;
        userList.appendChild(userNumber);

        let userName = document.createElement("li");
        userName.textContent = `Username: ${item.username}`;
        userList.appendChild(userName);

        let userEmail = document.createElement("li");
        userEmail.textContent = `Email: ${item.email}`;
        userList.appendChild(userEmail);

        let password = document.createElement("li");
        password.textContent = `Password: ${item.password}`;
        userList.appendChild(password);

        let deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener('click', () => {
            if(confirm("Are you sure you want to delete this user?")){
                let index = user.findIndex(user => user.username === item.username);
                user.splice(index, 1);
                userList.remove();
                deleteButton.remove();
                localStorage.setItem("info", JSON.stringify(user));
            }
        });
        userList.appendChild(deleteButton);

        let space = document.createElement('br');
        userList.appendChild(space);
        let space1 = document.createElement('br');
        userList.appendChild(space1);
        
        
        userForm.appendChild(userList);
        userCount++;
    });
}

//---------------------------------------------------------------------------------

//show orders
const orderInfo = localStorage.getItem("orderInfo");

if(orderInfo){
    const order = JSON.parse(orderInfo);
    let orderForm = document.getElementById("orders");
    let orderCount = 1;
    let description = document.createElement("h2");
    description.className = "order-description";
    description.textContent = "Orders";
    orderForm.appendChild(description);

    order.forEach(item => {
        let orderList = document.createElement("ul");
        orderList.className = "order-list";

        let orderNumber = document.createElement("li");
        orderNumber.textContent = `Order ${orderCount}`;
        orderList.appendChild(orderNumber);

        let from = document.createElement('li');
        from.textContent = `From: ${item.from}`;
        orderList.appendChild(from);

        let to = document.createElement('li');
        to.textContent = `To: ${item.to}`;
        orderList.appendChild(to);

        let passengers = document.createElement('li');
        passengers.textContent = `Passengers: ${item.passenger}`;
        orderList.appendChild(passengers);

        let km = document.createElement('li');
        km.textContent = `Km: ${item.km}`;
        orderList.appendChild(km);

        let price = document.createElement('li');
        price.textContent = `Price: ${item.price}`;
        orderList.appendChild(price);

        let user = document.createElement('li');
        user.textContent = `User: ${item.user}`;
        orderList.appendChild(user);

        let date = document.createElement('li');
        const parsedDate = new Date(item.date);
        const formattedDate = `${parsedDate.getDate()}/${parsedDate.getMonth() + 1}/${parsedDate.getFullYear()} ${parsedDate.getHours().toString().padStart(2, '0')}:${parsedDate.getMinutes().toString().padStart(2, '0')}:${parsedDate.getSeconds()}`;
        date.textContent = `Date: ${formattedDate}`;
        orderList.appendChild(date);

        let deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener('click', () => {
            if (confirm("Are you sure you want to delete this order?")) {
                let index = order.findIndex(orderItem => orderItem.from === item.from && orderItem.to === item.to);
                order.splice(index, 1);
                orderList.remove();
                localStorage.setItem("orderInfo", JSON.stringify(order));
            }
        });
        orderList.appendChild(deleteButton);

        let space = document.createElement('br');
        orderList.appendChild(space);
        let space1 = document.createElement('br');
        orderList.appendChild(space1);
        
        
        orderForm.appendChild(orderList);
        orderCount++;
    }
)};
