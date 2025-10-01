/**
 * @typedef {Object} Work
 * @property {{ id: number, name: string }} category
 * @property {number} id
 * @property {string} imageUrl
 * @property {string} title
 * @property {number} userId
 */

const gallery = document.getElementsByClassName("gallery")[0];
const apiGetWorks = "http://localhost:5678/api/works";

/**
 * Retourne tous les travaux de l'architecte
 * 
 * @returns {Promise<Work[]>} - Retourne une promesse contenant un tableau des travaux de l'architecte.
 */
async function getWorks(){
    try{
        const response = await fetch(apiGetWorks);
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

async function createGallery(){
    const works = await getWorks();

    for(let i=0; i < works.length; i++){
        const work = works[i];
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

createGallery();