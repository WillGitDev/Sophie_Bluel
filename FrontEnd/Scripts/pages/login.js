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

/**
 * Gestion de la réponse suite à la tentative de connexion.
 * Si l'authentification réussit, cette fonction stocke le token et redirige l'utilisateur vers la page d'accueil.
 * @param {{isAuthenticated: boolean, token: string}} connectionInfo
 */
function validateConnection(connectionInfo){
    const errorMessage = document.getElementsByClassName("error-message")[0];

    if(connectionInfo.isAuthenticated){
        sessionStorage.setItem("Bearer", connectionInfo.token);
        window.location.replace("./index.html");
    }else{
        errorMessage.style.display = "flex";
    }
};


