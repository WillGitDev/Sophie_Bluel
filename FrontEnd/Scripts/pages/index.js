import { getCategories, deleteWorksById } from '../api/api.js';
import {} from '../components/modal.js';
import { createGallery } from '../components/gallery.js';

const gallery = document.getElementsByClassName("gallery")[0];
const filterContainer = document.getElementsByClassName("filter")[0];
// --- CONTROL DE TRI ---
// Création d'un select permettant de choisir le tri alphabétique
const sortContainer = document.createElement('div');
sortContainer.classList.add('sort-container');
const sortSelect = document.createElement('select');
sortSelect.setAttribute('aria-label', 'Trier les projets');
// Options de tri : aucun, ascendant, descendant
const optionNone = document.createElement('option'); optionNone.value = 'none'; optionNone.text = 'Pas de tri';
const optionAsc = document.createElement('option'); optionAsc.value = 'asc'; optionAsc.text = 'A → Z';
const optionDesc = document.createElement('option'); optionDesc.value = 'desc'; optionDesc.text = 'Z → A';
sortSelect.appendChild(optionNone);
sortSelect.appendChild(optionAsc);
sortSelect.appendChild(optionDesc);
sortContainer.appendChild(sortSelect);
// On insère le contrôle de tri juste après la barre de filtres
filterContainer.parentNode.insertBefore(sortContainer, filterContainer.nextSibling);
// Etat courant du tri (utilisé lorsque l'on rafraîchit la galerie)
let currentSort = 'none';

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
        // Appel de createGallery en lui passant le tri courant
        createGallery(gallery, undefined, true, false, currentSort);
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
            // Lors du clic sur une catégorie, on passe aussi le tri courant
            createGallery(gallery, categorie.name, true, false, currentSort);
        });
        
    };
};

/**
 * Permet de retirer la classe `button-active` sur tous les boutons du filtre
 * et de l'appliquer uniquement sur le bouton sélectionné.
 * @param {Event} event
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


logout();
createGallery(gallery);
createButtonCategories();

// Quand l'utilisateur change le mode de tri
sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value; // Met à jour l'état du tri
    // Recherche de la catégorie actuellement active
    const active = document.querySelector('.button-active');
    const category = (active && active.innerText && active.innerText !== 'Tous') ? active.innerText : 'all';
    // Rafraîchit la galerie pour la catégorie active avec le nouveau tri
    if(category === 'all'){
        createGallery(gallery, 'all', true, false, currentSort);
    } else {
        createGallery(gallery, category, true, false, currentSort);
    }
});