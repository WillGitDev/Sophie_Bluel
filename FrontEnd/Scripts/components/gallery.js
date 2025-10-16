import {getWorks, deleteWorksById} from '../api/api.js';

/**
 * Affiche dynamiquement les travaux. Si aucun paramètre de catégorie n'est
 * spécifié, tous les travaux sont affichés.
 *
 * @param {string} [category="all"] Nom de la catégorie à filtrer. Si aucune valeur n'est fournie, tous les travaux sont affichés.
 * @param {HTMLElement} container Le conteneur qui doit afficher les travaux.
 * @param {boolean} isFigCaption Si true, ajoute une figcaption avec le titre ; sinon n'ajoute pas de figcaption.
 * @param {boolean} isTrashLogo Si true, ajoute une icône de corbeille dans la balise figure.
 * @returns {Promise<void>} Ne retourne rien, mais modifie le DOM.
 */
export async function createGallery(container, category = "all", isFigCaption = true, isTrashLogo = false){
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
 * Supprime l'image ; si la suppression échoue, affiche un message d'erreur.
 * @param {Event} e
 */
async function handleDeleteClick(e){
    const galleryModal = document.getElementById("gallery-content-modal");
    const galleryIndex = document.querySelector(".gallery");
    const errorMessage = document.querySelector(".error-gallery");
    errorMessage.style.display = "none";
    const target = e.currentTarget.getAttribute("data-id");
    const token = sessionStorage.getItem("Bearer");
    const isDelete = await deleteWorksById(target, token);
    if(!isDelete){
        errorMessage.style.display = "flex";
        
    }else{
        await createGallery(galleryModal, "all", false, true);
        await createGallery(galleryIndex);
    }
    
}