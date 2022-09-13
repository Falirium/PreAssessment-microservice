

let fileExcel = document.querySelector("#input-file");
let competenceArray = [];

let competenceNameArray = [];
let competenceDefArray = [];
let competenceLevelsDefArray = [];

let competenceEditIndex = -1;

let counter = 1;

let competenceTable;


const btnAddGlossaire = document.querySelector("#btn-add-glossaire");
// const btnConfirmDeleteNiveau = document.querySelector("#confirm-delete-niveau");
const btnAddFile = document.querySelector("#btn-add-file");
const btnSaveCompetences = document.querySelector("#btn-competence-save");


btnAddFile.addEventListener("click", (e) => {
    let tbody = document.querySelector("tbody");
    console.log(tbody.innerHTML === "");
    if (tbody.innerHTML === "") {
        var myModal = new bootstrap.Modal(document.getElementById('input-modal'));
        myModal.show();
    } else {
        showModal("warning", "Attention !", 'Vous ne pouvez pas ajouter une nouvelle liste de compétences sans sauvegarder la liste sur la table. Cliquez sur le bouton "Enregistrer" pour sauvegarder la liste.')

    }
})


// SAVE THE LIST INTO THE DATABASE

btnSaveCompetences.addEventListener("click", (e) => {
    postListOfCompetence(competenceArray);
})




// WHEN THE LOCAL SESSION HAS A NON EMPTY COMPETENCE ARRAY
if (sessionStorage.getItem("competences")) {
    competenceArray = JSON.parse(sessionStorage.getItem("competences"));

    console.log(competenceArray);

    parseGlossaireToTable(competenceArray);

    // ADD DATABALE LIBRARY SCRIPTS
    loadJS("/assets/plugins/datatable/js/jquery.dataTables.min.js", true);
    loadJS("/assets/plugins/datatable/js/dataTables.bootstrap5.js", true);
    loadJS("/assets/plugins/datatable/js/dataTables.buttons.min.js", true);
    loadJS("/assets/plugins/datatable/js/buttons.bootstrap5.min.js", true);
    loadJS("/assets/plugins/datatable/js/jszip.min.js", true);
    loadJS("/assets/plugins/datatable/pdfmake/pdfmake.min.js", true);
    loadJS("/assets/plugins/datatable/pdfmake/vfs_fonts.js", true);
    loadJS("/assets/plugins/datatable/js/buttons.html5.min.js", true);
    loadJS("/assets/plugins/datatable/js/buttons.print.min.js", true);
    loadJS("/assets/plugins/datatable/js/buttons.colVis.min.js", true);
    loadJS("/assets/plugins/datatable/dataTables.responsive.min.js", true);
    loadJS("/assets/plugins/datatable/responsive.bootstrap5.min.js", true);
    loadJS("/assets/js/table-data.js", true);

}

btnAddGlossaire.addEventListener("click", (e) => {

    let nomCompGlossaire = document.querySelector("#input-nom-competence-glossaire");
    let niveauCompGlassaire = Array.from(document.querySelectorAll("#input-niveau-competence-glossaire"));
    let defCompGlaossaire = Array.from(document.querySelectorAll(".input-level-def"));

    if (competenceEditIndex !== -1) {

        competenceArray[competenceEditIndex] = {
            "name": nomCompGlossaire.value,
            "definition": competenceArray[competenceEditIndex]["definition"],
            "niveaux": []
        }
        defCompGlaossaire.forEach((def, index) => {
            console.log(niveauCompGlassaire[index].value, def.value, index)
            competenceArray[competenceEditIndex]["niveaux"].push({
                "level": niveauCompGlassaire[index].value,
                "definition": def.value
            })
        })

        console.log(competenceEditIndex, competenceArray);

        // INITIALIZE THE INDEX
        competenceEditIndex = -1;

        // SET THE SESSIONSTORAGE
        sessionStorage.setItem("competences", JSON.stringify(competenceArray));

        // RELOAD THE PAGE
        location.reload();


    } else {

        let competenceGlassaireJson = {
            "name": nomCompGlossaire.value,
            "definition": null,
            "niveaux": []
        }



        for (var i = 0; i < niveauCompGlassaire.length; i++) {
            let nivaeuJson = {
                "level": niveauCompGlassaire[i].value,
                "definition": defCompGlaossaire[i].value
            }

            competenceGlassaireJson["niveaux"].push(nivaeuJson);
        }

        competenceArray.push(competenceGlassaireJson);

    }
    

    // INITIALIZE THE INPUTS
    nomCompGlossaire.value = "";
    defCompGlaossaire.forEach((definition) => {
        definition.value = "";
    })



    console.log(competenceArray);
    parseGlossaireToTable(competenceArray);
})

// btnConfirmDeleteNiveau.addEventListener("click", (e) => {

//     // SET THE SESSIONSTORAGE
//     sessionStorage.setItem("competences", JSON.stringify(competenceArray));

//     // RELOAD THE PAGE
//     location.reload();

// })




fileExcel.addEventListener("change", (e) => {

    // HIDE MODAL
    // var myModal = new bootstrap.Modal(document.getElementById('input-modal'));
    // myModal.hide();
    //console.log("lkdqj");
    $("#input-modal").modal('hide');

    // ADD LOADER ON THE PAGE
    $("#btn-add-file").addClass("btn-loading");

    // POPULATE GLOSSAIRE ARRAY

    parseExcelFile2(fileExcel);



})

function parseGlossaireToTable(glossaire) {
    let tableBody = document.querySelector("#glossaire-table-body");


    // Initilize the table body

    tableBody.innerHTML = ``;
    for (var j = 0; j < glossaire.length; j++) {

        // console.log(j,glossaire[j]["niveaux"]);

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
            competenceArray.splice(glossaireIndex, 1);

            //console.log(competenceArray[competenceIndex].name, competenceArray[competenceIndex]["niveaux"][levelIndex])



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
            // console.log(competenceArray[competenceIndex]["niveaux"][0]["definition"]);

            $("#input-nom-competence-glossaire").val(competenceArray[competenceIndex].name);

            $("#input-def-competence-e").val(competenceArray[competenceIndex]["niveaux"][0]["definition"]);
            $("#input-def-competence-m").val(competenceArray[competenceIndex]["niveaux"][1]["definition"]);
            $("#input-def-competence-a").val(competenceArray[competenceIndex]["niveaux"][2]["definition"]);
            $("#input-def-competence-x").val(competenceArray[competenceIndex]["niveaux"][3]["definition"]);


            competenceEditIndex = competenceIndex;



            // parseGlossaireToTable(competenceArray, niveau);

        })
    })



}

async function parseExcelFile2(inputElement) {
    var files = inputElement.files || [];
    if (!files.length) return;
    var file = files[0];

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

            const sheet = workbook.getWorksheet('Matrice');
            const c1 = sheet.getColumn('D');
            // console.log(c1);
            // console.log(typeof (c1));



            c1.eachCell((c, row) => {
                if (c.value !== null && row !== 1) {
                    let valeur = c.value;
                    valeur = valeur.replace(/(\r\n|\n|\r)/gm, "");
                    competenceNameArray.push(valeur);
                    // console.log(valeur, row);
                }

            });

            const c2 = sheet.getColumn('E');

            c2.eachCell((c, row) => {
                if (c.value !== null && row !== 1) {
                    let valeur = c.value;
                    if (typeof (valeur) !== 'string') {
                        valeur = valeur["richText"][0].text;
                    }
                    // console.log(valeur, row);
                    valeur = valeur.replace(/(\r\n|\n|\r)/gm, "").trim();
                    competenceDefArray.push(valeur);
                }
            });

            const c3 = sheet.getColumn('F');

            c3.eachCell((c, row) => {
                if (c.value !== null && row !== 1) {
                    let valeur = c.value;
                    //console.log(valeur, row);
                    let level;
                    let levelDef;

                    if (typeof (valeur) === 'string') {
                        let arr = valeur.split(":");
                        level = arr[0].replace(/(\r\n|\n|\r|:)/gm, "").trim();
                        levelDef = arr[1].replace(/(\r\n|\n|\r|:)/gm, "").trim();

                    } else {
                        level = valeur["richText"][0].text;
                        let arr = level.split(":");
                        level = arr[0].replace(/(\r\n|\n|\r|:)/gm, "").trim();

                        levelDef = valeur["richText"][1].text;
                        levelDef = arr[1].replace(/(\r\n|\n|\r|:)/gm, "").trim() + levelDef.replace(/(\r\n|\n|\r|:)/gm, "").trim();
                    }



                    competenceLevelsDefArray.push({
                        "level": level,
                        "definition": levelDef
                    });
                }
            });

            competenceNameArray = [...new Set(competenceNameArray)];
            competenceDefArray = [...new Set(competenceDefArray)];
            competenceLevelsDefArray = [...new Set(competenceLevelsDefArray)];


            getGlossaireOfCompentence(competenceNameArray, competenceDefArray, competenceLevelsDefArray);

        })
            .then(function () {

                // //HIDE LOADER
                $("#btn-add-file").removeClass("btn-loading");

                // DISPLAY THE TABLE
                parseGlossaireToTable(competenceArray);
            })
            .then(function () {
                // INITIALIZE DATATABLE ON TABLE 
                $("#tbs3").DataTable({
                    "pageLength": 4,
                    "lengthMenu": [4, 8, 16, 20, 24, 'All']
                });


            }).catch(error => {
                // SHOW MODAL ERROR
                showModal("error", "Mauvais format de fichier", "Vérifiez que vous avez téléchargé le bon fichier de compétence et assurez-vous qu'il respecte le format de fichier standard.", "");

                // //HIDE LOADER
                $("#btn-add-file").removeClass("btn-loading");
            });
    };
    reader.readAsArrayBuffer(file);
}

function getGlossaireOfCompentence(names, defs, levels) {
    names.map((e, index) => {
        let competenceJson = {
            "name": e,
            "definition": defs[index],
            "niveaux": []
        }
        for (var i = 0; i < 4; i++) {
            competenceJson["niveaux"].push(levels[0]);
            levels.shift();
        }

        competenceArray.push(competenceJson);
    })
}

function loadJS(FILE_URL, async) {
    let scriptEle = document.createElement("script");

    scriptEle.setAttribute("src", FILE_URL);
    scriptEle.setAttribute("type", "text/javascript");
    scriptEle.setAttribute("async", async);


    document.body.appendChild(scriptEle);

    // success event 
    scriptEle.addEventListener("load", () => {
        //console.log("File loaded")
    });
    // error event
    scriptEle.addEventListener("error", (ev) => {
        console.log("Error on loading file", ev);
    });
}

async function postListOfCompetence() {
    let url = "http://localhost:8080/preassessment/api/v1/competence/competences"

    fetch(url, { // Your POST endpoint
        method: 'POST',
        headers: {
            // Content-Type may need to be completely **omitted**
            // or you may need something
            "Content-Type": "application/json"
        },
        body: JSON.stringify(competenceArray) // This is your file object
    }).then(
        response => response.json() // if the response is a JSON object
    ).then(
        success => {

            // SHOW SUCCESS MODEL        
            showModal("success", "La liste des compétences a été sauvegardée avec succès", "La nouvelle liste de compétences a été sauvegardée dans la base de données avec succès, vous pouvez trouver les compétences lors de la création d'un emploi");



        } // Handle the success response object
    ).catch(
        error => console.log(error) // Handle the error response object
    );
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

