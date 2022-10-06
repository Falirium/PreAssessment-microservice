
console.log("list-competences.js")



let authorizedCol = ["id", "nom", "definition_comp", "niveau", "definition"];



let competenceEditIndex = -1;
const btnAddGlossaire = document.querySelector("#btn-add-glossaire");

let matriceCompetenceDatatable;
let listMatricesCompetences;

// GET LIST OF COMPETENCES
getListOfMatricesCompetences().then((data) => {


    listMatricesCompetences = data;

    // // FILL THE TABLE WITH DATA
    // parseGlossaireToTable(listMatricesCompetences);

    let dataSet = getCompetencesDataFromJson(listMatricesCompetences);

    // INITILIZE TABLE TO DATATABLE
    matriceCompetenceDatatable = $("#tbs3").DataTable({
        data: dataSet,
        pageLength: 4,
        lengthMenu: [4, 8, 16, 20, 24, 'All']
    });

    // ADD EVENTLISTENERS TO TABLE BTNS : EDIT DELETE

    addEventListenersToTableBtns();

    // $(".view-btn").click(function (e) {

    //     let aElement;
    //     if (e.target.tagName === "SPAN") {
    //         aElement = e.target.parentElement;
    //     } else {
    //         aElement = e.target;
    //     }

    //     let btns = $(".view-btn").get();
    //     let indexOfAssessment = btns.indexOf(aElement);
    //     console.log(indexOfAssessment);

    //     // GET THE ASSOCIATED ASSESSMENT
    //     let assessment = listMatricesCompetences[indexOfAssessment];
    //     console.log(assessment);

    //     //SAVE ASSESSMENT ON LOCAL SESSION
    //     localStorage.setItem("assessment", JSON.stringify(assessment));

    //     // REDIRECT TO THE ASSESSMENT PAGE 
    //     // let url = buildURL("evaluation/evaluate", urlParams);

    //     // window.open(extractDomain(currentUrl) + url)
    //     // console.log(localStorage.getItem("assessment"));
    // })

})


function buildURL(prefix, params) {

    let url = prefix + "?";
    for (var key of Object.keys(params)) {
        url = url + key + "=" + params[key] + "&";
    }

    return url;
}

async function getListOfMatricesCompetences() {
    let url = "http://localhost:8080/preassessment/api/v1/competence/matrice/list";
    return fetch(url, {
        method: 'GET'
    }).then(response => response.json())
        .then(success => {
            console.log(success);
            return success;
        }).catch((error) => {
            console.log(error);
        })
}

function getCompetenceColumnFromJson(json, authorizedCol) {
    let colArr = [];



    authorizedCol.map((col, index) => {
        let value;
        console.log(col);
        console.log(json.hasOwnProperty(col));
        if (json.hasOwnProperty(col)) {
            switch (col) {
                case "id":
                    value = "id";
                    break;
                case "nom":
                    value = "nom";
                    break;
                case "definition_comp":
                    value = "définition"
                    break;
                case "niveau":
                    value = "niveau"
                    break;
                case "definition":
                    value = "definition de niveau"
                    break;

            }

            console.log(value);

            colArr.push({
                "title": value
            });


        } else {
            value = col; // CASE OF NIVEAU DE SENIORITE
            colArr.push({
                "title": value
            });
        }


    })

    // ACTION COL
    colArr.push({
        "title": "Actions"
    });

    return colArr;
}

function getCompetencesDataFromJson(arrJson) {
    let finalArr = [];

    // WHEN THE ARR IS VIDE
    if (arrJson.length === 0) {
        return [];
    }
    arrJson.map((e, i) => {
        //console.log(i);

        console.log(e);

        let arr = [];

        arr.push(e.id);
        arr.push(e.name);
        arr.push(e.createdAt.split("T")[0]);
        arr.push(e.updatesAt.split("T")[0]);

        // ACTION COL
        arr.push(`
            <div class="g-1">
                <a id="" class="mc-table-btn-viz btn text-primary btn-sm" data-bs-toggle="tooltip"
                    data-bs-original-title="Consulter"><span class="fe fe-eye fs-14"></span></a>
                
            </div> 
            `);

        finalArr.push(arr);


    })

    return finalArr;
}

function niveaux2Array(arrJson) {
    let arr = [];

    arrJson.map((e, i) => {
        arr.push(e.level);
    })

    return arr;
}

function defNiveaux2Array(arrJson) {
    let arr = [];

    arrJson.map((e, i) => {
        arr.push(e.definition);
    })

    return arr;
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

function addEventListenersToTableBtns() {

    // Click event listeners 
    let allVizCatBtns = $(".mc-table-btn-viz").get();


    $(".mc-table-btn-viz").each(function (index, vizBtn) {

        console.log(index, vizBtn);

        $(vizBtn).click(function (e) {



            // WHEN THE SPAN ELEMENT IS FIRED
            let aElement;
            if (e.target.tagName === "SPAN") {
                aElement = e.target.parentElement;
            } else {
                aElement = e.target;
            }

            let mcId = $(aElement).parents("td").siblings().slice(0, 1).text();

            let matriceComp = getMatriceCompetenceInfoFromArr(mcId);
            console.log(mcId, matriceComp.matrice.id);

            // SAVE THIS MATRICE IN LOCAL-STORAGE
            localStorage.setItem("matriceCompetence", JSON.stringify(matriceComp.matrice));

            // REDIRECT TO THE EDIT PAGE
            let currentUrl = window.location.href;

            window.location.href = extractDomain(currentUrl) + "emploi/competence/edit";

        })




    })
}

function getMatriceCompetenceInfoFromArr(id) {

    // SEARCH FOR MATRICE COMPETENCE IN THE LIST ARRAY
    for (var i = 0; i < listMatricesCompetences.length; i++) {
        let matriceComp = listMatricesCompetences[i];

        if (matriceComp.id == id) {
            return {
                "index": i,
                "matrice": matriceComp
            }
        }

    }

    return {
        "index": -1,
        "matrice": null
    }
}

