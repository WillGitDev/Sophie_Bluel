import {createGallery} from '../components/gallery.js';
import * as api from '../api/api.js';

let modal = null;
let previouslyFocusedElement = null; // Pour sauvegarder l'élément actif.
document.querySelector(".js-modal").addEventListener("click", openModal);
const galleryContainer = document.getElementById("gallery-content-modal");
const galleryModal = document.getElementById("modal-gallery");
const addWorkModal = document.getElementById("modal-add-work");
const select = document.getElementById("category");
const containerPhotoSelected = document.getElementById("photo-selected");
const containerPhotoSelect = document.getElementById("select-photo");
const inputImg = document.getElementById("input-img");
const buttonAddImg = document.getElementById("add-photo");
const formAddPhoto = document.getElementById("form-add-photo");
const errorAddPhoto = document.querySelector(".error-add-photo");
const focusableSelector = 'button, a, input, textarea, select';
const buttonValidateWork = document.getElementById("button-add-work");
const errorForm = document.querySelector(".error-form");
let fileAddPhoto = null;
let focusables = [];


const PhotoView = {
    SELECT: "selectPhotoView",
    PREVIEW: "previewPhotoView"
};

const ModalView = {
    GALLERY: "galleryModal",
    ADDWORK: "addWorkModal"
};

/**
 * Affiche la modale en modifiant les différents style CSS et attribut du HTML.
 * @param {event} e 
 */
export function openModal(e){
    e.preventDefault();

    showModal(ModalView.GALLERY);
    previouslyFocusedElement = document.activeElement;
    modal = document.querySelector(e.target.getAttribute("href"));
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    modal.setAttribute("aria-modal", "true");
    modal.addEventListener("click", closeModalOnClickOutside);
    modal.querySelector(".button-close").addEventListener("click", closeModal);
    modal.querySelector(".modal-wrapper").addEventListener("click", stopModalPropagation);
    createGallery(galleryContainer, "all", false, true);
    focusables[0].focus();
    viewContainerAddPhoto(PhotoView.SELECT);
}

/**
 * Masque la modale en modifiant les différents styles CSS et attribut du HTML.
 * @param {event} e 
 * @returns 
 */
export function closeModal(e){
    if(modal === null) return;
    if(previouslyFocusedElement){
        previouslyFocusedElement.focus();
    }
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("aria-modal", "false");
    modal.querySelector(".button-close").removeEventListener("click", closeModal);
    modal.querySelector(".modal-wrapper").removeEventListener("click", stopModalPropagation);
    modal = null;
    resetFormAddPhoto();
    errorAddPhoto.style.display = "none";
    errorForm.style.display = "none";
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

/**
 * Attache un évènement au bouton ajouter une photo de la modale de la galerie
 * quand le bouton est cliquer affiche la vue qui permet d'ajouter une photo et génère
 * la liste des catégories.
 */
async function buttonAddPicture(){
    const buttonAddPicture = document.getElementById("add-picture");

    buttonAddPicture.addEventListener("click", () => {
        showModal(ModalView.ADDWORK);
        generateListCategorie();
    });
};

async function generateListCategorie(){
    select.innerHTML = "";
    const categories = await api.getCategories();
    const option = document.createElement("option");// A voir si il faut laisser une option vide pour respecter la maquette.
    select.appendChild(option);
    categories.forEach(element => {
        const option = document.createElement("option");
        option.setAttribute("value", element.id);
        option.innerHTML = element.name;
        select.appendChild(option);
    });
};

/**
 * Attache un évènement à la flèche retour de la modal ajout de photo,
 * quand l'élément flèche est cliquer ouvre la modal galerie, efface
 * le formulaire et réinitialise la vue pour l'ajout de la photo.
 */
function goBackToGallery(){
    const buttonReturn = document.querySelector(".button-return");

    buttonReturn.addEventListener("click", () => {
        showModal(ModalView.GALLERY);
        resetFormAddPhoto();
        viewContainerAddPhoto(PhotoView.SELECT);
        errorAddPhoto.style.display = "none";
        errorForm.style.display = "none";
    });
};

/**
 * Affiche une vue spécifique de la modale et cache les autres.
 * @param {HTLMElement} viewToShow  La vue de la modale à afficher.
 */
function showModal(viewName){
    galleryModal.style.display = "none";
    addWorkModal.style.display = "none";

    switch(viewName){
        case ModalView.GALLERY:
            galleryModal.style.display = "flex";
            break;
        case ModalView.ADDWORK:
            addWorkModal.style.display = "flex";
    };
};

/**
 * Récupère l'image pour l'afficher.
 */
function importImg(){
    buttonAddImg.addEventListener("click", () => {
        inputImg.click();
    });

    inputImg.addEventListener("change", (e) => {
        const file = e.target.files[0];
        fileAddPhoto = file;
        console.log(file);
        checkImg(file);
    });
    
   buttonValidateWork.addEventListener("click", async (e) => {
        e.preventDefault();
        const title = document.getElementById("title-img").value;
        const select = document.getElementById("category").value;
        

        if(fileAddPhoto === null){
            errorForm.innerHTML = "Veuillez sélectionner une photo";
            errorForm.style.display = "inline";
        }
        else if(title === ""){
            errorForm.innerHTML = "Veuillez renseigner un titre";
            errorForm.style.display = "inline";
        }
        else if (select === ""){
            errorForm.innerHTML = "Veuillez renseigner une catégorie";
            errorForm.style.display = "inline";
        }
        
        const formData = new FormData();
        formData.append("image", fileAddPhoto);
        formData.append("title", title);
        formData.append("category", select);

        console.log("Contenu du formData :");
        for(let [key, value] of formData.entries()){
            console.log(key + " " + value);
        }

        const token = window.sessionStorage.getItem("Bearer");

        await api.addWork(token, formData);
   });
};

/**
 * Permet de vérifier que l'image est dans le bon format et
 * inférieur à 4 Mo.
 * 
 * @param {object} file Le fichier reçu de l'input type file.
 */
function checkImg(file){
    const maxSize = 4194304; //En octets
    if(file){
            if(file.type !== "image/png" && file.type !== "image/jpeg"){
            errorAddPhoto.innerHTML = "Le fichier sélectionner ne correspond au format attendu (jpg, png)";
            errorAddPhoto.style.display = "inline";
            inputImg.value = "";
            return;
        }
            if(file.size > maxSize){
                errorAddPhoto.innerHTML = "Le fichier est trop volumineux, la taille maximale est de 4 Mo.";
                errorAddPhoto.style.display = "inline";
                inputImg.value = "";
                return;
            }
            const imageUrl = URL.createObjectURL(file);
            const imagePreview = document.createElement("img");
            imagePreview.setAttribute("id", "photoContainer");
            imagePreview.setAttribute("src", imageUrl);
            containerPhotoSelected.innerHTML = "";

            containerPhotoSelected.appendChild(imagePreview);

            viewContainerAddPhoto(PhotoView.PREVIEW);
        }
        else{
            errorAddPhoto.innerHTML = "Aucun fichier n'est sélectionner";
            errorAddPhoto.style.display = "inline";
        }
}


/**
 * Affiche la vue en fonction de la valeur passer en paramétre.
 * @param {string} viewName La vue à afficher (PhotoView.SELECT pour la vue de sélection de la photo ou PhotoView.PREVIEW pour la vue d'affichage de la photo sélectionner)
 */
function viewContainerAddPhoto(viewName){
    containerPhotoSelected.style.display = "none";
    containerPhotoSelect.style.display = "none";
    
    switch(viewName){
        case PhotoView.SELECT:
            containerPhotoSelect.style.display = "flex";
            break;
        case PhotoView.PREVIEW:
            containerPhotoSelected.style.display = "flex";
            break;
        default:
            console.error("Vue inconnue pour la modale : ", viewName);
            // Affichage de la vue par défaut.
            containerPhotoSelect.style.display = "flex";
    };
};

/**
 *Réinitialise les champs du formulaire, efface la photo de la vue et vide l'image dans l'input.
 */
function resetFormAddPhoto(){
    formAddPhoto.reset();
    containerPhotoSelected.innerHTML = "";
    inputImg.value = "";
    fileAddPhoto = null;
}

/**
 * Vérifie si le champ est correctement complété.
 */
function checkFormAddPhoto(){
    
}

importImg();
goBackToGallery();
buttonAddPicture();
