console.log("presassessment.js");
let requestBodyAssessment = {

    "name": "",
    "targetedDirection": [],
    "startedAt": null,
    "finishesAt": null

}
const btnVisualize = document.querySelector("#btn-visualize");
const btnAddCriteria = document.querySelector("#btn-add-criteria");
const btnSaveCategory = document.querySelector("#btn-save-category");


const inputFileUploader = document.querySelector("#assessment-excel-file");
let fileId;

let categoriesRequestBody = [];
let jsonFinalPreassessment = {};


const manager1Columns = [
    "Matricule N1",
    "Nom N1",
    "PRENOM N1"
];
const manager2Columns = [
    "Matricule N2",
    "Nom N2",
    "PRENOM N2"
];
const employeeColumns = [
    "Matricule",
    "Nom",
    "Prénom",
    "affectation (Code)",
    "affectation (Libelle)",
    "Fonction (Libelle)",
    "Date fonction actuelle",
    "Date fonction avant "
];


let classificationColumns = [];


const form = document.querySelector("assessment-form");
let assessmentPropertyContainer = document.querySelectorAll(".assessment-property-container");

Array.from(assessmentPropertyContainer).forEach((propertyContainer) => {



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
$('#input-regions-campagne').on("select2:select", function (e) {
    // Do something
    var data = e.params.data;
    console.log(data);
    //   requestBodyAssessment["targetedDirection"] = e.target.value;
});

btnVisualize.addEventListener("click", () => {

    fetchEmployeesData(fileId);

})
btnAddCriteria.addEventListener('click', () => {

    addNewCriteria();
})
btnSaveCategory.addEventListener('click', () => {



    // SAVE CATEGORY TO THE JSON
    let newCategory = {
        "name": document.querySelector("#name-categorie").value,
        "typeAssessment": document.querySelector("#type-assessment-categorie").value,
        "criterias": []
    }

    let criteriasContainers = document.querySelectorAll(".criteria-container");

    Array.from(criteriasContainers).forEach((criteriaContainer) => {
        let select = criteriaContainer.querySelector("#select-classification");

        let criteria = {
            "name": select.options[select.selectedIndex].value
        }

        if (typeOfSelection(select.value) === "number") {

            criteria.min = criteriaContainer.querySelector("#min-value").value;
            criteria.max = criteriaContainer.querySelector("#max-value").value;

        } else {
            criteria.value = criteriaContainer.querySelector("#valeur-criteria").value;
        }


        newCategory["criterias"].push(criteria);
    })

    categoriesRequestBody.push(newCategory);


    // POPULATE THE TABLE
    parseToCategoryTable(categoriesRequestBody);


    // EMPTY FIELDS
    let categoryContainer = document.querySelector("#category-container");
    categoryContainer.innerHTML = `
    <div class="form-group">
        <label for="name-categorie" class="form-label">Nom de la catégorie</label>
        <input type="text" class="form-control" id="name-categorie" placeholder="Eg: Cat 1, ...">
    </div>
    <div class="form-group">
        <label for="name-categorie" class="form-label">Type d'assessment</label>
        <input type="text" class="form-control" id="type-assessment-categorie" placeholder="Eg: Dispensé">
    </div>

    <div class="criteria-container">

        <div class="form-group">
            <label for="name-categorie" class="form-label">Choisissez un critière de
                classification</label>
            <select class="form-control form-select" data-placeholder="------ Sélectionnez une option ------"
                id="select-classification">

            </select>
        </div>
        <div class="form-row" id="value-criteria-container">

        </div>
    </div>
    `;

    // POPULATE CRITERIA FIEDS
    populateWithClassificationColumns();
})

inputFileUploader.addEventListener('change', (e) => {
    let input = document.getElementById('assessment-excel-file');
    let file = input.files[0];

    btnVisualize.classList.add("btn-loading");

    postExcelFile(file);
})

async function fetchEmployeesData(id) {

    let url = "http://localhost:8080/preassessment/api/v1/file/2json/" + id;
    try {
        let res = await fetch(url);
        let response = await res.json();

        response["Déjà dans l'emploi"] = clearWhiteRows(response["Déjà dans l'emploi"])
        jsonFinalPreassessment = response;

        classificationColumns = getClassificationColumn(response["Déjà dans l'emploi"][0]);

        parseToTable(response["Déjà dans l'emploi"]);


        console.log(response);

    } catch (error) {
        console.log(error);
    }

}

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
            //textField.textContent = "ID du fichier : " + success["id"];
            //assessment.excelFile = success;
            btnVisualize.classList.remove("btn-loading");
            fileId = success["id"];



        } // Handle the success response object
    ).catch(
        error => console.log(error) // Handle the error response object
    );

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

function getClassificationColumn(json) {
    let classificationColumns = []
    Object.entries(json).forEach(([key, value]) => {
        if (!(manager1Columns.includes(key) || manager2Columns.includes(key) || employeeColumns.includes(key) || key === null)) {
            classificationColumns.push(key);
        }
    })

    return classificationColumns;
}

function parseToTable(json) {

    console.log("from parseToTable method");
    console.log(json);
    // const table = document.getElementsByClassName('table table-striped');
    // console.log(table);
    let tableHeader = document.querySelector("#assessment-population-thead");
    let tableBody = document.querySelector("#assessment-population-tbody");

    // Delete any content header and body
    tableHeader.innerHTML = "";
    tableBody.innerHTML = "";
    // EXTRACT VALUE FOR HTML HEADER. 

    var col = [];
    for (var i = 0; i < json.length; i++) {
        for (var key in json[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

    var tr = tableHeader.insertRow(-1);                   // TABLE ROW.

    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");      // TABLE HEADER.

        th.innerHTML = col[i];
        tr.appendChild(th);

        th.classList.add("wd-15p", "border-bottom-0");
    }

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < json.length; i++) {

        tr = tableBody.insertRow(-1);

        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = json[i][col[j]];
        }
    }


    // ADD DATABALE LIBRARY SCRIPTS
    loadJS("/assets/plugins/datatable/js/jquery.dataTables.min.js", false);
    loadJS("/assets/plugins/datatable/js/dataTables.bootstrap5.js", false);
    loadJS("/assets/plugins/datatable/js/dataTables.buttons.min.js", false);
    loadJS("/assets/plugins/datatable/js/buttons.bootstrap5.min.js", false);
    loadJS("/assets/plugins/datatable/js/jszip.min.js", false);
    loadJS("/assets/plugins/datatable/pdfmake/pdfmake.min.js", false);
    loadJS("/assets/plugins/datatable/pdfmake/vfs_fonts.js", false);
    loadJS("/assets/plugins/datatable/js/buttons.html5.min.js", false);
    loadJS("/assets/plugins/datatable/js/buttons.print.min.js", false);
    loadJS("/assets/plugins/datatable/js/buttons.colVis.min.js", false);
    loadJS("/assets/plugins/datatable/dataTables.responsive.min.js", false);
    loadJS("/assets/plugins/datatable/responsive.bootstrap5.min.js", false);
    loadJS("/assets/js/table-data.js", false);

    // POPULATE LIST OF CRITERIA
    populateWithClassificationColumns();

}

function loadJS(FILE_URL, async = true) {
    let scriptEle = document.createElement("script");

    scriptEle.setAttribute("src", FILE_URL);
    scriptEle.setAttribute("type", "text/javascript");
    scriptEle.setAttribute("async", async);

    document.body.appendChild(scriptEle);

    // success event 
    scriptEle.addEventListener("load", () => {
        console.log("File loaded")
    });
    // error event
    scriptEle.addEventListener("error", (ev) => {
        console.log("Error on loading file", ev);
    });
}

function lastCriteriaContainer() {
    let lastCategory = document.querySelector("#category-container");
    let allCriteriasContainers = lastCategory.querySelectorAll(".criteria-container");

    let lastCriteria = allCriteriasContainers[[allCriteriasContainers.length - 1]];

    return lastCriteria;
}

function populateWithClassificationColumns() {

    let lastCriteria = lastCriteriaContainer();

    let lastSelectField = lastCriteria.querySelector("#select-classification");

    let defaultOption = new Option("");
    defaultOption.setAttribute("label", "------ Sélectionnez une option ------");
    defaultOption.setAttribute("selected", "");
    lastSelectField.appendChild(defaultOption);
    classificationColumns.map(e => {
        var option = new Option(e, e);
        lastSelectField.appendChild(option);
    })

    // Add an event listener to the select
    lastSelectField.addEventListener("change", (e) => {
        let lastCriteriaNested = e.target.parentElement.parentElement;
        let selectValue = e.target.value;

        console.log(selectValue);

        let valueInputCriteria = lastCriteriaNested.querySelector("#value-criteria-container");

        console.log(typeOfSelection(selectValue));

        if (typeOfSelection(selectValue) === "string") {
            valueInputCriteria.outerHTML = `
            <div class="form-row" id="value-criteria-container">
                <div class="form-group col-md-12 mb-0">
                    <label for="valeur-criteria" class="form-label">Valeur du critière </label>
                    <input type="text" class="form-control" id="valeur-criteria"
                        placeholder=".........">
                </div>
                <div class="my-3 w-100 text-center">
                    <button id="btn-delete-criteria" type="button" 
                    class="btn btn-icon me-2 bradius btn-danger-light"> <i class="fe fe-trash-2"></i></button>
                </div>
        `;
        } else {
            valueInputCriteria.outerHTML = `
            <div class="form-row" id="value-criteria-container">
                <div class="form-group col-md-6 mb-0">
                    <div class="form-group">
                        <label for="min-value" class="form-label">Min value : </label>
                        <input type="number" class="form-control" id="min-value">
                    </div>
                </div>
                <div class="form-group col-md-6 mb-0">
                    <div class="form-group">
                        <label for="max-value" class="form-label">Max value : </label>
                        <input type="number" class="form-control" id="max-value">
                    </div>
                </div>
                <div class="my-3 w-100  text-center">
                    <button id="btn-delete-criteria" type="button" 
                    class="btn btn-icon me-2 bradius btn-danger-light"> <i class="fe fe-trash-2"></i></button>
                </div>
            </div>
            `;
        }


        let btnDeleteCriteria = lastCriteriaNested.querySelector("#btn-delete-criteria");
        

        btnDeleteCriteria.addEventListener("click", (e) => {
            
            let targetBtn;
            if (e.target.tagName === "I") {
                targetBtn = e.target.parentElement;
            } else {
                targetBtn = e.target;
            }

            let allBtnsDelete = document.querySelectorAll("#btn-delete-criteria");

            let allCriteriaContainer = document.querySelectorAll(".criteria-container");


            // console.log([...test].indexOf(e.target));

            let indexOfSelectedCriteria = [...allBtnsDelete].indexOf(targetBtn);

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
            <select class="form-control select2 form-select" data-placeholder="Choose one"
                id="select-classification">

            </select>
        </div>
        <div class="form-row" id="value-criteria-container">

        </div>
    </div>
        `
        ;

    populateWithClassificationColumns();

}

function typeOfSelection(selection) {
    return typeof (jsonFinalPreassessment["Déjà dans l'emploi"][0][selection]);
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

        let typeAssessment = tr.insertCell(-1);
        typeAssessment.innerHTML = categoryJson[i].typeAssessment;

        let actionsCell = tr.insertCell(-1);
        actionsCell.innerHTML = `
            <div class="g-3">
                <a id="cat-table-btn-edit" class="btn text-primary btn-sm" data-bs-toggle="tooltip"
                    data-bs-original-title="Edit"><span class="fe fe-edit fs-14"></span></a>
                <a id="cat-table-btn-view" class="btn text-primary btn-sm" data-bs-toggle="tooltip"
                    data-bs-original-title="View"><span class="fe fe-eye fs-14"></span></a>
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

            console.log(categoryIndex);
            categoriesRequestBody.splice(categoryIndex, 1);

            parseToCategoryTable(categoriesRequestBody);

        })
    })

    Array.from(allEditCatBtns).forEach((editBtn) => {
        editBtn.addEventListener("click", (e) => {
            let categoryIndex = [...allEditCatBtns].indexOf(e.target);


        })
    })

}
function removeFromCategoryTable(category) {

}

function addToCategoryTable(category) {
    let tableBody = document.querySelector("#category-table-body");

    // Add new row
    let tr = tableBody.insertRow(-1);

    let nameCell = tr.insertCell(-1);
    nameCell.innerHTML = category.name;

    let typeAssessment = tr.insertCell(-1);
    typeAssessment.innerHTML = category.typeAssessment;

    let actionsCell = tr.insertCell(-1);
    actionsCell.innerHTML = `
    <div class="g-3">
        <a id="cat-table-btn-edit" class="btn text-primary btn-sm" data-bs-toggle="tooltip"
            data-bs-original-title="Edit"><span class="fe fe-edit fs-14"></span></a>
        <a id="cat-table-btn-view" class="btn text-primary btn-sm" data-bs-toggle="tooltip"
            data-bs-original-title="View"><span class="fe fe-eye fs-14"></span></a>
        <a id="cat-table-btn-delete" class="btn text-danger btn-sm" data-bs-toggle="tooltip"
            data-bs-original-title="Delete"><span
                class="fe fe-trash-2 fs-14"></span></a>
    </div> 
    `;


}

function findCategory(categoryName) {
    return categoriesRequestBody.filter((category) => {
        return category.name === categoryName;
    })
}


function addCategoryToJon(newCategory) {
    categoriesRequestBody.push(newCategory);
}

function parseToCategoryContainer(category, index) {
    let categoryContainer = document.querySelector("#category-container");

    categoryContainer.querySelector("#name-categorie").value = category.name;
    categoryContainer.querySelector("#type-assessment-categorie").value = category.typeAssessment;

    let criteriasContainer = categoryContainer.querySelector("#");

    // for (var i = 0; i < )
}