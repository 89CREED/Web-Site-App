const authLoginBtn = document.getElementById("auth");
const formLogin = document.getElementById("login");
const formRegistration = document.getElementById("registration");
const loginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");
const closeBtn = document.querySelectorAll(".close");
const register = document.getElementById("reg");
const login = document.getElementById("log");
const menu = document.querySelector(".dropbtn");

//Switching to the authentication page when pressing on "Login" button
function loginClick() {
    formLogin.classList.add("active");
    formRegistration.classList.remove("active");
    authLoginBtn.style.display = "none";
    menu.style.marginLeft = "100px";
}

document.addEventListener("DOMContentLoaded", loginClick);

//------------------------------------------------------------------------------

//Switching between Login and Register forms
registerLink.addEventListener("click", () => {
    formRegistration.classList.add("active");
    formLogin.classList.remove("active");
});

loginLink.addEventListener("click", () => {
    formLogin.classList.add("active");
    formRegistration.classList.remove("active");
});

//------------------------------------------------------------------------------

//Switching to the main page when pressing the button "X" from the forms
closeBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        formLogin.classList.remove("active");
        formRegistration.classList.remove("active");
        authLoginBtn.style.display = "block";
        window.location.href = "main.html";
    });
});

//------------------------------------------------------------------------------

//E-mail validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

//------------------------------------------------------------------------------

//Password validation
function isValidPassword(password) {
    // Expresia regulată pentru validarea parolei
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,20}$/;
    return passwordRegex.test(password);
}

//------------------------------------------------------------------------------

//Save to local storage
function SaveToLocalStorage(button) {
    let username = document.getElementById("reg-username").value;
    let email = document.getElementById("reg-email").value;
    let password1 = document.getElementById("reg-pass1").value;
    let password2 = document.getElementById("reg-pass2").value;
    
    //email validation
    if(!isValidEmail(email))
    {
        alert("Please enter a valid email address!");
        return;
    }


    if(password1 !== password2) {
        alert("The password does not match!!! Please enter the same password in both fields.");
        return;
    }

    let info = JSON.parse(localStorage.getItem("info")) || [];

    //verify if username already exist, user have to choose another username
    const existingUser = info.find(user => user.username === username);
    const existingEmail = info.find(user => user.email === email);
    if(existingUser) {
        // Resetarea valorilor câmpurilor de intrare
        document.getElementById("reg-username").value = "";
        document.getElementById("reg-email").value = "";
        document.getElementById("reg-pass1").value = "";
        document.getElementById("reg-pass2").value = "";

        alert("Username already exist! Please choose another one.");
        formRegistration.classList.add("active");
        
        
        return;
    }
    if(existingEmail) {
        alert("Email already exist! Please choose another one.");
        formRegistration.classList.add("active");
        
        // Resetarea valorilor câmpurilor de intrare
        document.getElementById("reg-username").value = "";
        document.getElementById("reg-email").value = "";
        document.getElementById("reg-pass1").value = "";
        document.getElementById("reg-pass2").value = "";
        return;
    }

    const user = {
        username: username,
        email: email,
        password: password1,
    }

    info.push(user);
    localStorage.setItem("info", JSON.stringify(info));

    username = "";
    email = "";
    password1 = "";
    password2 = "";
}

//------------------------------------------------------------------------------

//Entering an existing account 
function isValidInfo(button) {
    const username = document.getElementById("log-username").value;
    const pass = document.getElementById("log-pass").value;
    const info = localStorage.getItem("info");

    if(!info) {
        alert("No user information found! Please try again or register.");
        return;
    }

    const users = JSON.parse(info);
    let validCredentials = false;
    let adminCredentials = false;
    
    for(const user of users) {
        if(user.username === username && user.password === pass){
            validCredentials = true;
            break;
        }
    } 

    if(username === "admin" && pass === "admin") adminCredentials = true;

    if(validCredentials) {
        if(adminCredentials) {
            alert("Succes! Admin page");
            window.location.href = "admin.html?username=" + encodeURIComponent(username);
        }
        else{
            alert("Succes!");
            window.location.href = "main.html?username=" + encodeURIComponent(username) + "#take-ride";
        }  
    }
    else {
        alert("Credentials does not match! Please try again or ragister.")
    }

   document.getElementById("log-username").value = "";
   document.getElementById("log-pass").value = "";
}

login.addEventListener("click", isValidInfo);
register.addEventListener("click", SaveToLocalStorage);




