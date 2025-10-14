const apiGetWorks = "http://localhost:5678/api/works";
const apiGetCategories = "http://localhost:5678/api/categories";
const apiPostUsers = "http://localhost:5678/api/users/login";
const apiDeleteWork = "http://localhost:5678/api/works/";
const apiAddWork = "http://localhost:5678/api/works";

/**
 * Récupère tous les travaux de l'architecte
 * 
 * @returns {Promise<Array<{id: number, title: string, imageUrl: string, category: object, userId: number}>>}
 */
export async function getWorks(){
    try{
        const response = await fetch(apiGetWorks);
        const data = await response.json();
        return data;
    }
    catch(error){
        console.error("Erreur :", error);
    };
};

/**
 * Récupère les catégories des travaux
 * 
 * @returns {Promise<Array<{id: number, name: string}>>} 
 */
export async function getCategories(){
    try{
        const response = await fetch(apiGetCategories);
        const data = await response.json();
        return data;
    }
    catch(error){
        console.error("Erreur :", error);
    }
}


/**
 * Reçoit en paramètres l'email et le password de l'utilisateur pour vérifier avec la base de donnée si l'utilisateur existe.
 * @param {Array<{email: string, password: string}>} loginInfo 
 * @returns {Array<{isAuthenticated: boolean, token: string}>}  retourne un boolean pour déterminer si la personne est connecter ou non et un token si la personne est connecté.
 */
export async function loginConnection(loginInfo){
    try{
        const response = await fetch(apiPostUsers, {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify(loginInfo)
        });
        const data = await response.json();
        return {isAuthenticated: response.ok, token: data.token};
    }
    catch(error){
        console.error("Erreur :", error);
    }
}

/**
 * Supprime l'élément avec l'id et un token valide,
 * si la suppression à échoué la fonction retourne un
 * booléan(true: réussie, false: échouer)
 * 
 * @param {Number} id l'id du travail à supprimer
 * @param {String} token le token pour la connexion
 * @returns 
 */
export async function deleteWorksById(id, token){
    try{
        const response = await fetch(apiDeleteWork + id, {
            method: "DELETE",
            headers: { "accept" : "*/*",
                "Authorization" : `Bearer ${token}`
            }
        });
        return response.ok;
    }
    catch(error){
        console.error("Erreur :", error);
    };
};

/**
 * Ajoute un nouveau travail de l'architecte.
 * 
 * @param {string} token le token dans session storage.
 * @param {FormData} formData le formData contenant toute les informations sur le travail à ajouter.
 */
export async function addWork(token, formData){
    try{
        const response = await fetch(apiAddWork, {
            method: "POST",
            headers: {
                "accept" : "application/json",
                "Authorization" : `Bearer ${token}`
            },
            body: formData
        });
    }catch(error){
        console.error("Erreur : ", error);
    };
};