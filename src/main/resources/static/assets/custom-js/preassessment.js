console.log("presassessment.js");
let requestBodyAssessment = {

    "name": "",
    "targetedDirection": [],
    "status": "CREATED",
    "startedAt": null,
    "finishesAt": null,
    "targetEmplois": [],
    "assessmentCategories": "",
    "collaborateurs": [],
    "managers1": [],
    "managers2": [],
    "fichesEvaluations": []

}
const btnVisualize = document.querySelector("#btn-visualize");
const btnAddCriteria = document.querySelector("#btn-add-criteria");
const btnSaveCategory = document.querySelector("#btn-save-category");

let categorizationTable;
let populationTable;

// IMORTANT ARRAYS
let fichesEvaluations = [];


const inputFileUploader = document.querySelector("#assessment-excel-file");
let fileId;

let categoriesRequestBody = [];
let jsonFinalPreassessment = {};

let categoriesListDb = [];


const manager1Columns = [
    "MATRICULE_N1",
    "NOM_N1",
    "PRENOM_N1"
];
const manager2Columns = [
    "MATRICULE_N2",
    "NOM_N2",
    "PRENOM_N2"
];
const employeeColumns = [
    "MATRICULE",
    "NOM",
    "PRENOM"
];
const employeeBaseColumn = [
    "affectation (Code)",
    "affectation (Libelle)",
    "Fonction (Libelle)"
]

const emploiColumn = ["EMPLOIS_CIBLES", "NIVEAU_SENIORITÉ"];


let classificationColumns = [];

let populationArr = [];
let categorizedPopulationArr = [];

let indexOfDeletedCategory = -1;
let indexOfEditedCategory = -1;

let listOfNewCategories = [];

// REPRESENTS LISTS OF EMPLOIS IN POPULATION EXCEL FILE
let listEmploi = []


const form = document.querySelector("assessment-form");
let assessmentPropertyContainer = document.querySelectorAll(".assessment-property-container");



// EVENT LISTENERS ON TARGETED DIRECTION FIELD
Array.from(assessmentPropertyContainer).forEach((propertyContainer) => {

    $("#input-started-date").removeClass("is-invalid");
    $("#input-finishes-date").removeClass("is-invalid");

    propertyContainer.addEventListener("change", (e) => {

        let elementId = e.target.id;


        if (elementId === "input-name-campagne") {
            requestBodyAssessment["name"] = e.target.value;
        } else if (elementId === "input-started-date") {
            requestBodyAssessment["startedAt"] = e.target.value;
        } else if (elementId === "input-finishes-date") {
            requestBodyAssessment["finishesAt"] = e.target.value;
        } else if (e.target.getAttribute("type") === "checkbox") {
            console.log(e.target.checked);
            if (e.target.checked) {
                requestBodyAssessment["targetedDirection"].push(e.target.value);
            } else {
                let index = requestBodyAssessment["targetedDirection"].indexOf(e.target.value);
                console.log(index);

                if (index > -1) {
                    requestBodyAssessment["targetedDirection"].splice(index, 1);
                    console.log(requestBodyAssessment["targetedDirection"]);
                }
            }

        }


        console.log(requestBodyAssessment);
    })
})

// Special Event listener for Select2:select element 
$(function () {

    $("#input-regions-campagne").select2();

    $("#input-regions-campagne").change(function (e) {

        let selected = $("#input-regions-campagne").select2('data');
        requestBodyAssessment["targetedDirection"] = getSelect2Selections(selected);
        console.log(getSelect2Selections(selected));
    })

    // EVENT LISTENER WHEN WE SAVE AN ASSESSMENT
    $("#btn-assessment-lanch").click(function (e) {

        // CHECK IF THERE IS SOME UNCATEGORIED COLLABORATEUR
        if (checkForUncategorizedCollaborateur()) {
            showModal("warning", "Vous ne pouvez pas sauvegarder cette évaluation", "Certains employés ne sont pas catégorisés ; veuillez retourner à la phase de catégorisation et les inclure", "")
        } else {

            // //SAVE NEW CATEGORIES TO DB  then SAVE ASSESSMENT-CATEGORIES
            let newCategories = [];
            categoriesRequestBody.map((cat, index) => {
                if (listOfNewCategories.includes(cat.name)) {
                    newCategories.push({
                        "name": cat.name,
                        "contentAssessment": cat.contentAssessment
                    })
                }
            })
            postCategories(newCategories).then((catArr) => {

                // SAVE ASSESSMENT TO DB
                console.log("POST ASSESSMENT");

                // CHANGE THE STATUS OF THE ASSESSMENT TO "LANCHED"
                requestBodyAssessment.status = "LANCHED";

                // DELETE THE ASSOCIATED ASSESSMENT TEMP 
                let assessmentName = requestBodyAssessment.name;
                deleteTempAssessment(assessmentName).then((success) => {

                    // CHECK IF SUCCESS  == 1
                    if (success != 1) {

                        // SHOW ERROR MODAL

                    } else {

                        //  SEND POST REQUEST TO SAVE ASSESSMENT AND ALL OTHER ENTITIES
                        postAssessment(requestBodyAssessment).then((assessment) => {

                            // SHOW SUCCESS MODAL
                            showModal("success", "Assessment enregistré ", "L'évaluation a été enregistrée avec succès. L'étape suivante consiste à lancer l'assessment. ", "");

                            // REDIRECT TO THE LIST OF ASSESSMENTS
                            setTimeout(function () {
                                let currentUrl = window.location.href;

                                window.open(extractDomain(currentUrl) + "assessment/list");
                            }, 3000);



                        });

                    }
                })





            });

        
        }




    })

    // EVENT LISTENER TO SAVE THE ASSESSMENT 
    $("#btn-assessment-save").click(function (e) {

        let assessmentVariablesContent = {

            "targetedDirection": requestBodyAssessment.targetedDirection,
            "status": requestBodyAssessment.status,
            "startedAt": requestBodyAssessment.startedAt,
            "finishesAt": requestBodyAssessment.finishesAt,
            "categoriesRequestBody": categoriesRequestBody,
            "classificationColumns": classificationColumns,
            "populationArr": populationArr,
            "categorizedPopulationArr": categorizedPopulationArr,
            "listOfNewCategories": listOfNewCategories,
            "listEmploi": listEmploi
        };

        let savedAssessment = {
            "name": requestBodyAssessment.name,
            "content": JSON.stringify(assessmentVariablesContent)
        };

        console.log(savedAssessment);

        // CHECK IF THE ASSESSMENT IS CREATEDFOR TE FIRST TIME OR IT IS A MODIFICATION
        if (localStorage.getItem("assessmentId") != null) {

            savedAssessment.id = parseInt(localStorage.getItem("assessmentId"));

            // SAVE THIS TO ASSESSMENT-TEMPORARY MODEL
            postToAssessmentTemp(savedAssessment, 'PUT').then((success) => {

                // SHOW SUCCESS THAT THE ASSESSMENT IS SAVED
                showModal("success", "Assessment est bien sauvegardé", "L'assessment a été sauvegardé avec succès. Vous pouvez éditer et modifier cette évaluation plus tard à partir de la liste des assessments sur le tableau de bord.")

                console.log(success);

                // REMOVE ANY ASSESSMENT-ID
                removeAssessmentFromStorage();

                // REDIRECT TO THE LIST OF ASSESSMENTS
                setTimeout(function () {
                    let currentUrl = window.location.href;

                    window.open(extractDomain(currentUrl) + "assessment/list");
                }, 3000);

            }).catch((error) => {
                console.log(error);
            })

        } else {

            // SAVE THIS TO ASSESSMENT-TEMPORARY MODEL
            postToAssessmentTemp(savedAssessment, 'POST').then((success) => {

                // SHOW SUCCESS THAT THE ASSESSMENT IS SAVED
                showModal("success", "Assessment est bien sauvegardé", "L'assessment a été sauvegardé avec succès. Vous pouvez éditer et modifier cette évaluation plus tard à partir de la liste des assessments sur le tableau de bord.")

                // console.log(success); 

                // REMOVE ANY ASSESSMENT-ID
                removeAssessmentFromStorage();

                // REDIRECT TO THE LIST OF ASSESSMENTS
                setTimeout(function () {
                    let currentUrl = window.location.href;

                    window.open(extractDomain(currentUrl) + "assessment/list");
                }, 5000);

            }).catch((error) => {
                console.log(error);
            })
        }



    })

    $("#evaluation-content").select2();
    $("#select-classification").select2();

    // GET REQUEST TO GET LIST OF CATEGORIES
    getListOfCategories();


})

function removeAssessmentFromStorage() {
    if (localStorage.getItem("assessmentId") != null) {
        localStorage.removeItem("assessmentId");
    }
}


btnAddCriteria.addEventListener('click', () => {

    addNewCriteria();
})



// EVENT LISTENER WHEN WE ADD NEW CATEGORY TO THE TABLE
btnSaveCategory.addEventListener('click', () => {

    if (!checkInputsValidity()) {
        if (indexOfEditedCategory === -1) {

            // SAVE CATEGORY TO THE JSON
            let newCategory = {
                "name": $("#name-categorie").select2('data')[0].text,
                "contentAssessment": getSelect2Selections($("#evaluation-content").select2('data')),
                "criterias": []
            }

            let criteriasContainers = document.querySelectorAll(".criteria-container");

            $(".criteria-container").each(function (index) {
                let selectedValue = $(this).find("#select-classification").select2('data')[0].id;


                let criteria = {
                    "name": selectedValue
                }

                if (typeOfSelection(selectedValue) === "number") {

                    criteria.min = $(this).find("#min-value").val();
                    criteria.max = $(this).find("#max-value").val();

                } else if (typeOfSelection(selectedValue) === "string") {
                    criteria.value = $(this).find("#valeur-criteria").val();
                }


                newCategory["criterias"].push(criteria);

                console.log(criteria);
            })

            categoriesRequestBody.push(newCategory);

            // POPULATE THE TABLE
            parseToCategoryTable(categoriesRequestBody);

        } else {

            categoriesRequestBody[indexOfEditedCategory] = {
                "name": $("#name-categorie").select2('data')[0].text,
                "contentAssessment": getSelect2Selections($("#evaluation-content").select2('data')),
                "criterias": []
            }

            $(".criteria-container").each(function (index) {
                let selectedValue = $(this).find("#select-classification").select2('data')[0].id;


                let criteria = {
                    "name": selectedValue
                }

                if (typeOfSelection(selectedValue) === "number") {

                    criteria.min = $(this).find("#min-value").val();
                    criteria.max = $(this).find("#max-value").val();

                } else if (typeOfSelection(selectedValue) === "string") {
                    criteria.value = $(this).find("#valeur-criteria").val();
                }


                categoriesRequestBody[indexOfEditedCategory]["criterias"].push(criteria);


            })

            //console.log(categoriesRequestBody);

            //INITIALIZE THE INDEX
            indexOfEditedCategory = -1;

            // POPULATE THE TABLE
            parseToCategoryTable(categoriesRequestBody);

        }

        // USING JAVASCRIPT
        let categoryContainer = document.querySelector("#category-container");
        categoryContainer.innerHTML = `
        <div id="category-container">

            <div class="form-group">
                <label for="name-categorie" class="form-label">Nom de la catégorie</label>
                <select type="text" class="form-control select2" id="name-categorie"
                    placeholder="Eg: Cat 1, ..." data-width="100%"></select>
            </div>
            <div class="form-group">
                <label for="type-assessment-categorie" class="form-label">Contenue de
                    l'évaluation</label>

                <select multiple="multiple" class="form-control form-select select2"
                    id="evaluation-content" data-width="100%">
                    <option value="responsabilites">Responsabilités - Finalités</option>
                    <option value="exigences">Exigences spécifiques de l’emploi</option>
                    <option value="marqueurs">Marqueurs de séniorité</option>
                    <option value="competences-dc">Compétences requises - Domaines de connaissance
                    </option>
                    <option value="competences-sf">Compétences requises - Savoir-faire</option>
                    <option value="competences-se">Compétences requises - Savoir-être</option>

                </select>

            </div>

            <div class="criterias-container">
                <div class="criteria-container">

                    <div class="form-group">
                        <label for="name-categorie" class="form-label">Choisissez un critière de
                            classification</label>
                        <select class="form-control select2 form-select select-criteria"
                            data-placeholder="------ Sélectionnez une option ------"
                            id="select-classification" data-width="100%">
                        </select>
                    </div>
                    <div class="form-row input-criteria" id="value-criteria-container">

                    </div>
                </div>
            </div>

        </div>
        `;

        // INITILIZE SELECT2 ON THE SELECT FIELDS

        //INITILIAZE SELECT2 ON NOM DE CATEGORIE INPUT
        $("#name-categorie").select2({
            data: getCategoriesForSelect2(categoriesListDb),
            tags: true,
            tokenSeparators: [',']
        })

        // ADD EVENT LISTENER TO NAME OF CATEGORY
        $("#name-categorie").change(function (e) {
            let isNew = true;
            console.log("change");


            // var keycode = (e.keyCode ? e.keyCode : e.which);
            // console.log(keycode);

            // if (keycode == '13') {
            // e.stopPropagation();
            categoriesListDb.map((cat, index) => {
                if ($("#name-categorie").select2('data')[0].text === cat.name) {
                    isNew = false;
                    $("#evaluation-content").val(cat.contentAssessment).trigger("change");

                    // DISABLE ASSESSMENT CONTENT FIELD
                    $("#evaluation-content").prop("disabled", true);
                }
            })
            console.log(isNew);
            if (isNew) {
                // SHOW A MODAL TO CONFIRM IF YOU WANT TO ADD THIS CATEGORY
                //showModal("confirm", "Ajout d'une nouvelle catégorie !", 'Vous allez ajouter une nouvelle catégorie, veuillez confirmer votre choix en cliquant sur "Oui" bouton', "category")
                listOfNewCategories.push($("#name-categorie").select2('data')[0].text);

                // DELETE THE DISABLE PROPERTY FROM THE INPUT
                $("#evaluation-content").removeProp("disabled");

                $("#evaluation-content").val(null).trigger("change");
            }


        })
        $("#evaluation-content").select2();
        $("#select-classification").select2();


        // POPULATE CRITERIA FIEDS
        populateWithClassificationColumns();


    }






    // EMPTY FIELDS

    // USING JQUERY

    // $("#name-categorie").val(null);
    // $("#type-assessment-categorie").val(null);
    // $(".criteria-container").each(function (index, element) {
    //     console.log(index, element);
    //     if (index === 0) {
    //         element.innerHTML = `
    //                             <div class="form-group">
    //                                 <label for="name-categorie" class="form-label">Choisissez un critière de
    //                                     classification</label>
    //                                 <select class="form-control select2 form-select select-criteria"
    //                                     data-placeholder="------ Sélectionnez une option ------"
    //                                     id="select-classification">
    //                                 </select>
    //                             </div>
    //                             <div class="form-row input-criteria" id="value-criteria-container">

    //                             </div>
    //         `;

    //     } else {
    //         element.remove();
    //     }
    // })


})

// EVENT LISTENER WHEN WE ADD A LIST OF POPULATION

inputFileUploader.addEventListener('change', (e) => {
    let input = document.getElementById('assessment-excel-file');
    let file = input.files[0];

    // btnVisualize.classList.add("btn-loading");

    parseExcelPopulation(file).then((data) => {

        // REMOVE LOADING EFFECT
        // btnVisualize.classList.remove("btn-loading");

        let excelData = data[0];
        listEmploi = data[1];

        populationArr = excelData;

        console.log(populationArr);



        // console.log(fileId, data);

        // INITIALTE DATATABLE
        let dataSet = excelData.filter((element, index) => {
            if (index !== 0) return true;
        });

        let col = generateColumnsForDatatable(excelData[0]);

        $("#tb1").DataTable({
            data: dataSet,
            columns: col
        });


        classificationColumns = getClassificationColumn(excelData[0]);

        populateWithClassificationColumns();


    }).catch((error) => {
        console.log(error);

        // SHOW ERROR MODAL
        showModal("error", "Mauvais format de fichier", "Vérifiez que vous avez téléchargé le bon fichier de compétence et assurez-vous qu'il respecte le format de fichier standard.", "");
    });

    postExcelFile(file);
})

$("#btn-suivant-category-section").click(function () {
    console.log("CLIKKKK");
    $(".emploi-cible-list").html("");
    populateEmploiSection(listEmploi);
})

// EVENT LISTENER TO CATEGORIZE THE POPULATION BASED ON LIST OF CATEGORIES SAVED IN THE TABLE
$("#btn-categorize").click(function (e) {

    // SHOW ERROR MODAL WHEN CATEGORIES TABLE ARE NOT FILLLED OR ONLY ONE CATEGORY IS CREATED
    if (categoriesRequestBody.length === 0 && categoriesRequestBody.length === 1) {

        showModal("warning", "Attention", "Vous ne pouvez pas catégoriser la population. Veuillez créer au moins deux catégories pour pouvoir continuer sans problème.", "")

    } else {

        // INITILIZE TABLE TB2
        categorizedPopulationArr = JSON.parse(JSON.stringify(populationArr));
        let categorizedData = categorizePopulation(categorizedPopulationArr, categoriesRequestBody);
        let col = generateColumnsForDatatable(categorizedData[0]);
        let dataSet = categorizedData.filter((e, i) => {
            if (i !== 0) return true;
        })

        if (typeof (categorizationTable) === "undefined") {
            console.log("first time");
            categorizationTable = $("#tb2").DataTable(
                {
                    data: dataSet,
                    columns: col
                }
            );

            // WE FILL ASSESSMENT REQUEST BODY JSON

        } else {
            // console.log( "second time");
            // console.log(dataSet);
            categorizationTable.clear();
            categorizationTable.rows.add(dataSet);
            categorizationTable.draw();
        }


        // UPDATE ASSESSMENT JSON VARIABLE WITH NEW VALUES AFTER INITILILIZATION
        requestBodyAssessment.targetEmplois = [];
        requestBodyAssessment.assessmentCategories = [];
        requestBodyAssessment.collaborateurs = [];
        requestBodyAssessment.managers1 = [];
        requestBodyAssessment.managers2 = [];
        requestBodyAssessment.fichesEvaluations = [];

        requestBodyAssessment.targetEmplois = generateTargetedEmplois();
        requestBodyAssessment.assessmentCategories = generateAssessmentCategory();

        let managers1 = [];
        let managers2 = [];
        for (var i = 0; i < categorizedPopulationArr.length; i++) {
            if (i != 0) {

                let row = categorizedPopulationArr[i];
                requestBodyAssessment.collaborateurs.push(generateCollaborateur(row));
                managers1.push(generateManager1(row));
                managers2.push(generateManager2(row));
                requestBodyAssessment.fichesEvaluations.push(generateFicheEvaluation(row));

            }
        }
        requestBodyAssessment.managers1 = [...new Set(
            managers1
                .map(element => element.matricule)
                .map((mat) => {
                    return managers1.find(e => e.matricule === mat)
                }))];
        requestBodyAssessment.managers2 = [...new Set(
            managers2
                .map(element => element.matricule)
                .map((mat) => {
                    return managers2.find(e => e.matricule === mat)
                }))];


        // SHOW SUCCESS MODAL 
        showModal("success", "Population catégorisée", "La liste de la population a été catégorisée avec succès sur la base des catégories créées. Allez à l'étape 3 pour voir le résultat", "");
    }


})

function populateEmploiSection(arr) {

    for (var i = 0; i < arr.length; i++) {

        let arr2 = arr[i].split("_");

        //DEFINE EMPLOI NAME + EMPLOI LEVEL
        let emploiName = arr2[0];
        let emploiLevel = arr2[1];



        // CREATE THE DROPDOWN CONTAINER
        $(".emploi-cible-list").last().append(`
        <div class="dropdown">
            <button type="button" class="btn btn-info dropdown-toggle" data-bs-toggle="dropdown">
                    <i class="fe fe-calendar me-2"></i>` + arr[i] + `
                </button>
            <div class="dropdown-menu fiche-eva-category">
                
            </div>
        </div>
        `);

        // ITERATE OVER THE CATEGOREIS
        for (var j = 0; j < categoriesRequestBody.length; j++) {

            let doesResponsabilitesExist = false;
            let doesMarqueursExist = false;
            let doesExigencesExist = false;
            let doesCompetencesDcExist = false;
            let doesCompetencesSeExist = false;
            let doesCompetencesSfExist = false;

            let category = categoriesRequestBody[j];

            //GET THE CATEGORY ASSESSMENT_CONTENT PROPERTY
            category.contentAssessment.map((e, i) => {
                switch (e) {
                    case "responsabilites":
                        doesResponsabilitesExist = true;
                        break;

                    case "exigences":
                        doesExigencesExist = true;
                        break;

                    case "marqueurs":
                        doesMarqueursExist = true;
                        break;

                    case "competences-dc":
                        doesCompetencesDcExist = true;
                        break;

                    case "competences-sf":
                        doesCompetencesSfExist = true;
                        break;

                    case "competences-se":
                        doesCompetencesSeExist = true;
                        break;


                }
            })

            // BUILD URL 
            let urlParams = {
                "eName": emploiName,
                "level": emploiLevel,
                "marqueurs": doesMarqueursExist,
                "exigences": doesExigencesExist,
                "responsabilites": doesResponsabilitesExist,
                "competences_dc": doesCompetencesDcExist,
                "competences_se": doesCompetencesSeExist,
                "competences_sf": doesCompetencesSfExist,
            }
            let url = buildURL("/assessment/add/fiche", urlParams);

            // APPEND DROPDOWN MENU
            $(".fiche-eva-category").last().append(`
                <a class="dropdown-item" href="` + url + `" target="_blank">` + category.name + `</a>
            `)
        }







        // $(".emploi-cible-list").append(`<button class="btn btn-secondary" href="">` + arr[i] + `</button>`);
    }
}

function buildURL(prefix, params) {

    let url = prefix + "?";
    for (var key of Object.keys(params)) {
        url = url + key + "=" + params[key] + "&";
    }

    return url;
}

// async function fetchEmployeesData(id) {

//     let url = "http://localhost:8080/preassessment/api/v1/file/2json/" + id;

//     fetch(url, {
//         method: 'GET'
//     }).then(
//         response => response.json() // if the response is a JSON object
//     ).then(
//         success => {
//             console.log(success);
//             // RETURN AN ID OF THE FILE IS SAVED TO DB




//         } // Handle the success response object
//     ).catch(
//         error => console.log(error) // Handle the error response object
//     );

//     // try {
//     //     let res = await fetch(url);
//     //     let response = await res.json();

//     //     response["Déjà dans l'emploi"] = clearWhiteRows(response["Déjà dans l'emploi"])
//     //     jsonFinalPreassessment = response;

//     //     classificationColumns = getClassificationColumn(response["Déjà dans l'emploi"][0]);

//     //     parseToTable(response["Déjà dans l'emploi"]);


//     //     console.log(response);

//     // } catch (error) {
//     //     console.log(error);
//     // }

// }

async function postExcelFile(file) {

    let url = "http://localhost:8080/preassessment/api/v1/file/upload"

    let bodyFile = new FormData();

    bodyFile.append("file", file);

    //console.log(bodyFile);
    fetch(url, { // Your POST endpoint
        method: 'POST',
        headers: {
            // Content-Type may need to be completely **omitted**
            // or you may need something
        },
        body: bodyFile // This is your file object
    }).then(
        response => response.json() // if the response is a JSON object
    ).then(
        success => {
            console.log(success);
        }
    ).catch(
        error => console.log(error) // Handle the error response object
    );



}


async function postCategories(jsonArr) {
    let url = "http://localhost:8080/preassessment/api/v1/category/"

    return fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonArr)

    }).then(
        response => response.json()
    ).then(
        success => {
            console.log(success);

            return success;

            // POST ASSESSMENT-CATEGORY ENTITIES
            //postAssessmenCategories(categoriesRequestBody);

        }
    ).catch(
        error => console.log(error)
    )
}

async function postAssessmenCategories(jsonArr) {
    let url = "http://localhost:8080/preassessment/api/v1/assessment/category/"

    fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonArr)

    }).then(
        response => response.json()
    ).then(
        success => {
            console.log(success);

            // ASSIGN RESULTS TO ASSESSMENT JSON
            success.map((e, index) => {
                requestBodyAssessment.assessmentCategories.push(e.id);
            })


        }
    ).catch(
        error => console.log(error)
    )
}

async function getListOfCategories() {
    let url = "http://localhost:8080/preassessment/api/v1/category/"

    fetch(url, {
        method: 'GET'
    }).then(
        response => response.json()
    ).then(
        success => {
            console.log(success);
            categoriesListDb = success;
            return success;
        }
    ).then((list) => {
        //CREATE

        // INILIALIZE SELCET2 ON NOM DE LA CATEGORIE
        $("#name-categorie").select2({
            data: getCategoriesForSelect2(list),
            tags: true,
            tokenSeparators: [',']
        });

        // ADD EVENT LISTENER
        $("#name-categorie").change(function (e) {
            let isNew = true;
            console.log("change")

            // var keycode = (e.keyCode ? e.keyCode : e.which);
            // console.log(keycode);

            // if (keycode == '13') {
            // e.stopPropagation();
            categoriesListDb.map((cat, index) => {
                if ($("#name-categorie").select2('data')[0].text === cat.name) {
                    isNew = false;
                    $("#evaluation-content").val(cat.contentAssessment).trigger("change");

                    // DISABLE ASSESSMENT CONTENT FIELD
                    $("#evaluation-content").prop("disabled", true);
                }
            })
            console.log(isNew);
            if (isNew) {
                // SHOW A MODAL TO CONFIRM IF YOU WANT TO ADD THIS CATEGORY
                //showModal("confirm", "Ajout d'une nouvelle catégorie !", 'Vous allez ajouter une nouvelle catégorie, veuillez confirmer votre choix en cliquant sur "Oui" bouton', "category")
                listOfNewCategories.push($("#name-categorie").select2('data')[0].text);

                $("#evaluation-content").val(null).trigger("change");
            }


        })

    }).catch(
        error => console.log(error)
    )
}

async function deleteTempAssessment(assessmentName) {
    let url = "http://localhost:8080/preassessment/api/v1/assessment/temp/" + encodeURIComponent(assessmentName)

    return fetch(url, {
        method: 'DELETE'

    }).then(
        response => response.json()
    ).then(
       ( success) =>{ 
        console.log(success);
        return success;    
    }
    ).catch(
        error => console.log(error)
    )
}

async function postAssessment(jsonArr) {
    let url = "http://localhost:8080/preassessment/api/v1/assessment/"

    return fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonArr)

    }).then(
        response => response.json()
    ).then(
        (success) =>{ 
            console.log(success);
            return success;
        
        }
    ).catch(
        error => console.log(error)
    )
}

async function postToAssessmentTemp(json, requestType) {
    let url = "http://localhost:8080/preassessment/api/v1/assessment/temp";
    return fetch(url, {
        method: requestType,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(json)
    }).then(
        response => response.json()
    ).then(
        success => console.log(success)
    ).catch(
        error => console.log(error)
    )
}

// THIS FUNCTION : READ THE EXCEL FILE AND RETURNS A ARRAY OF POPULATION CONTENT + 
//                  GET THE LIST OF JOBS
function parseExcelPopulation(excelFile) {


    return new Promise((resolve, reject) => {
        // var files = inputElement.files || [];
        // if (!files.length) return;
        // var file = files[0];
        var file = excelFile;
        var excelData = [];
        let listOfEmplois = [];

        // console.time();
        var reader = new FileReader();

        reader.onloadend = function (event) {
            var arrayBuffer = reader.result;
            // var buffer = Buffer.from(arrayBuffer)
            // debugger

            var workbook = new ExcelJS.Workbook();
            // workbook.xlsx.read(buffer)
            workbook.xlsx.load(arrayBuffer).then(function (workbook) {
                console.timeEnd();
                // var result = ''
                try {
                    workbook.eachSheet(function (worksheet, sheetId) {

                        let index = 1;
                        while (worksheet.getRow(index).values.length !== 0) {
                            let rowValues = worksheet.getRow(index).values;
                            let rowArr = [];

                            rowValues.forEach((cell, index) => {
                                //console.log(cell, Object.prototype.toString.call(cell))

                                // FILTER OUT THE FOLLOWING TYPES : STRING, NULBER, DATE, JSON OBJECT
                                if (Object.prototype.toString.call(cell) === '[object Date]') {
                                    //console.log(index, cell, typeof(cell));
                                    rowArr.push(cell.toLocaleDateString())
                                    //console.log(cell.toLocaleDateString());
                                } else if (Object.prototype.toString.call(cell) === '[object Object]') {
                                    rowArr.push(cell.result);
                                } else {
                                    rowArr.push(cell);
                                }

                            })

                            excelData.push(rowArr);

                            index++;
                        }

                        // GET EMPLOI COLUMN INDEX
                        let indexOfEmploiCol = excelData[0].indexOf("EMPLOIS_CIBLES");
                        //let indexOfSenioriteEmploi = excelData[0].indexOf("NIVEAU_SENIORITÉ");
                        let emploiCol = worksheet.getColumn(indexOfEmploiCol + 1).values;
                        //let senioriteCol = worksheet.getColumn(indexOfSenioriteEmploi + 1).values;

                        listOfEmplois = emploiCol.map((e, i) => {
                            if (typeof (e) === 'undefined' || i === 0) {
                                return null;
                            } else {
                                return e;
                            }

                        })

                        listOfEmplois = [...new Set(listOfEmplois)].filter((e) => {
                            if (typeof (e) === 'undefined' || e === "EMPLOIS_CIBLES") {
                                return false;
                            } else {

                                return true;
                            }
                        });


                        // START POPULATE THE 


                    });
                } catch (error) {
                    console.error(error);
                    throw error;
                }


                return [excelData, listOfEmplois];


            }).then((data) => {
                resolve(data);
            }).catch((error) => {
                console.error(error);
                reject(error);
            });


        };
        reader.readAsArrayBuffer(file);


    })
}

function clearWhiteRows(jsonArray) {
    return jsonArray.filter((json) => {
        let compteur = 0;
        let jsonLength = Object.keys(json).length;
        //console.log(jsonLength);
        Object.entries(json).forEach(([key, value]) => {
            if (value === "") {
                compteur++;
            }
        })

        if (compteur != jsonLength) {
            return true;
        }
    })
}

function getClassificationColumn(obj) {
    let classificationColumns = [];
    //console.log("inside classification", Array.isArray(obj), obj);

    if (Array.isArray(obj)) {
        obj.forEach((col) => {
            if (!(manager1Columns.includes(col) || manager2Columns.includes(col) || employeeColumns.includes(col) || col === null || emploiColumn.includes(col))) {
                classificationColumns.push(col);
            }
        })
    } else {
        // FOR JSON FORMAT
        Object.entries(obj).forEach(([key, value]) => {
            if (!(manager1Columns.includes(key) || manager2Columns.includes(key) || employeeColumns.includes(key) || key === null || emploiColumn.includes(col))) {
                classificationColumns.push(key);
            }
        })
    }



    return classificationColumns;
}


// function parseToTable(json) {

//     console.log("from parseToTable method");
//     console.log(json);
//     // const table = document.getElementsByClassName('table table-striped');
//     // console.log(table);
//     let tableHeader = document.querySelector("#assessment-population-thead");
//     let tableBody = document.querySelector("#assessment-population-tbody");

//     // Delete any content header and body
//     tableHeader.innerHTML = "";
//     tableBody.innerHTML = "";

//     // EXTRACT VALUE FOR HTML HEADER. 

//     var col = [];
//     for (var i = 0; i < json.length; i++) {
//         for (var key in json[i]) {
//             if (col.indexOf(key) === -1) {
//                 col.push(key);
//             }
//         }
//     }

//     // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

//     var tr = tableHeader.insertRow(-1);                   // TABLE ROW.

//     for (var i = 0; i < col.length; i++) {
//         var th = document.createElement("th");      // TABLE HEADER.

//         th.innerHTML = col[i];
//         tr.appendChild(th);

//         th.classList.add("wd-15p", "border-bottom-0");
//     }

//     // ADD JSON DATA TO THE TABLE AS ROWS.
//     for (var i = 0; i < json.length; i++) {

//         tr = tableBody.insertRow(-1);

//         for (var j = 0; j < col.length; j++) {
//             var tabCell = tr.insertCell(-1);
//             tabCell.innerHTML = json[i][col[j]];
//         }
//     }


//     // ADD DATABALE LIBRARY SCRIPTS
//     // loadJS("/assets/plugins/datatable/js/jquery.dataTables.min.js", false);
//     // loadJS("/assets/plugins/datatable/js/dataTables.bootstrap5.js", false);
//     // loadJS("/assets/plugins/datatable/js/dataTables.buttons.min.js", false);
//     // loadJS("/assets/plugins/datatable/js/buttons.bootstrap5.min.js", false);
//     // loadJS("/assets/plugins/datatable/js/jszip.min.js", false);
//     // loadJS("/assets/plugins/datatable/pdfmake/pdfmake.min.js", false);
//     // loadJS("/assets/plugins/datatable/pdfmake/vfs_fonts.js", false);
//     // loadJS("/assets/plugins/datatable/js/buttons.html5.min.js", false);
//     // loadJS("/assets/plugins/datatable/js/buttons.print.min.js", false);
//     // loadJS("/assets/plugins/datatable/js/buttons.colVis.min.js", false);
//     // loadJS("/assets/plugins/datatable/dataTables.responsive.min.js", false);
//     // loadJS("/assets/plugins/datatable/responsive.bootstrap5.min.js", false);
//     // loadJS("/assets/js/table-data.js", false);


//     // INITIALTE DATATABLE
//     $("#tb1").DataTable();

//     // POPULATE LIST OF CRITERIA
//     populateWithClassificationColumns();

// }

//THIS FUNCTION MMITATES THE ROLE OF PARSETOTABLE() BUT WITH EXCEL JS LIBRARY

// function parseToPopulationTable(arr) {

//     let tableHeader = document.querySelector("#assessment-population-thead");
//     let tableBody = document.querySelector("#assessment-population-tbody");

//     // Delete any content header and body
//     tableHeader.innerHTML = "";
//     tableBody.innerHTML = "";

//     for (let i = 0; i <= arr.length; i++) {
//         // INSERT VALUES TO THE HEADER
//         if (i === 0) {
//             var tr = tableHeader.insertRow(-1);                   // TABLE ROW.

//             for (var j = 0; j < arr[i][j]; j++) {
//                 var th = document.createElement("th");      // TABLE HEADER.

//                 th.innerHTML = arr[i][j];
//                 tr.appendChild(th);

//                 th.classList.add("wd-15p", "border-bottom-0");
//             }
//         } else {
//             // INSERT VALUES TO BODY
//             tr = tableBody.insertRow(-1);

//             for (var j = 0; j < arr[i][j]; j++) {
//                 var tabCell = tr.insertCell(-1);
//                 tabCell.innerHTML = arr[i][j];
//             }
//         }

//     }

//     // // INITIALTE DATATABLE
//     // $("#tb1").DataTable();

//     // POPULATE LIST OF CRITERIA
//     populateWithClassificationColumns();



// }

// function loadJS(FILE_URL, async = true) {
//     let scriptEle = document.createElement("script");

//     scriptEle.setAttribute("src", FILE_URL);
//     scriptEle.setAttribute("type", "text/javascript");
//     scriptEle.setAttribute("async", async);

//     document.body.appendChild(scriptEle);

//     // success event 
//     scriptEle.addEventListener("load", () => {
//         console.log("File loaded")
//     });
//     // error event
//     scriptEle.addEventListener("error", (ev) => {
//         console.log("Error on loading file", ev);
//     });
// }

function lastCriteriaContainer() {
    let lastCategory = document.querySelector("#category-container");
    let allCriteriasContainers = lastCategory.querySelectorAll(".criteria-container");

    let lastCriteria = allCriteriasContainers[[allCriteriasContainers.length - 1]];

    return lastCriteria;
}

function generateColumnsForDatatable(arr) {
    let colArr = [];
    //console.log(arr);
    arr.map((e, i) => {
        colArr.push({
            "title": e
        })
    })

    return colArr;
}

function getCategoriesForSelect2(arr) {
    console.log(arr);
    let result = [""];
    let id = 1
    arr.map((cat, index) => {
        result.push({
            "id": id++,
            "text": cat.name
        })
    })

    return result;
}


// IT : POPULATES THE SELECT FIELDS WITH OPTIONS 
//      + EVENT LISTENERS TO -> (CHANGE, SELECT FIELDS) AND (CLICK, DELETE CRITERIA BTN)
function populateWithClassificationColumns() {

    let lastCriteria = lastCriteriaContainer();

    let lastSelectField = $(".select-criteria").last()[0];

    let defaultOption = new Option("");
    defaultOption.setAttribute("label", "------ Sélectionnez une option ------");
    defaultOption.setAttribute("selected", "");
    lastSelectField.appendChild(defaultOption);
    classificationColumns.map(e => {
        var option = new Option(e, e);
        lastSelectField.appendChild(option);
    })

    // Add an event listener to the select
    $(".select-criteria").last().change(function (e) {
        //console.log(e.currentTarget.value);

        // GET THE VALUE OF THE SELECTION
        let selectedValue = e.currentTarget.value;
        let input_criteria_html;
        //console.log(typeOfSelection(selectedValue), selectedValue);
        if (typeOfSelection(selectedValue) === "string") {
            input_criteria_html = `
            
                <div class="form-group col-md-12 mb-0">
                    <label for="valeur-criteria" class="form-label">Valeur du critière </label>
                    <input type="text" class="form-control" id="valeur-criteria"
                        placeholder=".........">

                        <div id="invalid-value" class="invalid-feedback">
                            
                        </div>
                </div>
                <div class="my-3 w-100 text-center">
                    <button id="btn-delete-criteria" type="button" 
                    class="btn btn-icon me-2 btn-danger-light"> <i class="fe fe-trash-2"></i>Supprimer le critère</button>
                
            `;
            $(".input-criteria").last().html(input_criteria_html);


        } else if (typeOfSelection(selectedValue) === "number") {
            input_criteria_html = `
                
                    <div class="form-group col-md-6 mb-0">
                        <div class="form-group">
                            <label for="min-value" class="form-label">Min value : </label>
                            <input type="number" class="form-control" id="min-value">

                            <div id="invalid-min" class="invalid-feedback">
                            
                            </div>
                        </div>
                        
                    </div>
                    <div class="form-group col-md-6 mb-0">
                        <div class="form-group">
                            <label for="max-value" class="form-label">Max value : </label>
                            <input type="number" class="form-control" id="max-value">
                            
                            <div id="invalid-max" class="invalid-feedback">
                            
                            </div>
                        </div>
                        
                    </div>
                    <div class="my-3 w-100  text-center">
                        <button id="btn-delete-criteria" type="button" 
                        class="btn btn-icon me-2 btn-danger-light"> <i class="fe fe-trash-2"></i> Supprimer le critère</button>
                    </div>
                
            `;


        }

        // POPULATE CRITERIA VALUES CONTAINER
        $(".input-criteria").last().html(input_criteria_html);

        let btnDeleteCriteria = $(".criteria-container").last().find("#btn-delete-criteria")[0];

        //console.log(btnDeleteCriteria);

        //ADD EVENT LISTENER TO DELETE BTN
        btnDeleteCriteria.addEventListener("click", (e) => {

            console.log("HEERREEE")
            let deleteBtn;
            if (e.target.tagName === "I") {
                deleteBtn = e.target.parentElement;
            } else {
                deleteBtn = e.target;
            }

            let allBtnsDelete = document.querySelectorAll("#btn-delete-criteria");

            let allCriteriaContainer = document.querySelectorAll(".criteria-container");


            // console.log([...test].indexOf(e.target));

            let indexOfSelectedCriteria = [...allBtnsDelete].indexOf(deleteBtn);

            if (indexOfSelectedCriteria === 0) {
                let criteriaContainer = [...allCriteriaContainer][0];

                let firstValueCriteriaContainer = criteriaContainer.querySelector("#value-criteria-container");

                firstValueCriteriaContainer.innerHTML = ` `;


            } else {
                let criteriaContainer = [...allCriteriaContainer][indexOfSelectedCriteria];
                criteriaContainer.remove();
            }

            // let valueCriteriaContainer = e.target.parentElement.parentElement;

            // console.log(valueCriteriaContainer);



            // valueCriteriaContainer.outerHTML = `
            // <div class="form-row" id="value-criteria-container">

            // </div>
            // `;

        })
    })



}



function addNewCriteria() {

    let lastCriteria = lastCriteriaContainer();
    let parent = lastCriteria.parentElement;
    let newCriteria = document.createElement("div");


    parent.appendChild(newCriteria);


    newCriteria.outerHTML = `
    <div class="criteria-container">
        <div class="form-group">
            <label for="name-categorie" class="form-label">Choisissez un critière de
                classification</label>
            <select class="form-control select2 form-select select-criteria"
                data-placeholder="------ Sélectionnez une option ------"
                id="select-classification" data-width="100%">
            </select>
        </div>
        <div class="form-row input-criteria" id="value-criteria-container">

        </div>
    </div>
            `
        ;

    // INITIATES SELECT2 
    $(".criteria-container").last().find("#select-classification").select2();

    populateWithClassificationColumns();

}

function typeOfSelection(selection) {
    let colIndex = populationArr[0].indexOf(selection);
    return typeof (populationArr[1][colIndex]);
}

function parseToCategoryTable(categoryJson) {
    let tableBody = document.querySelector("#category-table-body");

    // Initilize the table body

    tableBody.innerHTML = ``;

    for (var i = 0; i < categoryJson.length; i++) {
        // Add new row
        let tr = tableBody.insertRow(-1);

        let nameCell = tr.insertCell(-1);
        nameCell.innerHTML = categoryJson[i].name;


        let actionsCell = tr.insertCell(-1);
        actionsCell.innerHTML = `
                <div class="g-3">
                    <a id="cat-table-btn-edit" class="btn text-primary btn-sm" data-bs-toggle="tooltip"
                        data-bs-original-title="Edit"><span class="fe fe-edit fs-14"></span></a>
                    
                    <a id="cat-table-btn-delete" class="btn text-danger btn-sm" data-bs-toggle="tooltip"
                        data-bs-original-title="Delete"><span
                            class="fe fe-trash-2 fs-14"></span></a>
                </div> 
        `;
    };

    let allDeleteCatBtns = tableBody.querySelectorAll("#cat-table-btn-delete");
    let allEditCatBtns = tableBody.querySelectorAll("#cat-table-btn-edit");


    Array.from(allDeleteCatBtns).forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", (e) => {

            // WHEN THE SPAN ELEMENT IS FIRED

            let aElement;
            if (e.target.tagName === "SPAN") {
                aElement = e.target.parentElement;
            } else {
                aElement = e.target;
            }



            let categoryIndex = [...allDeleteCatBtns].indexOf(aElement);

            indexOfDeletedCategory = categoryIndex;

            showModal("confirm", "Vous allez supprimer cette catégorie !", 'Cliquez sur le bouton "Oui" pour confirmer votre choix', "category")

            // console.log(categoryIndex);
            // categoriesRequestBody.splice(categoryIndex, 1);

            // parseToCategoryTable(categoriesRequestBody);

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

            // SHOW A MODAL THAT THIS FUNCTIONALITY IS NOT AVAILABLE YET
            showModal("info", "Cette fonctionnalité n'est pas disponible", "Nous travaillons sur cette fonctionnalité. Pour le moment, vous pouvez supprimer la catégorie --> puis en créer une nouvelle.");

            // let categoryIndex = [...allEditCatBtns].indexOf(aElement);

            // console.log(categoryIndex);


            // console.log(categoriesRequestBody[categoryIndex].contentAssessment);



            // // START POPULATE THE INPUTS
            // let contentInput = $("#evaluation-content").select2();
            // $("#name-categorie").val(categoriesRequestBody[categoryIndex].name);
            // contentInput.val(categoriesRequestBody[categoryIndex].contentAssessment).trigger("change");


            // indexOfEditedCategory = categoryIndex;
            // // $(".criteria-container").each(function(index , element) {

            // // })


            // // START POPULATE CRETERIA CONTAINER
            // let numberOfCriteria = categoriesRequestBody[categoryIndex].criterias.length;

            // // GET NUMBER OF CRITERIA
            // for (var i = 0; i < numberOfCriteria; i++) {

            //     // ------------- CREATE ONE CRITERIA CONTAINER -------------

            //     if (i !== 0) {

            //         console.log("1- I M NOT THE FIRST CRITERIA: I M CREATING A NEW CRITERIA CONTAINER");

            //         $(".criterias-container").append(`
            //         <div class="criteria-container">

            //             <div class="form-group">
            //                 <label for="name-categorie" class="form-label">Choisissez un critière de
            //                     classification</label>
            //                 <select class="form-control select2 form-select select-criteria"
            //                     data-placeholder="------ Sélectionnez une option ------"
            //                     id="select-classification">
            //                 </select>
            //             </div>
            //             <div class="form-row input-criteria" id="value-criteria-container">

            //             </div>
            //         </div>

            //         `);

            //         console.log("CRITERIA CONTAINER CRETAED");



            //         // POPULATE WITH VALUES OF SELECTED CATEGORY
            //         console.log("2 - I M TRYING TO POPULATE THE CRITERIA VALUES");

            //         //POPULTATE VALUES CRITERIA CONTAINER
            //         if (typeOfSelection(categoriesRequestBody[categoryIndex]["criterias"][i].name) === 'string') {

            //             console.log("2.1 - i M A STRING TYPE");

            //             $("#value-criteria-container").append(`
            //                 <div class="form-group col-md-12 mb-0">
            //                     <label for="valeur-criteria" class="form-label">Valeur du critière </label>
            //                     <input type="text" class="form-control" id="valeur-criteria"
            //                     placeholder=".........">
            //                 </div>
            //                 <div class="my-3 w-100 text-center">
            //                 <button id="btn-delete-criteria" type="button" class="btn btn-icon me-2 bradius btn-danger-light"> 
            //                     <i class="fe fe-trash-2"></i>
            //                 </button>
            //             `);

            //             $(".input-criteria").last().find("#valeur-criteria").val(categoriesRequestBody[categoryIndex]["criterias"][i].value);


            //         } else if (typeOfSelection(categoriesRequestBody[categoryIndex]["criterias"][i].name) === 'number') {

            //             console.log("2.2 - i M A NUMBER TYPE");

            //             $("#value-criteria-container").append(`
            //             <div class="form-group col-md-6 mb-0">
            //                 <div class="form-group">
            //                     <label for="min-value" class="form-label">Min value : </label>
            //                     <input type="number" class="form-control" id="min-value">
            //                 </div>
            //             </div>
            //             <div class="form-group col-md-6 mb-0">
            //                 <div class="form-group">
            //                     <label for="max-value" class="form-label">Max value : </label>
            //                     <input type="number" class="form-control" id="max-value">
            //                 </div>
            //             </div>
            //             <div class="my-3 w-100  text-center">
            //                 <button id="btn-delete-criteria" type="button" 
            //                 class="btn btn-icon me-2 bradius btn-danger-light"> <i class="fe fe-trash-2"></i></button>
            //             </div>
            //             `);

            //             $(".input-criteria").last().find("#max-value").val(parseInt(categoriesRequestBody[categoryIndex]["criterias"][i].max));
            //             $(".input-criteria").last().find("#min-value").val(parseInt(categoriesRequestBody[categoryIndex]["criterias"][i].min));

            //         }

            //     } else {

            //         console.log("1 - i M THE FIRST CRITERIA CONTAINER ");

            //         console.log("2 - i M THE TRYING TO POPULATETHE CRITERIACONTAINER ");


            //         //POPULTATE VALUES CRITERIA CONTAINER
            //         if (typeOfSelection(categoriesRequestBody[categoryIndex]["criterias"][i].name) === 'string') {

            //             console.log("2.1 - i M A STRING CRITERIA");

            //             $("#value-criteria-container").append(`
            //                 <div class="form-group col-md-12 mb-0">
            //                     <label for="valeur-criteria" class="form-label">Valeur du critière </label>
            //                     <input type="text" class="form-control" id="valeur-criteria"
            //                     placeholder=".........">
            //                 </div>
            //                 <div class="my-3 w-100 text-center">
            //                 <button id="btn-delete-criteria" type="button" class="btn btn-icon me-2 bradius btn-danger-light"> 
            //                     <i class="fe fe-trash-2"></i>
            //                 </button>
            //             `);

            //             $(".input-criteria").last().find("#valeur-criteria").val(categoriesRequestBody[categoryIndex]["criterias"][i].value);


            //         } else if (typeOfSelection(categoriesRequestBody[categoryIndex]["criterias"][i].name) === 'number') { // POPULATE CRITERIA VALUES CONTAINER CUZ THE CONTAINER IS ALREADY EXISTS

            //             console.log("2.1 - i M A NUMBER CRITERIA");

            //             $("#value-criteria-container").append(`
            //             <div class="form-group col-md-6 mb-0">
            //                 <div class="form-group">
            //                     <label for="min-value" class="form-label">Min value : </label>
            //                     <input type="number" class="form-control" id="min-value">
            //                 </div>
            //             </div>
            //             <div class="form-group col-md-6 mb-0">
            //                 <div class="form-group">
            //                     <label for="max-value" class="form-label">Max value : </label>
            //                     <input type="number" class="form-control" id="max-value">
            //                 </div>
            //             </div>
            //             <div class="my-3 w-100  text-center">
            //                 <button id="btn-delete-criteria" type="button" 
            //                 class="btn btn-icon me-2 bradius btn-danger-light"> <i class="fe fe-trash-2"></i></button>
            //             </div>
            //             `);

            //             $(".input-criteria").last().find("#max-value").val(parseInt(categoriesRequestBody[categoryIndex]["criterias"][i].max));
            //             $(".input-criteria").last().find("#max-value").val(parseInt(categoriesRequestBody[categoryIndex]["criterias"][i].min));

            //         }

            //         console.log("END OF POPULATING THE CRITERIA ");



            //     }

            //     // ------------- END CREATE ONE CRITERIA CONTAINER -------------


            //     //POPOLATE SELECT2 FIELD

            //     //POPOLUATE WITH CRITERIA COLUMNS
            //     populateWithClassificationColumns();


            //     // INITILIZE SELECT2
            //     let selectInput = $(".criteria-container").last().find("#select-classification").select2();

            //     // POPULATE THE SELECT INPUT OF CRITERIA
            //     selectInput.val(categoriesRequestBody[categoryIndex]["criterias"][i].name).trigger("change");


            // }





        })
    })

}

$("#confirm-yes-btn").click(function (e) {
    switch ($(this).attr("data-action")) {

        case "category":

            console.log(indexOfDeletedCategory);
            categoriesRequestBody.splice(indexOfDeletedCategory, 1);

            //INITIALIZE THE INDEX
            indexOfDeletedCategory = -1;

            parseToCategoryTable(categoriesRequestBody);

            break;
    }
})


// function addToCategoryTable(category) {
//     let tableBody = document.querySelector("#category-table-body");

//     // Add new row
//     let tr = tableBody.insertRow(-1);

//     let nameCell = tr.insertCell(-1);
//     nameCell.innerHTML = category.name;

//     let typeAssessment = tr.insertCell(-1);
//     typeAssessment.innerHTML = category.typeAssessment;

//     let actionsCell = tr.insertCell(-1);
//     actionsCell.innerHTML = `
//         <div class="g-3">
//             <a id="cat-table-btn-edit" class="btn text-primary btn-sm" data-bs-toggle="tooltip"
//                 data-bs-original-title="Edit"><span class="fe fe-edit fs-14"></span></a>
//             <a id="cat-table-btn-view" class="btn text-primary btn-sm" data-bs-toggle="tooltip"
//                 data-bs-original-title="View"><span class="fe fe-eye fs-14"></span></a>
//             <a id="cat-table-btn-delete" class="btn text-danger btn-sm" data-bs-toggle="tooltip"
//                 data-bs-original-title="Delete"><span
//                     class="fe fe-trash-2 fs-14"></span></a>
//         </div> 
//         `;


// }

// function findCategory(categoryName) {
//     return categoriesRequestBody.filter((category) => {
//         return category.name === categoryName;
//     })
// }


// function addCategoryToJon(newCategory) {
//     categoriesRequestBody.push(newCategory);
// }

// function parseToCategoryContainer(category, index) {
//     let categoryContainer = document.querySelector("#category-container");

//     categoryContainer.querySelector("#name-categorie").value = category.name;


//     let criteriasContainer = categoryContainer.querySelector("#");

//     // for (var i = 0; i < )
// }

function getSelect2Selections(arr) {
    return arr.map((e, index) => {
        return e.id;
    })
}

function showModal(type, header, content, action) {

    let modalId, modalHeaderId, modalContentId;


    switch (type) {
        case "success":
            modalId = "success";
            modalHeaderId = "#modal-success-header";
            modalContentId = "#modal-success-content";
            break;

        case "warning":
            modalId = "warning";
            modalHeaderId = "#modal-warning-header";
            modalContentId = "#modal-warning-content";
            break;

        case "info":
            modalId = "info";
            modalHeaderId = "#modal-info-header";
            modalContentId = "#modal-info-content";
            break;

        case "error":
            modalId = "modaldemo5";
            modalHeaderId = "#modal-error-header";
            modalContentId = "#modal-error-content";
            $("#confirm-yes-btn").attr("data-action", action);
            break;

        case "confirm":
            modalId = "confirm";
            modalHeaderId = "#modal-confirm-header";
            modalContentId = "#modal-confirm-content";
            $("#confirm-yes-btn").attr("data-action", action);
            break;
    }


    var myModal = new bootstrap.Modal(document.getElementById(modalId));

    // SET HEADER
    $(modalHeaderId).text(header);

    // SET CONTENT
    $(modalContentId).text(content)

    myModal.show();

}


// CHECK IF ALL CRITERIA VALUES INPUTS ARE NOT NULL + CHECK FOR LOGIC VALIDITY FOR MIN AND MAX 
// RETURN TRUE ----> FOUND NULL
// FALSE ------> ALL IS VALID
function checkInputsValidity() {

    let isNull = false;

    // LOOP OVER ALL CRITERIA CONTAINERS

    $(".criteria-container").each(function (index, criteria) {

        //  GET THE VALUE OF CRITERIA SELECTION
        let criteriaName = $(this).find("#select-classification").select2('data')[0].text;

        switch (typeOfSelection(criteriaName)) {
            case "string":
                // SELECT STRING INPUT
                if ($(this).find("#valeur-criteria").val() === "") {

                    $(this).find("#valeur-criteria").addClass("is-invalid");

                    $(this).find("#invalid-value").html('Ce champ ne doit pas être nul');
                    isNull = true;
                }
                break;

            case "number":
                console.log($(this).find("#min-value").val(), $(this).find("#max-value").val())

                // SELECT NUMBER INPUTS
                if ($(this).find("#min-value").val() === "" && $(this).find("#max-value").val() === "") {

                    $(this).find("#min-value").addClass("is-invalid");
                    $(this).find("#max-value").addClass("is-invalid");

                    $(this).find("#invalid-min").html('Ce champ ne doit pas être nul');
                    $(this).find("#invalid-max").html('Ce champ ne doit pas être nul');

                    isNull = true;

                } else if ($(this).find("#min-value").val() !== "" && $(this).find("#max-value").val() !== "") {

                    console.log(parseFloat($(this).find("#min-value").val()) > parseFloat($(this).find("#max-value").val()));
                    if (parseFloat($(this).find("#min-value").val()) > parseFloat($(this).find("#max-value").val())) {

                        $(this).find("#min-value").addClass("is-invalid");
                        $(this).find("#max-value").addClass("is-invalid");


                        $(this).find("#invalid-max").html('Cette valeur doit être strictement supérieure à la valeur minimale.');

                        isNull = true;
                    }

                } else {

                }
                break;
        }


    })

    return isNull;

}



function categorizePopulation(arr, catArr) {

    let newPopulationArr = [];
    let copyArr = [...arr];

    // ADD HEADER TO THE NEW ARR
    let header = copyArr[0];
    header.push("CATEGORIE");
    newPopulationArr.push(header);

    // SET UP CATEGORY FOR EVERY COLLABORATEUR
    for (var t = 0; t < copyArr.length; t++) {
        let categoryHasBeenSet = false;

        if (t !== 0) {
            let row = copyArr[t];

            // ITERATE OVER CATEGORIES ARR
            for (var j = 0; j < catArr.length; j++) {
                let category = catArr[j];

                let notVerified = false;
                let criteries = category.criterias;
                let compteur = criteries.length;


                // IF ONE CRITERIA IS NOT MATCHING, GO TO THE NEXT CATEGORY
                for (var i = 0; i < criteries.length; i++) {
                    let criteriaName = criteries[i].name;

                    let index = getIndexOfColumn(copyArr[0], criteriaName);


                    if (typeOfSelection(criteriaName) === "string") {
                        let criteriaValue = criteries[i].value;

                        if (row[index] === criteriaValue) {
                            compteur--;
                        } else {
                            notVerified = true;
                            break;
                        }

                    } else if (typeOfSelection(criteriaName) === "number") {
                        let min = criteries[i].min;
                        let max = criteries[i].max;


                        // POSSIBLE VALUE FOR MIN AND MAX
                        if (min !== '' && max !== '') {
                            if (row[index] >= parseFloat(min) && row[index] <= parseFloat(max)) {
                                compteur--;
                            } else {
                                notVerified = true;
                                break;
                            }
                        } else if (min === '') {
                            if (row[index] <= parseFloat(max)) {
                                compteur--;
                            } else {
                                notVerified = true;
                                break;
                            }
                        } else if (max === '') {
                            if (row[index] >= parseFloat(min)) {
                                compteur--;
                            } else {
                                notVerified = true;
                                break;
                            }
                        }

                    }

                }

                // WHEN ALL CRITERIAS ARE MATCHED, SET THE NEW CATEGORY
                if (compteur === 0) {
                    row.push(category.name);


                    // GO TO THE NEXT ROW
                    categoryHasBeenSet = true;
                    break;



                }

                // WHENE ONE CRITERIA IS NOT MATCH, GO TO THE NEXT CATEGORY
                if (notVerified) {
                    continue;
                }

            }

            // GO TO THE NEX ROW
            if (categoryHasBeenSet) {
                newPopulationArr.push(row);
                continue;
            } else { // NO MATCHED CATEGORY
                row.push("uncategorized");
                newPopulationArr.push(row);
            }


        }


    }

    return newPopulationArr;

}

function getIndexOfColumn(arr, column) {
    return arr.indexOf(column);
}

function generateCollaborateur(arr) {
    let indexOfMatriculle = getIndexOfColumn(categorizedPopulationArr[0], "MATRICULE");
    let indexOfPrenom = getIndexOfColumn(categorizedPopulationArr[0], "PRENOM");
    let indexOfNom = getIndexOfColumn(categorizedPopulationArr[0], "NOM");
    let indexOfDirection = getIndexOfColumn(categorizedPopulationArr[0], "affectation (Code)");
    let indexOfRole = getIndexOfColumn(categorizedPopulationArr[0], "Fonction (Libelle)");

    let collaborateurJson = {
        "firstName": arr[indexOfNom],
        "lastName": arr[indexOfPrenom],
        "matricule": arr[indexOfMatriculle],
        "role": arr[indexOfRole],
        "direction": arr[indexOfDirection],
        "topDirection": "",
        "managerOne": generateManager1(arr)
    }

    return collaborateurJson;
}

function generateManager1(arr) {
    let indexOfMatriculle = getIndexOfColumn(categorizedPopulationArr[0], "MATRICULE_N1");
    let indexOfPrenom = getIndexOfColumn(categorizedPopulationArr[0], "PRENOM_N1");
    let indexOfNom = getIndexOfColumn(categorizedPopulationArr[0], "NOM_N1");

    let managerJson = {
        "firstName": arr[indexOfNom],
        "lastName": arr[indexOfPrenom],
        "matricule": arr[indexOfMatriculle],
        "role": "",
        "direction": "",
        "topDirection": "",
        "manager": generateManager2(arr)
    }

    return managerJson;
}

function generateManager2(arr) {
    let indexOfMatriculle = getIndexOfColumn(categorizedPopulationArr[0], "MATRICULE_N2");
    let indexOfPrenom = getIndexOfColumn(categorizedPopulationArr[0], "PRENOM_N2");
    let indexOfNom = getIndexOfColumn(categorizedPopulationArr[0], "NOM_N2");

    let managerJson = {
        "firstName": arr[indexOfNom],
        "lastName": arr[indexOfPrenom],
        "matricule": arr[indexOfMatriculle],
        "role": "",
        "direction": "",
        "topDirection": ""
    }

    return managerJson;
}

function generateFicheEvaluation(arr) {

    let indexOfEmploi = getIndexOfColumn(categorizedPopulationArr[0], "EMPLOIS_CIBLES");
    let indexOfCategory = getIndexOfColumn(categorizedPopulationArr[0], "CATEGORIE");


    let ficheJson = {
        "score": "",
        "sousPoints": "",
        "surPoints": "",
        "createdAt": new Date(),
        "dateEvaluation": new Date(),
        "evaluateurOne": generateManager1(arr),
        "evaluateurTwo": generateManager2(arr),
        "collaborateur": generateCollaborateur(arr),
        "ficheContent": getEvaluationContentByCategory(arr[indexOfCategory]),
        "emploi": generateTargetedEmploi(arr),
    }
    return ficheJson;
}

function generateTargetedEmploi(arr) {

    let indexOfEmploi = getIndexOfColumn(categorizedPopulationArr[0], "EMPLOIS_CIBLES");

    let emploiJson = {
        "intitule": arr[indexOfEmploi].split("_")[0].toLowerCase(),
        "level": arr[indexOfEmploi].split("_")[1]
    }

    return emploiJson;
}

function generateTargetedEmplois() {

    let arr = [];

    listEmploi.map((e, i) => {
        arr.push({
            "intitule": (e.split("_")[0]).toLowerCase(),
            "level": parseInt(e.split("_")[1])
        })
    })

    return arr;

}

function generateAssessmentCategory() {

    let arr = [];

    categoriesRequestBody.map((e, i) => {
        arr.push({
            "categorie": {
                "name": e.name
            },
            "criterias": e.criterias
        })
    })


    return arr;
}

function getEvaluationContentByCategory(catName) {
    for (var i = 0; i < categoriesRequestBody.length; i++) {
        if (categoriesRequestBody[i].name === catName) {
            return categoriesRequestBody[i].contentAssessment;
        }
    }
}


function getCriteriasByCategory(catName) {
    for (var i = 0; i < categoriesRequestBody.length; i++) {
        if (categoriesRequestBody[i].name === catName) {
            return categoriesRequestBody[i].criterias;
        }
    }
}

function checkForUncategorizedCollaborateur() {
    let indexOfCategorie = getIndexOfColumn(categorizedPopulationArr[0], "CATEGORIE");

    let isFound = false;
    categorizedPopulationArr.map((row, index) => {
        if (index != 0) {
            if (row[indexOfCategorie] === "uncategorized") {
                isFound = true;
            }
        }
    });

    return isFound;
}
