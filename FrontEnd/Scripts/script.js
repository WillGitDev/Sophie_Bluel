/**
 * @typedef {Object} Work
 * @property {{ id: number, name: string }} category
 * @property {number} id
 * @property {string} imageUrl
 * @property {string} title
 * @property {number} userId
 */

const gallery = document.getElementsByClassName("gallery")[0];
const filterContainer = document.getElementsByClassName("filter")[0];
const apiGetWorks = "http://localhost:5678/api/works";
const apiGetCategories = "http://localhost:5678/api/categories";

/**
 * Retourne tous les travaux de l'architecte
 * 
 * @returns {Promise<Work[]>} - Retourne une promesse contenant un tableau des travaux de l'architecte.
 */
async function getWorks(){
    try{
        const response = await fetch(apiGetWorks);
        const data = await response.json();
        return data;
    }
    catch(error){
        console.error("Erreur :", error);
    }
}


/**
 * Demander au mentor si c'est bien de cette façon que l'on génère un JsDoc.
 * @returns {Promise<Categories[]>} - Retourne une promesse contenant un tableau des catégories.
 */
async function getCategories(){
    try{
        const response = await fetch(apiGetCategories);
        const data = await response.json();
        console.log(data);
        return data;
    }
    catch(error){
        console.error("Erreur :", error);
    }
}

/*getWorks().then(data => {
    console.log(data);
    console.log(typeof data);
    console.log(Array.isArray(data));
});*/

/**
 * Affichage dynamique des travaux 
 */
async function createGallery(category = "all"){
    gallery.innerHTML = "";
    const works = await getWorks();
    let worksFilter = [];

    if(category != "all"){
        let workTemp = [];
        for(let i = 0; i < works.length; i++){
            if(works[i].category.name === category){
                workTemp.push(works[i]);
                worksFilter = [...workTemp];
            }
        }
        
    }
    else{
        worksFilter = [...works];
    }

    for(let i=0; i < worksFilter.length; i++){       
        const work = worksFilter[i];
        
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");

        img.src = work.imageUrl;
        img.alt = work.title;
        figcaption.innerText = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    }
};

/**
 * Création dynamique des boutons du filtres à partir des catégories.
 */
async function createButtonCategories(){
    const categories = await getCategories();

    for(let i = 0; i < categories.length; i++){
        const categorie = categories[i];
        const button = document.createElement("button");
        button.setAttribute("type", "button");
        button.classList.add("button-filter");
        button.innerText = categorie.name;
        filterContainer.appendChild(button);
        button.addEventListener("click", () => {createGallery(categorie.name)});
    }
}









createGallery();
createButtonCategories();
