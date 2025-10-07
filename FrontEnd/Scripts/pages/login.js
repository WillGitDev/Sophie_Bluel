import {loginConnection} from '../api/api.js';

const loginLink = document.getElementById("link-login");
loginLink.style.fontWeight = "700";

const formLogin = document.querySelector("#login form");
    formLogin.addEventListener("submit",async (event) => {
        event.preventDefault();
        const email = event.target.querySelector("[name=email]").value;
        const password = event.target.querySelector("[name=password]").value;
        const loginInfo = {
            email : email,
            password : password
        }
        const connectionInfo = await loginConnection(loginInfo);
        console.log(connectionInfo);
        validateConnection(connectionInfo);
    });

function validateConnection(connectionInfo){
    const errorMessage = document.getElementById("error-message");

    if(connectionInfo.isAuthenticated){
        sessionStorage.setItem("Bearer", connectionInfo.token);
        window.location.replace("./index.html");
    }else{
        errorMessage.style.display = "flex";
    }
};


