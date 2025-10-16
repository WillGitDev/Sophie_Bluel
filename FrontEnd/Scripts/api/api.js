const apiGetWorks = "http://localhost:5678/api/works";
const apiGetCategories = "http://localhost:5678/api/categories";
const apiPostUsers = "http://localhost:5678/api/users/login";
const apiDeleteWork = "http://localhost:5678/api/works/";
const apiAddWork = "http://localhost:5678/api/works";

/**
 * Récupère tous les travaux de l'architecte.
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
 * Récupère les catégories des travaux.
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
 * Envoie l'email et le mot de passe de l'utilisateur pour vérifier
 * dans la base de données si l'utilisateur existe.
 * @param {{email: string, password: string}} loginInfo
 * @returns {{isAuthenticated: boolean, token: string}} Retourne un booléen indiquant si la connexion a réussi et un token si l'utilisateur est authentifié.
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
 * Supprime l'élément identifié par son id en utilisant un token valide.
 * Si la suppression échoue, la fonction retourne false.
 *
 * @param {number} id Identifiant du travail à supprimer.
 * @param {string} token Token d'authentification.
 * @returns {boolean} Retourne true si l'élément a été supprimé, false sinon.
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
 * @param {string} token Le token stocké en session.
 * @param {FormData} formData Le FormData contenant les informations du travail à ajouter.
 * @returns {boolean} Retourne true si l'élément a bien été ajouté, false sinon.
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
        return response.ok;
    }catch(error){
        console.error("Erreur : ", error);
    };
};