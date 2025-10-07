import { getWorks, getCategories } from '../api/api.js';

const gallery = document.getElementsByClassName("gallery")[0];
const filterContainer = document.getElementsByClassName("filter")[0];

/**
 * Affiche dynamiquement les travaux. Si aucun paramètre de catégorie n'est
 * spécifié, tous les travaux sont affichés.
 * 
 * @async
 * @function createGallery
 * @param {string} [category="all"] - Nom de la catégorie à filtrer. Si aucune valeur n'est fournie tous les travaux sont affichés.
 * @returns {Promise<void>} Ne retourne rien, mais modifie le DOM.
 */
async function createGallery(category = "all"){
    gallery.innerHTML = "";
    const works = await getWorks();
    let worksFilter = [];

    if(category !== "all"){
        //let workTemp = [];
        for(let i = 0; i < works.length; i++){
            if(works[i].category.name === category){
                /*workTemp.push(works[i]);
                worksFilter = [...workTemp];*/
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
        figcaption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    };
};

/**
 * Création dynamique des boutons des filtres à partir des catégories.
 * 
 * @async
 * @function createButtonCategories
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
        createGallery("all");
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
            createGallery(categorie.name)
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


logout();
createGallery();
createButtonCategories();


