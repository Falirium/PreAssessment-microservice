

// MAIN ARRAYS
let emploiJSON = [];
let niveauxArray = []

// MIDLLE ARRAYS
let responsabilitesArray = [];
let resArray = [];
let exigencesArray = [];
let marqueursArray = [];
let competencesArray = [];
let glossaireArray = [];


let lastEditedInputs = {
    "exigence": -1,
    "marqueur": -1,
    "competence": -1,
    "glossaire": -1,
    "responsabilites": [-1,-1]
}


const btnAddResponsabilite = document.querySelector("#btn-add-res");
const btnAddExigence = document.querySelector("#btn-add-exigence");
const btnAddMarqueur = document.querySelector("#btn-add-marqueur");
const btnAddCompetence = document.querySelector("#btn-add-competence");
const btnAddGlossaire = document.querySelector("#btn-add-glossaire");
const btnDeleteNiveau = document.querySelector("#btn-delete-niveau");
const btnAddNiveau = document.querySelector("#btn-add-niveau");

let niveauCounter = 1;

let firstNiveau = document.querySelector(".niveau-container");



btnAddResponsabilite.addEventListener('click', (e) => {
    let inputCatRes = document.querySelector("#input-categorie-responsabilites");
    let inputResValeur = document.querySelector("#input-valeur-responsabilites");

    let resJson = {
        "categorie": inputCatRes.options[inputCatRes.selectedIndex].value,
        "valeur": inputResValeur.value
    }

    if (lastEditedInputs.responsabilites[0] !== -1 && lastEditedInputs.responsabilites[1] !== -1) {
        let catIndex = lastEditedInputs.responsabilites[0];
        let resIndex = lastEditedInputs.responsabilites[1];

        responsabilitesArray[catIndex]["valeur"][resIndex] = inputResValeur.value;

        //INITIALIZE THE INDEX
        lastEditedInputs.responsabilites = [-1,-1];

    } else {

        responsabilitesArray = categorizeArray(responsabilitesArray, resJson);
    }
    // responsabilitesArray = categorizeArray(responsabilitesArray, resJson);

    // Initilize the inputs
    inputCatRes.removeAttribute("disable");
    inputResValeur.value = "";


    parseResToTable(responsabilitesArray);
})

btnAddExigence.addEventListener('click', (e) => {

    let exigenceInput = document.querySelector("#input-exigence-emploi");

    let exigenceJson = {
        "valeur": exigenceInput.value
    }
    // CHECK IF THE VALUE ALREADY EXISTS
    if (lastEditedInputs.exigence !== -1) {
        let index = lastEditedInputs.exigence;
        exigencesArray[index] = exigenceJson;

        //INITIALIZE THE INDEX
        lastEditedInputs.exigence = -1;

    } else {
        exigencesArray.push(exigenceJson);
    }


    exigenceInput.value = "";

    parseExigenceToTable(exigencesArray, firstNiveau);


})

btnAddMarqueur.addEventListener("click", (e) => {

    let marqueurInput = document.querySelector("#input-marqueur-emploi");

    let marqueurJson = {
        "valeur": marqueurInput.value
    }

    // CHECK IF THE VALUE ALREADY EXISTS
    if (lastEditedInputs.marqueur !== -1) {
        let index = lastEditedInputs.marqueur;
        marqueursArray[index] = marqueurJson;

        //INITIALIZE THE INDEX
        lastEditedInputs.marqueur = -1;

    } else {
        marqueursArray.push(marqueurJson);
    }


    marqueurInput.value = "";

    parseMarqueurToTable(marqueursArray, firstNiveau);

})

btnAddCompetence.addEventListener("click", (e) => {

    let nameInput = document.querySelector("#input-nom-competence");
    let categoryInput = document.querySelector("#input-categorie-competence");
    let niveauInput = document.querySelector("#input-niveau-competence");

    let competenceJson = {
        "name": nameInput.value,
        "categorie": categoryInput.options[categoryInput.selectedIndex].value,
        "niveau": niveauInput.options[niveauInput.selectedIndex].value
    }

    if (lastEditedInputs.competence !== -1) {
        let index = lastEditedInputs.competence;

        competencesArray[index] = competenceJson;

        //INITIALIZE THE INDEX
        lastEditedInputs.competence = -1;


    } else {
        competencesArray.push(competenceJson);
    }


    // Initilize the inputs
    nameInput.value = "";

    parseCompetenceToTable(competencesArray, firstNiveau);
})

btnAddGlossaire.addEventListener("click", (e) => {
    let nomCompGlossaire = document.querySelector("#input-nom-competence-glossaire");
    let niveauCompGlassaire = Array.from(document.querySelectorAll("#input-niveau-competence-glossaire"));
    let defCompGlaossaire = Array.from(document.querySelectorAll("#input-def-competence-glossaire"));

    let competenceGlassaireJson = {
        "name": nomCompGlossaire.value,
        "niveaux": []
    }



    for (var i = 0; i < niveauCompGlassaire.length; i++) {
        let nivaeuJson = {
            "niveau": niveauCompGlassaire[i].value,
            "description": defCompGlaossaire[i].value
        }

        competenceGlassaireJson["niveaux"].push(nivaeuJson);
    }

    glossaireArray.push(competenceGlassaireJson);

    // INITIALIZE THE INPUTS
    nomCompGlossaire.value = "";
    defCompGlaossaire.forEach((definition) => {
        definition.value = "";
    })

    parseGlossaireToTable(glossaireArray, firstNiveau);
})

btnAddNiveau.addEventListener("click", (e) => {

    let niveauJson = {
        "level": niveauCounter,
        "exigences": exigencesArray,
        "marqueurs": marqueursArray,
        "compétences": competencesArray
    };

    niveauxArray.push(niveauJson);

    console.log(niveauxArray);

    // INITIALIZE ARRAYS
    exigencesArray = [];
    marqueursArray = [];
    competencesArray = [];


    let niveauContainer = document.querySelector(".niveau-container");
    let parent = niveauContainer.parentElement;

    let newNiveau = document.createElement("div");
    parent.appendChild(newNiveau);
    newNiveau.outerHTML = addNewNiveauHTML(++niveauCounter);

    let lastNiveau = lastNiveauContainer();
    // addListenersToNewNiveau(lastNiveau);

})

btnDeleteNiveau.addEventListener("click", (e) => {

    // DELETE ITS PART FROM NIVEAU ARRAY
    let allDeleteBtns = document.querySelectorAll("#btn-delete-niveau");
    let btnElement;
    if (e.target.tagName === "I") {
        btnElement = e.target.parentElement;
    } else {
        btnElement = e.target;
    }

    let niveauIndex = [...allDeleteBtns].indexOf(btnElement);

    niveauxArray.splice(niveauIndex, 1);


    // DELETE HTML
    if (niveauIndex === 0) {

    } else {
        let allNiveaux = documet.querySelectorAll(".niveau-container");

        allNiveaux[niveauIndex].remove();

    }

    // UPDATE COUNTER
    niveauCounter--;
})


function parseResToTable(responsabilitesArray) {

    let tableBody = document.querySelector("#responsabilites-table-body");

    // Initilize the table body

    tableBody.innerHTML = ``;
    // console.log(responsabilitesArray);
    for (var i = 0; i < responsabilitesArray.length; i++) {

        let valuesLength = responsabilitesArray[i]["valeur"].length;
        console.log(responsabilitesArray);

        for (var j = 0; j < valuesLength; j++) {
            let tr = tableBody.insertRow(-1);

            if (j === 0) {
                let categorieCell = tr.insertCell(-1);
                categorieCell.setAttribute("rowspan", valuesLength);
                categorieCell.innerHTML = responsabilitesArray[i].categorie;

                let valueCell = tr.insertCell(-1);
                valueCell.innerHTML = responsabilitesArray[i]["valeur"][j];
                // console.log(responsabilitesArray[i]["valeur"][j]);

                let actionCell = tr.insertCell(-1);
                actionCell.innerHTML = `
                    <div class="g-2">
                        <a id="res-table-btn-edit" class="btn text-primary btn-sm" data-bs-toggle="tooltip"
                            data-bs-original-title="Edit"><span class="fe fe-edit fs-14"></span></a>
                        <a id="res-table-btn-delete" class="btn text-danger btn-sm" data-bs-toggle="tooltip"
                            data-bs-original-title="Delete"><span
                                class="fe fe-trash-2 fs-14"></span></a>
                    </div> 
                `;

            } else {
                let valueCell = tr.insertCell(-1);
                valueCell.innerHTML = responsabilitesArray[i]["valeur"][j];

                let actionCell = tr.insertCell(-1);
                actionCell.innerHTML = `
                    <div class="g-2">
                        <a id="res-table-btn-edit" class="btn text-primary btn-sm" data-bs-toggle="tooltip"
                            data-bs-original-title="Edit"><span class="fe fe-edit fs-14"></span></a>
                        <a id="res-table-btn-delete" class="btn text-danger btn-sm" data-bs-toggle="tooltip"
                            data-bs-original-title="Delete"><span
                                class="fe fe-trash-2 fs-14"></span></a>
                    </div> 
                `;
            }

        }


    }


    let allDeleteCatBtns = tableBody.querySelectorAll("#res-table-btn-delete");
    let allEditCatBtns = tableBody.querySelectorAll("#res-table-btn-edit");


    Array.from(allDeleteCatBtns).forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", (e) => {

            // WHEN THE SPAN ELEMENT IS FIRED

            let aElement;
            if (e.target.tagName === "SPAN") {
                aElement = e.target.parentElement;
            } else {
                aElement = e.target;
            }

            let categoriesLength = [];
            console.log(categoriesLength);

            responsabilitesArray.forEach((categorie, index) => {
                categoriesLength.push(categorie["valeur"].length);
            })

            let btnIndex = [...allDeleteCatBtns].indexOf(aElement);

            // DETERMINE CATEGORIE INDEX BASED ON THE NUMBER OF VALUES ON EACH CATEGORY
            let cateIndex;
            let resIndex;
            if (btnIndex < categoriesLength[0]) {
                cateIndex = 0;
                resIndex = btnIndex;
            } else if (btnIndex < categoriesLength[0] + categoriesLength[1]) {
                cateIndex = 1;
                resIndex = btnIndex - (categoriesLength[0]);

            } else if (btnIndex < categoriesLength[0] + categoriesLength[1] + categoriesLength[2]) {
                cateIndex = 2;
                resIndex = btnIndex - (categoriesLength[0] + categoriesLength[1]);

            } else {
                cateIndex = 3;
                resIndex = btnIndex - (categoriesLength[0] + categoriesLength[1] + categoriesLength[2]);
            }




            // console.log(btnIndex, cateIndex, resIndex);

            // console.log(competenceIndex);
            responsabilitesArray[cateIndex]["valeur"].splice(resIndex, 1);

            parseResToTable(responsabilitesArray);

        })
    })


    Array.from(allEditCatBtns).forEach((editBtn) => {
        editBtn.addEventListener("click", (e) => {

            // WHEN THE SPAN ELEMENT IS FIRED

            let aElement;
            if (e.target.tagName === "SPAN") {
                aElement = e.target.parentElement;
            } else {
                aElement = e.target;
            }

            let categoriesLength = [];
            //console.log(categoriesLength);

            responsabilitesArray.forEach((categorie, index) => {
                categoriesLength.push(categorie["valeur"].length);
            })

            let btnIndex = [...allEditCatBtns].indexOf(aElement);

            // DETERMINE CATEGORIE INDEX BASED ON THE NUMBER OF VALUES ON EACH CATEGORY
            let cateIndex;
            let resIndex;
            if (btnIndex < categoriesLength[0]) {
                cateIndex = 0;
                resIndex = btnIndex;
            } else if (btnIndex < categoriesLength[0] + categoriesLength[1]) {
                cateIndex = 1;
                resIndex = btnIndex - (categoriesLength[0]);

            } else if (btnIndex < categoriesLength[0] + categoriesLength[1] + categoriesLength[2]) {
                cateIndex = 2;
                resIndex = btnIndex - (categoriesLength[0] + categoriesLength[1]);

            } else {
                cateIndex = 3;
                resIndex = btnIndex - (categoriesLength[0] + categoriesLength[1] + categoriesLength[2]);
            }


            let inputCatRes = document.querySelector("#input-categorie-responsabilites");
            let inputResValeur = document.querySelector("#input-valeur-responsabilites");


            inputResValeur.value = responsabilitesArray[cateIndex]["valeur"][resIndex];
            inputCatRes.value = responsabilitesArray[cateIndex].categorie;

            // DISABLE CATEGORIE INPUT
            inputCatRes.setAttribute("disable", "");

            lastEditedInputs.responsabilites = [cateIndex,resIndex];



            console.log(btnIndex, cateIndex, resIndex);

            // console.log(competenceIndex);
            // responsabilitesArray[cateIndex]["valeur"].splice(resIndex, 1);

            // parseResToTable(responsabilitesArray);

        })
    })






}

function parseExigenceToTable(exigences, niveauContainer) {
    let tableBody = niveauContainer.querySelector("#exigence-table-body");

    // Initilize the table body

    tableBody.innerHTML = ``;

    for (var i = 0; i < exigences.length; i++) {

        let tr = tableBody.insertRow(-1);

        let valueCell = tr.insertCell(-1);
        valueCell.innerHTML = exigences[i].valeur;

        let actionCell = tr.insertCell(-1);
        actionCell.innerHTML = `
        <div class="g-2">
                <a id="exi-table-btn-edit" class="btn text-primary btn-sm" data-bs-toggle="tooltip"
                    data-bs-original-title="Edit"><span class="fe fe-edit fs-14"></span></a>
                <a id="exi-table-btn-delete" class="btn text-danger btn-sm" data-bs-toggle="tooltip"
                    data-bs-original-title="Delete"><span
                        class="fe fe-trash-2 fs-14"></span></a>
            </div> 
    `;
    }

    // Click event listeners 
    let allDeleteCatBtns = tableBody.querySelectorAll("#exi-table-btn-delete");
    let allEditCatBtns = tableBody.querySelectorAll("#exi-table-btn-edit");


    Array.from(allDeleteCatBtns).forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", (e) => {

            // WHEN THE SPAN ELEMENT IS FIRED

            let aElement;
            if (e.target.tagName === "SPAN") {
                aElement = e.target.parentElement;
            } else {
                aElement = e.target;
            }

            let exigenceIndex = [...allDeleteCatBtns].indexOf(aElement);

            console.log(exigenceIndex);
            exigencesArray.splice(exigenceIndex, 1);

            parseExigenceToTable(exigencesArray, niveau);

        })
    })

    Array.from(allEditCatBtns).forEach((editBtn) => {
        editBtn.addEventListener("click", (e) => {

            let aElement;
            if (e.target.tagName === "SPAN") {
                aElement = e.target.parentElement;
            } else {
                aElement = e.target;
            }

            let exigenceIndex = [...allEditCatBtns].indexOf(aElement);
            console.log(exigenceIndex);

            let exigenceInput = niveauContainer.querySelector("#input-exigence-emploi");

            exigenceInput.value = exigencesArray[exigenceIndex].valeur;

            // // DELETE THE VALUE FROM THE ARRAY
            // exigencesArray.splice(exigenceIndex, 1);

            // ADD INDEX TO LASTEDITED VAR
            lastEditedInputs.exigence = exigenceIndex;


        })
    })



}

function parseMarqueurToTable(marqueurs, niveauContainer) {
    let tableBody = niveauContainer.querySelector("#marqueur-table-body");



    // Initilize the table body

    tableBody.innerHTML = ``;

    for (var i = 0; i < marqueurs.length; i++) {

        let tr = tableBody.insertRow(-1);

        let valueCell = tr.insertCell(-1);
        valueCell.innerHTML = marqueurs[i].valeur;

        let actionCell = tr.insertCell(-1);
        actionCell.innerHTML = `
        <div class="g-2">
                <a id="marq-table-btn-edit" class="btn text-primary btn-sm" data-bs-toggle="tooltip"
                    data-bs-original-title="Edit"><span class="fe fe-edit fs-14"></span></a>
                <a id="marq-table-btn-delete" class="btn text-danger btn-sm" data-bs-toggle="tooltip"
                    data-bs-original-title="Delete"><span
                        class="fe fe-trash-2 fs-14"></span></a>
            </div> 
    `;
    }

    // Click event listeners 
    let allDeleteCatBtns = tableBody.querySelectorAll("#marq-table-btn-delete");
    let allEditCatBtns = tableBody.querySelectorAll("#marq-table-btn-edit");


    Array.from(allDeleteCatBtns).forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", (e) => {

            // WHEN THE SPAN ELEMENT IS FIRED

            let aElement;
            if (e.target.tagName === "SPAN") {
                aElement = e.target.parentElement;
            } else {
                aElement = e.target;
            }

            let marqueurIndex = [...allDeleteCatBtns].indexOf(aElement);

            console.log(marqueurIndex);
            marqueursArray.splice(marqueurIndex, 1);

            parseMarqueurToTable(marqueursArray, niveau);

        })
    })

    Array.from(allEditCatBtns).forEach((editBtn) => {
        editBtn.addEventListener("click", (e) => {

            // WHEN THE SPAN ELEMENT IS FIRED

            let aElement;
            if (e.target.tagName === "SPAN") {
                aElement = e.target.parentElement;
            } else {
                aElement = e.target;
            }

            let marqueurIndex = [...allEditCatBtns].indexOf(aElement);
            console.log(marqueurIndex);

            let marqueurInput = niveauContainer.querySelector("#input-marqueur-emploi");

            marqueurInput.value = marqueursArray[marqueurIndex].valeur;

            // // DELETE THE VALUE FROM THE ARRAY
            // marqueursArray.splice(marqueurIndex, 1);

            // ADD INDEX TO LASTEDITED VAR
            lastEditedInputs.marqueur = marqueurIndex;




        })
    })


}

function parseCompetenceToTable(competences, niveauContainer) {
    let tableBody = niveauContainer.querySelector("#competence-table-body");

    console.log(niveauContainer);

    // Initilize the table body

    tableBody.innerHTML = ``;

    for (var i = 0; i < competences.length; i++) {

        let tr = tableBody.insertRow(-1);

        let nameCell = tr.insertCell(-1);
        nameCell.innerHTML = competences[i].name;

        let categoryCell = tr.insertCell(-1);
        categoryCell.innerHTML = competences[i].categorie;

        let niveauCell = tr.insertCell(-1);
        niveauCell.innerHTML = competences[i].niveau;

        let actionCell = tr.insertCell(-1);
        actionCell.innerHTML = `
        <div class="g-2">
                <a id="comp-table-btn-edit" class="btn text-primary btn-sm" data-bs-toggle="tooltip"
                    data-bs-original-title="Edit"><span class="fe fe-edit fs-14"></span></a>
                <a id="comp-table-btn-delete" class="btn text-danger btn-sm" data-bs-toggle="tooltip"
                    data-bs-original-title="Delete"><span
                        class="fe fe-trash-2 fs-14"></span></a>
            </div> 
    `;
    }

    // Click event listeners 
    let allDeleteCatBtns = tableBody.querySelectorAll("#comp-table-btn-delete");
    let allEditCatBtns = tableBody.querySelectorAll("#comp-table-btn-edit");


    Array.from(allDeleteCatBtns).forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", (e) => {

            // GET THE TARGET NICEAU CONTAINER
            let targetIndex = [...document.querySelectorAll(".niveau-container")].indexOf(niveauContainer);

            // WHEN THE SPAN ELEMENT IS FIRED

            let aElement;
            if (e.target.tagName === "SPAN") {
                aElement = e.target.parentElement;
            } else {
                aElement = e.target;
            }

            let competenceIndex = [...allDeleteCatBtns].indexOf(aElement);

            console.log(competenceIndex);

            if (targetIndex !== niveauCounter) {

            } else {
                competencesArray.splice(competenceIndex, 1);
            }
            competencesArray.splice(competenceIndex, 1);

            parseCompetenceToTable(competencesArray, niveauContainer);

        })
    })

    Array.from(allEditCatBtns).forEach((editBtn) => {
        editBtn.addEventListener("click", (e) => {

            let aElement;
            if (e.target.tagName === "SPAN") {
                aElement = e.target.parentElement;
            } else {
                aElement = e.target;
            }

            let competenceIndex = [...allEditCatBtns].indexOf(aElement);
            console.log(competenceIndex);

            let nameInput = niveauContainer.querySelector("#input-nom-competence");
            let categoryInput = niveauContainer.querySelector("#input-categorie-competence");
            let niveauInput = niveauContainer.querySelector("#input-niveau-competence");

            nameInput.value = competencesArray[competenceIndex].name;
            categoryInput.value = competencesArray[competenceIndex].category;
            niveauInput.value = competencesArray[competenceIndex].niveau;

            // // DELETE THE VALUE FROM THE ARRAY
            // competencesArray.splice(competenceIndex, 1);

            // ADD INDEX TO LASTEDITED VAR
            lastEditedInputs.competence = competenceIndex;




        })
    })



}

function parseGlossaireToTable(glossaire, niveauContainer) {
    let tableBody = niveauContainer.querySelector("#glossaire-table-body");


    // Initilize the table body

    tableBody.innerHTML = ``;
    for (var j = 0; j < glossaire.length; j++) {

        for (var i = 0; i < glossaire[j]["niveaux"].length; i++) {

            let tr = tableBody.insertRow(-1);

            if (i === 0) {

                let nameCell = tr.insertCell(-1);
                nameCell.setAttribute("rowspan", "4");
                nameCell.innerHTML = glossaire[j].name;

                let niveauCell = tr.insertCell(-1);
                niveauCell.innerHTML = glossaire[j]["niveaux"][i].niveau;

                let defCell = tr.insertCell(-1);
                defCell.innerHTML = glossaire[j]["niveaux"][i].description;
                let actionCell = tr.insertCell(-1);
                actionCell.setAttribute("rowspan", "4");
                actionCell.innerHTML = `
                    <div class="g-2">
                        <a id="glo-table-btn-edit" class="btn text-primary btn-sm" data-bs-toggle="tooltip"
                            data-bs-original-title="Edit"><span class="fe fe-edit fs-14"></span></a>
                        <a id="glo-table-btn-delete" class="btn text-danger btn-sm" data-bs-toggle="tooltip"
                            data-bs-original-title="Delete"><span
                                class="fe fe-trash-2 fs-14"></span></a>
                    </div> 
                `;

            } else {
                let niveauCell = tr.insertCell(-1);
                niveauCell.innerHTML = glossaire[j]["niveaux"][i].niveau;

                let defCell = tr.insertCell(-1);
                defCell.innerHTML = glossaire[j]["niveaux"][i].description;



            }

        }


    }



    // Click event listeners 
    let allDeleteCatBtns = tableBody.querySelectorAll("#glo-table-btn-delete");
    let allEditCatBtns = tableBody.querySelectorAll("#glo-table-btn-edit");

    Array.from(allDeleteCatBtns).forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", (e) => {

            // WHEN THE SPAN ELEMENT IS FIRED

            let aElement;
            if (e.target.tagName === "SPAN") {
                aElement = e.target.parentElement;
            } else {
                aElement = e.target;
            }

            let glossaireIndex = [...allDeleteCatBtns].indexOf(aElement);

            console.log(competenceIndex);
            glossaireArray.splice(glossaireIndex, 1);

            parseGlossaireToTable(glossaireArray, niveau);

        })
    })



}

function lastNiveauContainer() {
    let niveaux = Array.from(document.querySelectorAll(".niveau-container"));

    return niveaux.at(-1);
}

// function addListenersToNewNiveau(container) {

//     const btnAddExigence = container.querySelector("#btn-add-exigence");
//     const btnAddMarqueur = container.querySelector("#btn-add-marqueur");
//     const btnAddCompetence = container.querySelector("#btn-add-competence");
//     const btnAddGlossaire = container.querySelector("#btn-add-glossaire");
//     const btnDeleteNiveau = container.querySelector("#btn-delete-niveau");
//     const btnAddNiveau = container.querySelector("#btn-add-niveau");

//     btnAddExigence.addEventListener('click', (e) => {


//         let exigenceInput = container.querySelector("#input-exigence-emploi");

//         let exigenceJson = {
//             "valeur": exigenceInput.value
//         }
//         // CHECK IF THE VALUE ALREADY EXISTS
//         if (lastEditedInputs.exigence !== -1) {
//             let index = lastEditedInputs.exigence;
//             exigencesArray[index] = exigenceJson;

//             //INITIALIZE THE INDEX
//             lastEditedInputs.exigence = -1;

//         } else {
//             exigencesArray.push(exigenceJson);
//         }


//         exigenceInput.value = "";

//         parseExigenceToTable(exigencesArray, container);


//     })

//     btnAddMarqueur.addEventListener("click", (e) => {
//         let marqueurInput = container.querySelector("#input-marqueur-emploi");

//         let marqueurJson = {
//             "valeur": marqueurInput.value
//         }

//         // CHECK IF THE VALUE ALREADY EXISTS
//         if (lastEditedInputs.marqueur !== -1) {
//             let index = lastEditedInputs.marqueur;
//             marqueursArray[index] = marqueurJson;

//             //INITIALIZE THE INDEX
//             lastEditedInputs.marqueur = -1;

//         } else {
//             marqueursArray.push(marqueurJson);
//         }


//         marqueurInput.value = "";

//         parseMarqueurToTable(marqueursArray, container);

//     })

//     btnAddCompetence.addEventListener("click", (e) => {
//         let nameInput = container.querySelector("#input-nom-competence");
//         let categoryInput = container.querySelector("#input-categorie-competence");
//         let niveauInput = container.querySelector("#input-niveau-competence");

//         let competenceJson = {
//             "name": nameInput.value,
//             "categorie": categoryInput.options[categoryInput.selectedIndex].value,
//             "niveau": niveauInput.options[niveauInput.selectedIndex].value
//         }

//         if (lastEditedInputs.competence !== -1) {
//             let index = lastEditedInputs.competence;

//             competencesArray[index] = competenceJson;

//             //INITIALIZE THE INDEX
//             lastEditedInputs.competence = -1;


//         } else {
//             competencesArray.push(competenceJson);
//         }


//         // Initilize the inputs
//         nameInput.value = "";

//         parseCompetenceToTable(competencesArray, container);
//     })

//     btnAddGlossaire.addEventListener("click", (e) => {
//         let nomCompGlossaire = container.querySelector("#input-nom-competence-glossaire");
//         let niveauCompGlassaire = Array.from(container.querySelectorAll("#input-niveau-competence-glossaire"));
//         let defCompGlaossaire = Array.from(container.querySelectorAll("#input-def-competence-glossaire"));

//         let competenceGlassaireJson = {
//             "name": nomCompGlossaire.value,
//             "niveaux": []
//         }



//         for (var i = 0; i < niveauCompGlassaire.length; i++) {
//             let nivaeuJson = {
//                 "niveau": niveauCompGlassaire[i].value,
//                 "description": defCompGlaossaire[i].value
//             }

//             competenceGlassaireJson["niveaux"].push(nivaeuJson);
//         }

//         glossaireArray.push(competenceGlassaireJson);

//         // INITIALIZE THE INPUTS
//         nomCompGlossaire.value = "";
//         defCompGlaossaire.forEach((definition) => {
//             definition.value = "";
//         })

//         parseGlossaireToTable(glossaireArray, container);
//     })

//     btnAddNiveau.addEventListener("click", (e) => {
//         let niveauJson = {
//             "level": niveauCounter,
//             "exigences": exigencesArray,
//             "marqueurs": marqueursArray,
//             "compétences": competencesArray
//         };

//         niveauxArray.push(niveauJson);

//         console.log(niveauxArray);

//         // INITIALIZE ARRAYS
//         exigencesArray = [];
//         marqueursArray = [];
//         competencesArray = [];


//         let niveauContainer = document.querySelector(".niveau-container");
//         let parent = niveauContainer.parentElement;

//         let newNiveau = document.createElement("div");
//         parent.appendChild(newNiveau);
//         newNiveau.outerHTML = addNewNiveauHTML(++niveauCounter);

//         let lastNiveau = lastNiveauContainer();
//         addListenersToNewNiveau(lastNiveau);

//     })

//     btnDeleteNiveau.addEventListener("click", (e) => {
//         // DELETE ITS PART FROM NIVEAU ARRAY
//         let allDeleteBtns = container.querySelectorAll("#btn-delete-niveau");
//         console.log("here " + niveauCounter)

//         let btnElement;
//         if (e.target.tagName === "I") {
//             btnElement = e.target.parentElement;
//         } else {
//             btnElement = e.target;
//         }

//         let niveauIndex = [...allDeleteBtns].indexOf(btnElement);

//         niveauxArray.splice(niveauIndex, 1);


//         // DELETE HTML
//         if (niveauIndex === 0) {

//         } else {
//             let allNiveaux = documet.querySelectorAll(".niveau-container");

//             allNiveaux[niveauIndex].remove();

//         }

//         // UPDATE COUNTER
//         niveauCounter--;
//     })
// }

function addNewNiveauHTML(niveauCounter) {
    return `
            <div class="col-md-12 col-xl-12 niveau-container">
            <div class="card">
                
                <div class="card-header ">
                        <h4 class="card-title col-sm-6" id="niveau-header">Niveaux de séniorité : ` + niveauCounter + `</h4>
                        <div class="btn-list col-sm-6 d-flex flex-row-reverse ">
                            <button type="button" class="btn btn-sm btn-icon btn-danger" id="btn-delete-niveau"><i class="fe fe-trash"></i></button>
                        </div>
                    </div>
                <div class="card-body">
                    <form id="emploi-form">

                        <div class="form-group">
                            <label for="input-exigence-emploi" class="form-label">Exigences spécifiques de
                                l’emploi</label>
                            <table class="table border text-nowrap text-md-nowrap table-bordered my-3 ">
                                <thead id="exigence-table-header">
                                    <tr>
                                        <th class="w-auto">Valeur</th>
                                        <th class="w-25">Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="exigence-table-body">

                                </tbody>
                            </table>
                            <label for="" class="form-label"></label>
                            <input type="text" id="input-exigence-emploi" class="form-control">
                            <div class="mt-3 text-center">

                                <button id="btn-add-exigence" type="button"
                                    class="btn btn-icon me-2 bradius btn-success-light"> <i
                                        class="fe fe-plus"></i></button>

                            </div>
                        </div>

                        <div class="form-group">
                            <label for="input-marqueur-emploi" class="form-label">Marqueurs de séniorité</label>
                            <table class="table border text-nowrap text-md-nowrap table-bordered my-3 ">
                                <thead id="marqueur-table-header">
                                    <tr>
                                        <th class="w-auto">Valeur</th>
                                        <th class="w-25">Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="marqueur-table-body">

                                </tbody>
                            </table>
                            <label for="" class="form-label"></label>
                            <input type="text" id="input-marqueur-emploi" class="form-control">
                            <div class="mt-3 text-center">

                                <button id="btn-add-marqueur" type="button"
                                    class="btn btn-icon me-2 bradius btn-success-light"> <i
                                        class="fe fe-plus"></i></button>

                            </div>
                        </div>

                        <div class="form-group">
                            <label for="input-marqueur-emploi" class="form-label">Compétences requises</label>
                            <table class="table border text-nowrap text-md-nowrap table-bordered my-3 ">
                                <thead id="competence-table-header">
                                    <tr>
                                        <th class="">Nom</th>
                                        <th class="25">catégorie</th>
                                        <th class="w-10">Niveau requis</th>
                                        <th class="w-15">Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="competence-table-body">

                                </tbody>
                            </table>
                            <div class="form-group form-row">
                                <div class="col-sm-5">
                                    <label for="" class="form-label"></label>
                                    <input type="text" id="input-nom-competence" class="form-control"
                                        placeholder="Ex : Réactivité afin d’écourter ...">
                                </div>
                                <div class="col-sm-5">
                                    <label for="" class="form-label"></label>
                                    <select name="categorie-competence" id="input-categorie-competence"
                                        class="form-select form-control">
                                        <option value="DC">Domaines de connaissance </option>
                                        <option value="SF">Savoir-faire </option>
                                        <option value="SE">Savoir-être </option>
                                    </select>
                                </div>
                                <div class="col-sm-2">
                                    <label for="" class="form-label"></label>
                                    <select name="niveau-competence" id="input-niveau-competence"
                                        class="form-select form-control">
                                        <option value="E">E </option>
                                        <option value="M">M </option>
                                        <option value="A">A </option>
                                        <option value="X">X </option>
                                    </select>
                                </div>
                            </div>
                            <div class="mt-3 text-center">

                                <button id="btn-add-competence" type="button"
                                    class="btn btn-icon me-2 bradius btn-success-light"> <i
                                        class="fe fe-plus"></i></button>

                            </div>
                        </div>

                        <div class="form-group">
                            <label for="input-glossaire-emploi" class="form-label">Glossaire des compétences
                            </label>
                            <table class="table border text-nowrap text-md-nowrap table-bordered my-3 ">
                                <thead id="glossaire-table-header">
                                    <tr>
                                        <th class="w-auto">Nom</th>
                                        <th class="w-7">Niveau</th>
                                        <th class="w-40">Définition</th>
                                        <th class="w-15">Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="glossaire-table-body">

                                </tbody>
                            </table>
                            <div class="form-group form-row">
                                <div class="col-sm-12">
                                    <label for="" class="form-label"></label>
                                    <input type="text" id="input-nom-competence-glossaire" class="form-control"
                                        placeholder="Ex : Réactivité afin d’écourter ...">
                                </div>

                                <div class="col-sm-2">
                                    <label for="" class="form-label"></label>
                                    <input type="text" name="" class="form-control"
                                        id="input-niveau-competence-glossaire" readonly="" value="E">
                                </div>
                                <div class="col-sm-10">
                                    <label for="" class="form-label"></label>
                                    <textarea class="form-control" name="def-competence-glossaire"
                                        id="input-def-competence-glossaire" placeholder=""></textarea>
                                </div>

                                <div class="col-sm-2">
                                    <label for="" class="form-label"></label>
                                    <input type="text" name="" class="form-control"
                                        id="input-niveau-competence-glossaire" readonly="" value="M">
                                </div>
                                <div class="col-sm-10">
                                    <label for="" class="form-label"></label>
                                    <textarea class="form-control" name="def-competence-glossaire"
                                        id="input-def-competence-glossaire" placeholder=""></textarea>
                                </div>


                                <div class="col-sm-2">
                                    <label for="" class="form-label"></label>
                                    <input type="text" name="" class="form-control"
                                        id="input-niveau-competence-glossaire" readonly="" value="A">
                                </div>
                                <div class="col-sm-10">
                                    <label for="" class="form-label"></label>
                                    <textarea class="form-control" name="def-competence-glossaire"
                                        id="input-def-competence-glossaire" placeholder=""></textarea>
                                </div>


                                <div class="col-sm-2">
                                    <label for="" class="form-label"></label>
                                    <input type="text" name="" class="form-control"
                                        id="input-niveau-competence-glossaire" readonly="" value="X">
                                </div>
                                <div class="col-sm-10">
                                    <label for="" class="form-label"></label>
                                    <textarea class="form-control" name="def-competence-glossaire"
                                        id="input-def-competence-glossaire" placeholder=""></textarea>
                                </div>

                            </div>
                            <div class="mt-3 text-center">

                                <button id="btn-add-glossaire" type="button"
                                    class="btn btn-icon me-2 bradius btn-success-light"> <i
                                        class="fe fe-plus"></i></button>

                            </div>
                        </div>

                        <a  class="btn btn-primary mt-4 mb-0 " id="btn-add-niveau" role="button"
                            aria-pressed="true">Ajouter un autre niveau</a>

                    </form>
                </div>
            </div>
        </div>
    
    
    `;
}

function categorizeArray(targetArray, element) {


    if (targetArray.length === 0) {
        targetArray.push({
            "categorie": element.categorie,
            "valeur": [
                element.valeur
            ]
        })
    } else {

        //CHECK IF THE CATEGORY IS ALREADY ON CLEANARRAY OR CREATE A NEW CATEGORY ON CLEANARRAY
        // console.log(hasSamePropertyValue(targetArray, element.categorie)[1]);
        if (hasSamePropertyValue(targetArray, element.categorie)[1]) {
            let categorieIndex = hasSamePropertyValue(targetArray, element.categorie)[0];

            targetArray[categorieIndex].valeur.push(element.valeur);
        } else {
            targetArray.push({
                "categorie": element.categorie,
                "valeur": [
                    element.valeur
                ]
            })
        }
    }


    return targetArray;
}

function hasSamePropertyValue(array, property) {
    let hasIt = false;
    let indexOfObject;
    array.every((object, index) => {
        hasIt = (object.categorie === property);

        if (hasIt) {
            indexOfObject = index;
        }

        return !hasIt;
    })

    return [indexOfObject, hasIt]
}