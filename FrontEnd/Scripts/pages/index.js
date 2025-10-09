import { getWorks, getCategories, deleteWorksById } from '../api/api.js';

const gallery = document.getElementsByClassName("gallery")[0];
const filterContainer = document.getElementsByClassName("filter")[0];
const galleryModal = document.getElementById("gallery-content-modal");

/**
 * Affiche dynamiquement les travaux. Si aucun paramètre de catégorie n'est
 * spécifié, tous les travaux sont affichés.
 * 
 * @param {string} [category="all"] Nom de la catégorie à filtrer. Si aucune valeur n'est fournie tous les travaux sont affichés.
 * @param {HTMLElement} container Le container qui doit afficher les travaux.
 * @param {boolean} isFigCaption La valeur true affiche une figcaption avec le titre sinon n'affiche pas de figcaption.
 * @param {boolean} isTrashLogo La valeur true rajoute un logo de corbeille dans la balise figure. 
 * @returns {Promise<void>} Ne retourne rien, mais modifie le DOM.
 */
async function createGallery(container, category = "all", isFigCaption = true, isTrashLogo = false){
    container.innerHTML = "";
    const works = await getWorks();
    let worksFilter = [];

    if(category !== "all"){
        for(let i = 0; i < works.length; i++){
            if(works[i].category.name === category){
                worksFilter.push(works[i]);
            };
        }; 
    }
    else{
        worksFilter = [...works];
    };

    for(let i=0; i < worksFilter.length; i++){       
        const work = worksFilter[i];
        
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");

        img.src = work.imageUrl;
        img.alt = work.title;
        
        figure.appendChild(img);
        if(isFigCaption){
            figcaption.textContent = work.title;
            figure.appendChild(figcaption);
        };
        if(isTrashLogo){
            const trashLogo = document.createElement("div");
            trashLogo.classList.add("trash-container");
            trashLogo.setAttribute("data-id", work.id);
            trashLogo.innerHTML = `<i class="fa-solid fa-trash trash-style"></i>`;
            trashLogo.addEventListener("click", handleDeleteClick);
            figure.appendChild(trashLogo);
        };
        container.appendChild(figure);
    };
};

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


/*Code pour la modale*/

let modal = null;

document.querySelector(".js-modal").addEventListener("click", openModal);
/**
 * Affiche la modale en modifiant les différents style CSS et attribut du HTML.
 * @param {event} e 
 */
function openModal(e){
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute("href"));
    target.style.display = "flex";
    target.setAttribute("aria-hidden", "false");
    target.setAttribute("aria-modal", "true");
    modal = target;
    modal.addEventListener("click", closeModal);
    modal.querySelector("#xmark-modal").addEventListener("click", closeModal);
    modal.querySelector(".modal-wrapper").addEventListener("click", stopModalPropagation);
    createGallery(galleryModal, "all", false, true);
}
/**
 * Masque la modale en modifiant les différents styles CSS et attribut du HTML.
 * @param {event} e 
 * @returns 
 */
function closeModal(e){
    if(modal === null) return; 
    e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("aria-modal", "false");
    modal.querySelector("#xmark-modal").removeEventListener("click", closeModal);
    modal.querySelector(".modal-wrapper").removeEventListener("click", stopModalPropagation);
}

function stopModalPropagation(e){
    e.stopPropagation();
}

/**
 * Supprime l'image et si elle n'est pas supprimer affiche un message d'erreur.
 * @param {event} e 
 */
async function handleDeleteClick(e){
    const errorMessage = document.querySelector(".error-gallery");
    errorMessage.style.display = "none";
    const target = e.currentTarget.getAttribute("data-id");
    const token = sessionStorage.getItem("Bearer");
    const isDelete = await deleteWorksById(target, token);

    if(!isDelete){
        errorMessage.style.display = "flex";
        
    }else{
        e.currentTarget.parentElement.remove();
    }
    
}


logout();
createGallery(gallery);
createButtonCategories();


