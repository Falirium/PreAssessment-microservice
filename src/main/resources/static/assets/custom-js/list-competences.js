
console.log("list-competences.js")



let authorizedCol = ["id", "nom", "definition_comp", "niveau", "definition"];



let competenceEditIndex = -1;
const btnAddGlossaire = document.querySelector("#btn-add-glossaire");

let competenceDatatable;
let listCompetences;

// GET LIST OF COMPETENCES
getListOfCompetences().then((data) => {


    listCompetences = data;

    // // FILL THE TABLE WITH DATA
    // parseGlossaireToTable(listCompetences);

    let dataSet = getCompetencesDataFromJson(listCompetences);

    // INITILIZE TABLE TO DATATABLE
    competenceDatatable = $("#tbs3").DataTable({
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
    //     let assessment = listCompetences[indexOfAssessment];
    //     console.log(assessment);

    //     //SAVE ASSESSMENT ON LOCAL SESSION
    //     localStorage.setItem("assessment", JSON.stringify(assessment));

    //     // REDIRECT TO THE ASSESSMENT PAGE 
    //     // let url = buildURL("evaluation/evaluate", urlParams);

    //     // window.open(extractDomain(currentUrl) + url)
    //     // console.log(localStorage.getItem("assessment"));
    // })

})

// WHEN CLICK ON UPDATING THE LIST OF COMPETENCES
btnAddGlossaire.addEventListener("click", (e) => {
    let nomCompGlossaire = document.querySelector("#input-nom-competence-glossaire");
    let niveauCompGlassaire = Array.from(document.querySelectorAll("#input-niveau-competence-glossaire"));
    let defCompGlaossaire = Array.from(document.querySelectorAll(".input-level-def"));


    listCompetences[competenceEditIndex] = {
        "id": listCompetences[competenceEditIndex].id,
        "name": nomCompGlossaire.value,
        "definition": listCompetences[competenceEditIndex]["definition"],
        "niveaux": []
    }
    defCompGlaossaire.forEach((def, index) => {
        console.log(niveauCompGlassaire[index].value, def.value, index);
        switch (niveauCompGlassaire[index].value) {
            case "E":
                listCompetences[competenceEditIndex]["niveaux"].push({
                    "level": "Elémentaire",
                    "definition": def.value
                });
                break;
            case "M":
                listCompetences[competenceEditIndex]["niveaux"].push({
                    "level": "Maitrise",
                    "definition": def.value
                });
                break;
            case "A":
                listCompetences[competenceEditIndex]["niveaux"].push({
                    "level": "Avancé",
                    "definition": def.value
                });
                break;
            case "X":
                listCompetences[competenceEditIndex]["niveaux"].push({
                    "level": "Expert",
                    "definition": def.value
                });
                break;

        }
        
    })

    console.log(competenceEditIndex, listCompetences);

    // INITIALIZE THE INDEX
    competenceEditIndex = -1;




    // INITIALIZE THE INPUTS
    nomCompGlossaire.value = "";
    defCompGlaossaire.forEach((definition) => {
        definition.value = "";
    })



    // console.log(listCompetences);
    // FILL THE TABLE WITH NEW DATA
    // parseGlossaireToTable(listCompetences);

    // RE-INITIALIZE THE DATATABLE
    // competenceDatatable.destroy();
    // competenceDatatable = $("#tbs3").DataTable({
    //     "pageLength": 4,
    //     "lengthMenu": [4, 8, 16, 20, 24, 'All']
    // });

    let dataSet = getCompetencesDataFromJson(listCompetences);

    competenceDatatable.clear();
    competenceDatatable.rows.add(dataSet);
    competenceDatatable.draw();

    // ADD EVENTLISTENERS TO TABLE BTNS : EDIT DELETE
    addEventListenersToTableBtns();

})

function buildURL(prefix, params) {

    let url = prefix + "?";
    for (var key of Object.keys(params)) {
        url = url + key + "=" + params[key] + "&";
    }

    return url;
}

async function getListOfCompetences() {
    let url = "http://localhost:8080/preassessment/api/v1/competence/";
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
    arrJson.map((e, i) => {
        //console.log(i);



        e.niveaux.map((niveau, index) => {

            let arr = [];

            arr.push(e.id);
            arr.push(e.name);
            arr.push(niveau.level);
            arr.push(niveau.definition);

            // ACTION COL
            arr.push(`
            <div class="g-2">
                <a id="glo-table-btn-edit" class="btn text-primary btn-sm" data-bs-toggle="tooltip"
                    data-bs-original-title="Edit"><span class="fe fe-edit fs-14"></span></a>
                <a id="glo-table-btn-delete" class="btn text-danger btn-sm" data-bs-toggle="tooltip"
                    data-bs-original-title="Delete"><span
                        class="fe fe-trash-2 fs-14"></span></a>
            </div> 
            `);

            finalArr.push(arr);
        })







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


function parseGlossaireToTable(glossaire) {
    let tableBody = document.querySelector("#glossaire-table-body");


    // Initilize the table body

    tableBody.innerHTML = ``;
    for (var j = 0; j < glossaire.length; j++) {


        for (var i = 0; i < glossaire[j]["niveaux"].length; i++) {

            if (typeof (glossaire[j]["niveaux"][i]) !== 'undefined') {

                // console.log(glossaire[j]["niveaux"][i]);

                let tr = tableBody.insertRow(-1);

                // if (i === 0) {
                //     let nameCell = tr.insertCell(-1);
                //     nameCell.setAttribute("rowspan", "4");
                //     nameCell.innerHTML = glossaire[j].name;

                //     let niveauCell = tr.insertCell(-1);
                //     niveauCell.innerHTML = glossaire[j]["niveaux"][i].level;

                //     let defCell = tr.insertCell(-1);
                //     defCell.innerHTML = glossaire[j]["niveaux"][i].definition;
                //     let actionCell = tr.insertCell(-1);
                //     actionCell.setAttribute("rowspan", "4");
                //     actionCell.innerHTML = `
                //         <div class="g-2">
                //             <a id="glo-table-btn-edit" class="btn text-primary btn-sm" data-bs-toggle="tooltip"
                //                 data-bs-original-title="Edit"><span class="fe fe-edit fs-14"></span></a>
                //             <a id="glo-table-btn-delete" class="btn text-danger btn-sm" data-bs-toggle="tooltip"
                //                 data-bs-original-title="Delete"><span
                //                     class="fe fe-trash-2 fs-14"></span></a>
                //         </div> 
                //     `;

                // } else {
                //     let niveauCell = tr.insertCell(-1);
                //     niveauCell.innerHTML = glossaire[j]["niveaux"][i].level;

                //     let defCell = tr.insertCell(-1);
                //     defCell.innerHTML = glossaire[j]["niveaux"][i].definition;
                // }
                let idCell = tr.insertCell(-1);
                idCell.innerHTML = glossaire[j].id;

                let nameCell = tr.insertCell(-1);
                nameCell.innerHTML = glossaire[j].name;

                let niveauCell = tr.insertCell(-1);
                niveauCell.innerHTML = glossaire[j]["niveaux"][i].level;

                let defCell = tr.insertCell(-1);
                defCell.innerHTML = glossaire[j]["niveaux"][i]["definition"];
                let actionCell = tr.insertCell(-1);
                actionCell.innerHTML = `
                            <div class="g-2">
                                <a id="glo-table-btn-edit" class="btn text-primary btn-sm" data-bs-toggle="tooltip"
                                    data-bs-original-title="Edit"><span class="fe fe-edit fs-14"></span></a>
                                <a id="glo-table-btn-delete" class="btn text-danger btn-sm" data-bs-toggle="tooltip"
                                    data-bs-original-title="Delete"><span
                                        class="fe fe-trash-2 fs-14"></span></a>
                            </div> 
                        `;
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



            let competenceIndex = Math.floor(glossaireIndex / 4);
            let levelIndex = glossaireIndex % 4;
            listCompetences.splice(glossaireIndex, 1);

            //console.log(listCompetences[competenceIndex].name, listCompetences[competenceIndex]["niveaux"][levelIndex])



            showModal("error", "Vous voulez supprimer cette compétence ?", 'Confirmez votre décision de supprimer cette compétence, en cliquant sur le bouton "Oui".', "competence");




        })
    });

    Array.from(allEditCatBtns).forEach((editBtn) => {
        editBtn.addEventListener("click", (e) => {

            // WHEN THE SPAN ELEMENT IS FIRED

            let aElement;
            if (e.target.tagName === "SPAN") {
                aElement = e.target.parentElement;
            } else {
                aElement = e.target;
            }

            let glossaireIndex = [...allEditCatBtns].indexOf(aElement);



            let competenceIndex = Math.floor(glossaireIndex / 4);
            let levelIndex = glossaireIndex % 4;
            console.log(competenceIndex);

            $("#input-nom-competence-glossaire").val(listCompetences[competenceIndex].name);

            $("#input-def-competence-e").val(listCompetences[competenceIndex]["niveaux"][0]["definition"]);
            $("#input-def-competence-m").val(listCompetences[competenceIndex]["niveaux"][1]["definition"]);
            $("#input-def-competence-a").val(listCompetences[competenceIndex]["niveaux"][2]["definition"]);
            $("#input-def-competence-x").val(listCompetences[competenceIndex]["niveaux"][3]["definition"]);


            competenceEditIndex = competenceIndex;




            // parseGlossaireToTable(listCompetences, niveau);

        })
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

function addEventListenersToTableBtns() {
    let tableBody = document.querySelector("#glossaire-table-body");


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



            let competenceIndex = Math.floor(glossaireIndex / 4);
            let levelIndex = glossaireIndex % 4;
            listCompetences.splice(glossaireIndex, 1);

            //console.log(listCompetences[competenceIndex].name, listCompetences[competenceIndex]["niveaux"][levelIndex])



            showModal("error", "Vous voulez supprimer cette compétence ?", 'Confirmez votre décision de supprimer cette compétence, en cliquant sur le bouton "Oui".', "competence");




        })
    });

    Array.from(allEditCatBtns).forEach((editBtn) => {
        editBtn.addEventListener("click", (e) => {

            // WHEN THE SPAN ELEMENT IS FIRED

            let aElement;
            if (e.target.tagName === "SPAN") {
                aElement = e.target.parentElement;
            } else {
                aElement = e.target;
            }

            let glossaireIndex = [...allEditCatBtns].indexOf(aElement);



            let competenceIndex = Math.floor(glossaireIndex / 4);
            let levelIndex = glossaireIndex % 4;
            console.log(competenceIndex);

            $("#input-nom-competence-glossaire").val(listCompetences[competenceIndex].name);

            $("#input-def-competence-e").val(listCompetences[competenceIndex]["niveaux"][0]["definition"]);
            $("#input-def-competence-m").val(listCompetences[competenceIndex]["niveaux"][1]["definition"]);
            $("#input-def-competence-a").val(listCompetences[competenceIndex]["niveaux"][2]["definition"]);
            $("#input-def-competence-x").val(listCompetences[competenceIndex]["niveaux"][3]["definition"]);


            competenceEditIndex = competenceIndex;




            // parseGlossaireToTable(listCompetences, niveau);

        })
    })
}

