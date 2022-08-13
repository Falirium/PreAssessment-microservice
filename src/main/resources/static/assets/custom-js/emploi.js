

// MAIN ARRAYS
let emploiJSON = [];
let niveauxArray = []

// MIDLLE ARRAYS
let responsabilitesArray = [];
let resArray = [];
let exigencesArray = [];
let marqueursArray = [];
let competencesArray = [];



let lastEditedInputs = {
    "exigence": -1,
    "marqueur": -1,
    "competence": -1,
    "glossaire": -1,
    "responsabilites": [-1, -1]
}
var currentNiveauIndex = 0;


const btnAddResponsabilite = document.querySelector("#btn-add-res");
const btnAddExigence = document.querySelector("#btn-add-exigence");
const btnAddMarqueur = document.querySelector("#btn-add-marqueur");
const btnAddCompetence = document.querySelector("#btn-add-competence");

const btnDeleteNiveau = document.querySelector("#btn-delete-niveau");
const btnAddNiveau = document.querySelector("#btn-add-niveau");

let niveauCounter = 1;

let focusedNiveauContainer = document.querySelector(".niveau-container");

addListenersToNewNiveau(focusedNiveauContainer);



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
        lastEditedInputs.responsabilites = [-1, -1];

    } else {

        responsabilitesArray = categorizeArray(responsabilitesArray, resJson);
    }
    // responsabilitesArray = categorizeArray(responsabilitesArray, resJson);

    // Initilize the inputs
    inputCatRes.removeAttribute("disable");
    inputResValeur.value = "";


    parseResToTable(responsabilitesArray);
})



// btnAddExigence.addEventListener('click', (e) => {

//     let exigenceInput = document.querySelector("#input-exigence-emploi");

//     let exigenceJson = {
//         "valeur": exigenceInput.value
//     }
//     // CHECK IF THE VALUE ALREADY EXISTS
//     if (lastEditedInputs.exigence !== -1) {
//         let index = lastEditedInputs.exigence;
//         exigencesArray[index] = exigenceJson;

//         //INITIALIZE THE INDEX
//         lastEditedInputs.exigence = -1;

//     } else {
//         exigencesArray.push(exigenceJson);
//     }


//     exigenceInput.value = "";

//     parseExigenceToTable(exigencesArray, focusedNiveauContainer);


// })

// btnAddMarqueur.addEventListener("click", (e) => {

//     let marqueurInput = document.querySelector("#input-marqueur-emploi");

//     let marqueurJson = {
//         "valeur": marqueurInput.value
//     }

//     // CHECK IF THE VALUE ALREADY EXISTS
//     if (lastEditedInputs.marqueur !== -1) {
//         let index = lastEditedInputs.marqueur;
//         marqueursArray[index] = marqueurJson;

//         //INITIALIZE THE INDEX
//         lastEditedInputs.marqueur = -1;

//     } else {
//         marqueursArray.push(marqueurJson);
//     }


//     marqueurInput.value = "";

//     parseMarqueurToTable(marqueursArray, focusedNiveauContainer);

// })

// btnAddCompetence.addEventListener("click", (e) => {

//     let nameInput = document.querySelector("#input-nom-competence");
//     let categoryInput = document.querySelector("#input-categorie-competence");
//     let niveauInput = document.querySelector("#input-niveau-competence");

//     let competenceJson = {
//         "name": nameInput.value,
//         "categorie": categoryInput.options[categoryInput.selectedIndex].value,
//         "niveau": niveauInput.options[niveauInput.selectedIndex].value
//     }

//     if (lastEditedInputs.competence !== -1) {
//         let index = lastEditedInputs.competence;

//         competencesArray[index] = competenceJson;

//         //INITIALIZE THE INDEX
//         lastEditedInputs.competence = -1;


//     } else {
//         competencesArray.push(competenceJson);
//     }


//     // Initilize the inputs
//     nameInput.value = "";

//     parseCompetenceToTable(competencesArray, focusedNiveauContainer);
// })



// btnAddNiveau.addEventListener("click", (e) => {

//     let niveauJson = {
//         "level": niveauCounter,
//         "exigences": exigencesArray,
//         "marqueurs": marqueursArray,
//         "compétences": competencesArray
//     };

//     niveauxArray.push(niveauJson);

//     console.log(niveauxArray);

//     // INITIALIZE ARRAYS
//     exigencesArray = [];
//     marqueursArray = [];
//     competencesArray = [];


//     let niveauContainer = document.querySelector(".niveau-container");
//     let parent = niveauContainer.parentElement;

//     let newNiveau = document.createElement("div");
//     parent.appendChild(newNiveau);
//     niveauCounter++;
//     newNiveau.outerHTML = addNewNiveauHTML(niveauCounter);

//     let lastNiveau = lastNiveauContainer();
//     focusedNiveauContainer = lastNiveauContainer();
//     addListenersToNewNiveau(lastNiveau);

// })

// btnDeleteNiveau.addEventListener("click", (e) => {

//     // DELETE ITS PART FROM NIVEAU ARRAY
//     let allDeleteBtns = document.querySelectorAll("#btn-delete-niveau");
//     let btnElement;
//     if (e.target.tagName === "I") {
//         btnElement = e.target.parentElement;
//     } else {
//         btnElement = e.target;
//     }

//     let clickedNiveauIndex = [...allDeleteBtns].indexOf(btnElement);

//     niveauxArray.splice(clickedNiveauIndex, 1);


//     // DELETE HTML
//     if (clickedNiveauIndex === 0) {

//     } else {
//         let allNiveaux = documet.querySelectorAll(".niveau-container");

//         allNiveaux[clickedNiveauIndex].remove();

//     }

//     // UPDATE COUNTER
//     niveauCounter--;
// })


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

            lastEditedInputs.responsabilites = [cateIndex, resIndex];



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

            parseExigenceToTable(exigencesArray, focusedNiveauContainer);

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

            parseMarqueurToTable(marqueursArray, niveauContainer);

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

function addListenersToNewNiveau(container) {

    const btnAddExigence = container.querySelector("#btn-add-exigence");
    const btnAddMarqueur = container.querySelector("#btn-add-marqueur");
    const btnAddCompetence = container.querySelector("#btn-add-competence");

    const btnDeleteNiveau = container.querySelector("#btn-delete-niveau");
    const btnEditNiveau = container.querySelector("#btn-edit-niveau");
    const btnAddNiveau = container.querySelector("#btn-add-niveau");

    btnEditNiveau.addEventListener("click", (e) => {

        // WHEN THE SPAN ELEMENT IS FIRED

        let btnElement;
        if (e.target.tagName === "I") {
            btnElement = e.target.parentElement;
        } else {
            btnElement = e.target;
        }
        //console.log(container);

        // CLEAR DISABLE FROM INPUT

        // GET NIVEAU INDEX
        let clickedNiveauIndex = Array.from(document.querySelectorAll(".niveau-container")).indexOf(container);
         
        console.log(currentNiveauIndex, clickedNiveauIndex);


        // SAVE ARRAYS TO NIVEAUX-ARRAY
        if (typeof(niveauxArray[currentNiveauIndex]) === 'undefined') { // SAVE THIS AS NEW ENTRY TO NIVEAUX ARRAY

            let niveauJson = {
                "level": niveauCounter,
                "exigences": exigencesArray,
                "marqueurs": marqueursArray,
                "compétences": competencesArray
            };

            niveauxArray.push(niveauJson);

        } else {
            niveauxArray[currentNiveauIndex].exigences = exigencesArray;
            niveauxArray[currentNiveauIndex].marqueurs = marqueursArray;
            niveauxArray[currentNiveauIndex]["compétences"] = competencesArray;
        }

        // GET THE VALUES OF THE CLICKED NIVEAU FROM NIVEAUXARRAY
        exigencesArray = niveauxArray[clickedNiveauIndex].exigences;
        marqueursArray = niveauxArray[clickedNiveauIndex].marqueurs;
        competencesArray = niveauxArray[clickedNiveauIndex]["compétences"];

       
        // CLEAR DISABLED-READONLY FROM INPUTS
        clearDisableFromInputsFor(container);

        // DISABLE INPUTS-SELECTS FOR THE PREVIOUS NIVEAU CONTAINER
        let previousNiveau = Array.from(document.querySelectorAll(".niveau-container"))[currentNiveauIndex];
        disableInputsFor(previousNiveau);


         // CHANGE CURRENT TO CLICKED
         currentNiveauIndex = clickedNiveauIndex; 



        // console.log(clickedNiveauIndex, currentNiveauIndex);


        // if (niveauxArray.length) { // ARRAY SHOULD HAVE AT LEAST ONE NIVEAU COMPLETED

        //     if (clickedNiveauIndex !== niveauxArray.length) { // WHEN CLICK ON THE LAST NIVEAU 

        //         niveauxArray[currentNiveauIndex].exigences = exigencesArray;
        //         niveauxArray[currentNiveauIndex].marqueurs = marqueursArray;
        //         niveauxArray[currentNiveauIndex]["compétences"] = competencesArray;

        //         currentNiveauIndex = clickedNiveauIndex;

        //         // GET THE VALUES OF THE TRIGGERED NIVEAU FROM NIVEAUXARRAY
        //         exigencesArray = niveauxArray[clickedNiveauIndex].exigences;
        //         marqueursArray = niveauxArray[clickedNiveauIndex].marqueurs;
        //         competencesArray = niveauxArray[clickedNiveauIndex]["compétences"];
        //     }



        // }




    }

        , true)

    btnAddExigence.addEventListener('click', (e) => {


        let exigenceInput = container.querySelector("#input-exigence-emploi");

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

        parseExigenceToTable(exigencesArray, container);


    })

    btnAddMarqueur.addEventListener("click", (e) => {
        let marqueurInput = container.querySelector("#input-marqueur-emploi");

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

        parseMarqueurToTable(marqueursArray, container);

    })

    btnAddCompetence.addEventListener("click", (e) => {
        let nameInput = container.querySelector("#input-nom-competence");
        let categoryInput = container.querySelector("#input-categorie-competence");
        let niveauInput = container.querySelector("#input-niveau-competence");

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

        parseCompetenceToTable(competencesArray, container);
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

        // DISABLE INPUTS FOR THE PREVIOUS NIVEAU
        disableInputsFor(container);


        let niveauContainer = document.querySelector(".niveau-container");
        let parent = niveauContainer.parentElement;

        let newNiveau = document.createElement("div");
        parent.appendChild(newNiveau);
        niveauCounter++;
        newNiveau.outerHTML = addNewNiveauHTML(niveauCounter);


        let lastNiveau = lastNiveauContainer();
        focusedNiveauContainer = lastNiveauContainer();
        addListenersToNewNiveau(lastNiveau);

        currentNiveauIndex = niveauCounter - 1;

    })

    btnDeleteNiveau.addEventListener("click", (e) => {
        // DELETE ITS PART FROM NIVEAU ARRAY
        let allDeleteBtns = container.querySelectorAll("#btn-delete-niveau");
        console.log("here " + niveauCounter)

        let btnElement;
        if (e.target.tagName === "I") {
            btnElement = e.target.parentElement;
        } else {
            btnElement = e.target;
        }

        let clickedNiveauIndex = [...allDeleteBtns].indexOf(btnElement);

        niveauxArray.splice(clickedNiveauIndex, 1);


        // DELETE HTML
        if (clickedNiveauIndex === 0) {

        } else {
            let allNiveaux = documet.querySelectorAll(".niveau-container");

            allNiveaux[clickedNiveauIndex].remove();

        }

        // UPDATE COUNTER
        niveauCounter--;
    })


}

function addNewNiveauHTML(niveauCounter) {
    return `
            <div class="col-md-12 col-xl-12 niveau-container">
            <div class="card">
                <div class="card-header ">
                    <h4 class="card-title col-sm-6" id="niveau-header">Niveaux de séniorité : `+ niveauCounter + `</h4>
                    <div class="btn-list col-sm-6 d-flex flex-row-reverse ">
                        <button type="button" class="btn btn-sm btn-icon btn-danger mx-2" id="btn-delete-niveau"><i
                        class="fe fe-trash"></i></button>
                        <button type="button" class="btn btn-sm btn-icon btn-primary mx-2" id="btn-edit-niveau"><i
                                class="fe fe-edit-3"></i></button> 
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

                        <a class="btn btn-primary mt-4 mb-0 " id="btn-add-niveau" role="button"
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

function saveToArray(array, element) {

}

function disableInputsFor(niveauContainer) {
    let inputs = niveauContainer.querySelectorAll("input");
    let selects = niveauContainer.querySelectorAll("select");

    Array.from(inputs).forEach((input) => {
        input.setAttribute("readonly", "");
    })

    Array.from(selects).forEach((select) => {
        select.setAttribute("disabled", "");
    })
}

function clearDisableFromInputsFor(niveauContainer) {
    let inputs = niveauContainer.querySelectorAll("input");
    let selects = niveauContainer.querySelectorAll("select");

    Array.from(inputs).forEach((input) => {
        input.removeAttribute("readonly");
    })

    Array.from(selects).forEach((select) => {
        select.removeAttribute("disabled");
    })
}



