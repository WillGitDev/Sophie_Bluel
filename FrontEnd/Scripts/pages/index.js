import { getCategories, deleteWorksById } from '../api/api.js';
import {} from '../components/modal.js';
import { createGallery } from '../components/gallery.js';

const gallery = document.getElementsByClassName("gallery")[0];
const filterContainer = document.getElementsByClassName("filter")[0];

/**
 * Création dynamique des boutons des filtres à partir des catégories.
 * 
 * @return {Promise<void>} ne retourne rien mais modifie le DOM.
 */
async function createButtonCategories(){
    const categories = await getCategories();
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.classList.add("button-filter");
    button.innerText = "Tous";
    filterContainer.appendChild(button);
    button.classList.add("button-active");
    button.addEventListener("click", (event)=>{
        classActiveButton(event);
        createGallery(gallery);
    });

    for(let i = 0; i < categories.length; i++){
        const categorie = categories[i];
        const button = document.createElement("button");
        button.setAttribute("type", "button");
        button.classList.add("button-filter");
        button.innerText = categorie.name;
        filterContainer.appendChild(button);
        button.addEventListener("click", (event)=> {
            classActiveButton(event);
            createGallery(gallery, categorie.name);
        });
        
    };
};

/**
 * Permet d'effacer la class button-active sur tous les boutons du filtre
 * et d'appliquer cette même classe uniquement sur le bouton sélectionner.
 * @param {event} event 
 */
function classActiveButton(event){
    const buttonFilter = document.querySelectorAll(".button-filter");
    buttonFilter.forEach((button) => {
        button.classList.remove("button-active");
    });
    event.target.classList.add("button-active");
}

/**
 * logout permet d'attacher un eventListener au logout dans la navigation pour déconnecter l'utilisateur.
 */
function logout(){
    const logout = document.querySelector("#link-logout");
    logout.addEventListener("click", () => {
        sessionStorage.removeItem("Bearer");
        location.reload();
    });
};

/* modal */

logout();
createGallery(gallery);
createButtonCategories();


