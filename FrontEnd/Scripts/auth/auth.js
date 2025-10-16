/**
 * Vérifie si l'utilisateur a un token dans le sessionStorage
 * et adapte le style de la page en conséquence.
 */
function userConnection(){
    const token = sessionStorage.getItem("Bearer");
    const authInfo = document.getElementById("auth-indicator");
    const filterContainer = document.getElementsByClassName("filter")[0];
    const editButton = document.getElementById("edit");
    const logout = document.getElementById("link-logout");
    const login = document.getElementById("link-login");

    if(token){
        authInfo.style.display = "flex";
        filterContainer.style.display = "none";
        editButton.style.display = "block";
        logout.style.display = "inline";
        login.style.display = "none";
    }
    else{
        authInfo.style.display = "none";
        editButton.style.display = "none";
        logout.style.display = "none";
        login.style.display = "inline";
    }
}

userConnection();
window.addEventListener("storage", userConnection);


