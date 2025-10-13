import {createGallery} from '../components/gallery.js';
import {} from '../api/api.js';

let modal = null;
let previouslyFocusedElement = null; // Pour sauvegarder l'élément actif.
document.querySelector(".js-modal").addEventListener("click", openModal);
const galleryContainer = document.getElementById("gallery-content-modal");
const galleryModal = document.getElementById("modal-gallery");
const addWorkModal = document.getElementById("modal-add-work");
const focusableSelector = 'button, a, input, textarea';
let focusables = [];



/**
 * Affiche la modale en modifiant les différents style CSS et attribut du HTML.
 * @param {event} e 
 */
export function openModal(e){
    e.preventDefault();

    previouslyFocusedElement = document.activeElement;
    modal = document.querySelector(e.target.getAttribute("href"));
    console.log(modal);
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    modal.setAttribute("aria-modal", "true");
    modal.addEventListener("click", closeModalOnClickOutside);
    modal.querySelector(".button-close").addEventListener("click", closeModal);
    modal.querySelector(".modal-wrapper").addEventListener("click", stopModalPropagation);
    createGallery(galleryContainer, "all", false, true);
    focusables[0].focus();
}

/**
 * Masque la modale en modifiant les différents styles CSS et attribut du HTML.
 * @param {event} e 
 * @returns 
 */
export function closeModal(e){
    if(modal === null) return;
    galleryModal.style.display = "flex";
    addWorkModal.style.display = "none";
    if(previouslyFocusedElement){
        previouslyFocusedElement.focus();
    }
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("aria-modal", "false");
    modal.querySelector(".button-close").removeEventListener("click", closeModal);
    modal.querySelector(".modal-wrapper").removeEventListener("click", stopModalPropagation);
    modal = null;
}

function stopModalPropagation(e){
    e.stopPropagation();
};

/**
 * Gère la navigation au clavier à l'intérieur de la modale.
 * Empêche le focus de sortir de la modale et le fait passer à l'élément suivant ou précédent.
 * @param {event} e 
 */
function focusInModal(e){
    e.preventDefault();
    
    let index = focusables.findIndex(f => f === modal.querySelector(":focus"));
    if(e.shiftKey){
        index--;
    }else{
        index++;
    }

    if(index >= focusables.length){
        index = 0;
    };
    if(index < 0){
        index = focusables.length - 1;
    }
    focusables[index].focus();
}

/**
 * Évènement pour fermer la modale lors du clic sur le bouton "escape".
 */
window.addEventListener("keydown", (e) => {
    if(e.key === "Escape" || e.key === "Esc"){
        closeModal(e);
    }
    if(e.key === 'Tab' && modal !== null){
        focusInModal(e);
    }
});

function closeModalOnClickOutside(e){
    if(e.target === modal){
        closeModal(e);
    };
};

function buttonAddPicture(){
    const buttonAddPicture = document.getElementById("add-picture");

    buttonAddPicture.addEventListener("click", () => {
        galleryModal.style.display = "none";
        addWorkModal.style.display = "flex";
    });
};

buttonAddPicture();
