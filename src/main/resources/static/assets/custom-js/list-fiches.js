
console.log("list-fiches.js")
const extractRootDomain = (url) => {

    const domain = new URL(url).hostname;
    const elems = domain.split('.');
    const iMax = elems.length - 1;

    const elem1 = elems[iMax - 1];
    const elem2 = elems[iMax];

    const isSecondLevelDomain = iMax >= 3 && (elem1 + elem2).length <= 5;
    return (isSecondLevelDomain ? elems[iMax - 2] + '.' : '') + elem1 + '.' + elem2;

}

currentUrl = window.location.href;

let manager = JSON.parse(localStorage.getItem("user"));

let managerMatricule = manager.data.matricule;;

let authorizedCol = ["id", "collaborateur", "evaluateurOne", "emploi", "niveau", "associatedAssessment", "status"];

let ficheDatatable;





let listFiches;

// GET LIST OF FICHES
let fichesJson = getListOfFichesByMatricule(managerMatricule).then((data) => {


    listFiches = data;

    // INITIALIZE DATATABLE
    let fiteredAuthorizedCol;

    if (manager.type === '1') {
        fiteredAuthorizedCol = authorizedCol.filter((col, index) => "evaluateurOne" != col);
    } else {
        fiteredAuthorizedCol = authorizedCol.filter((col, index) => "evaluateurTwo" != col);
    }

    let dataSet = getFichesDataFromJson(data, fiteredAuthorizedCol);
    let col = getFichesColumnFromJson(data[0], fiteredAuthorizedCol);

    ficheDatatable = $("#tb1").DataTable({
        data: dataSet,
        columns: col,
        columnDefs: [
            { "width": "6%", "targets": 2 }
        ],
        autoWidth: false,
        ordering: false
    })

    // ADD EVENTLISTENERS TO VIEW BTN
    $(".view-btn").click(function (e) {

        // let aElement;
        // if (e.target.tagName === "SPAN") {
        //     aElement = e.target.parentElement;
        // } else {
        //     aElement = e.target;
        // }

        // let btns = $(".view-btn").get();
        // // let indexOfFiche = btns.indexOf(aElement);
        // let indexOfFiche = $(aElement).parents(".g-1").attr("id");

        // // console.log(manager.type === 2 && listFiches[indexOfFiche].status === "CREATED");


        let aElement;
        if (e.target.tagName === "SPAN") {
            aElement = e.target.parentElement;
        } else {
            aElement = e.target;
        }

        let ficheEvaluationId = $(aElement).parents("td").siblings().slice(0, 1).text();

        let ficheFromArr = getFicheInfoFromArr(competenceName).fiche;


        // CHECK IF THE FICHE IS ALREADY EVALUATED BY THE SAM MANAGER

        if ((manager.type === '1' && (ficheFromArr.status === "ÉVALUÉ-0" || ficheFromArr.status === "CREATED")) || (manager.type === '2' && (ficheFromArr.status === "ÉVALUÉ-1" || listFiches[indexOfFiche].status === "TERMINÉ-0"))) {

            console.log("access authorized");

            // GET THE ASSOCIATED FIHCE D EVALUATION
            let fiche = ficheFromArr;
            console.log(fiche);

            //SAVE FICHE OBJECT ON LOCAL SESSION
            localStorage.setItem("ficheEvaluation", JSON.stringify(fiche));

            // REDIRECT TO THE FICHE PAGE : /evaluation/evaluate?.....

            let emploiName = encodeURIComponent(fiche.emploi.intitule);
            let emploiLevel = fiche.emploi.level;

            let doesResponsabilitesExist = false;
            let doesMarqueursExist = false;
            let doesExigencesExist = false;
            let doesCompetencesDcExist = false;
            let doesCompetencesSeExist = false;
            let doesCompetencesSfExist = false;


            //GET THE CATEGORY ASSESSMENT_CONTENT PROPERTY
            fiche.ficheContent.map((e, i) => {
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
            let url = buildURL("evaluation/evaluate", urlParams);

            window.location.href = extractDomain(currentUrl) + url;
            // console.log(extractDomain(currentUrl) + url);

        } else {
            console.log("access denied");

            if (manager.type === '1') {
                let errorBody;

                if (ficheFromArr.status === "ÉVALUÉ-1") {

                    errorBody = `Désolé, vous ne pouvez pas accéder ou modifier les fiches d'évaluations que vous avez envoyés à votre manager`;

                } else if (ficheFromArr.status.includes("TERMINÉ")) {

                    errorBody = `Désolé, vous ne pouvez pas accéder aux les fiches d'évaluations qui ont été évalués par votre manager.`
                }


                showModal("error", "Accès Refusé", errorBody, "");

            } else if (manager.type === '2') {

                let errorBody;

                if (ficheFromArr.status === "ÉVALUÉ-0" || ficheFromArr.status === "CREATED") {

                    errorBody = `Désolé, vous ne pouvez pas accéder aux fiches d'évaluations qui n'ont pas été validées par le manager N+1.`;

                } else if (ficheFromArr.status === "TERMINÉ-1") {

                    errorBody = `Désolé, vous ne pouvez pas accéder ou modifier les fiches d'évaluations que vous avez envoyés aux consultants DRH.`;
                }


                showModal("error", "Accès Refusé", errorBody, "");

            }
        }


        if ((ficheFromArr.status === "ÉVALUÉ" && manager.type === '1') || (ficheFromArr.status === "TERMINÉ" && manager.type === '2')) {

            // SHOW ALERT MODAL
            showModal("error", "Accès refusé", "Vous ne pouvez pas accéder aux fiches d'évaluations que vous avez évalués.  En cas de problème, contactez-nous", "")

        } else if (manager.type === '2' && ficheFromArr.status === "CREATED") {

            // SHOW ALERT MODAL
            showModal("error", "Accès refusé", "Vous n'avez pas accès. Parce que le manager N+1 n'a pas encore évalué cette fiche");


        } else {



        }


    })

})

function buildURL(prefix, params) {

    let url = prefix + "?";
    for (var key of Object.keys(params)) {
        url = url + key + "=" + params[key] + "&";
    }

    return url;
}

async function getListOfFichesByMatricule(matricule) {
    let url = "http://localhost:8080/preassessment/api/v1/ficheEvaluation/" + matricule;
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

function getFichesColumnFromJson(json, authorizedCol) {
    let colArr = [];



    // ADD CUSTOM COLUMNS


    authorizedCol.map((col, index) => {
        let value;
        // console.log(col);
        console.log(json.hasOwnProperty(col));
        if (json.hasOwnProperty(col)) {
            switch (col) {
                case "collaborateur":
                    value = "collaborateur";
                    break;
                case "id":
                    value = "id";
                    break;
                case "emploi":
                    value = "emploi ciblé"
                    break;
                case "evaluateurOne":
                    value = "evaluateurOne"
                    break;

                case "associatedAssessment":
                    value = "assessment";
                    break;
                case "status":
                    value = "status"
                    break;
            }

            // console.log(value);

            if (value === "collaborateur") {
                colArr.push({
                    "title": "Matriculle"
                }, {
                    "title": "Collaborateur"
                });
            } else if (value === "evaluateurOne") {
                colArr.push({
                    "title": "Matriculle (Manager)"
                }, {
                    "title": "Manager"
                });
            } else {
                colArr.push({
                    "title": value
                });
            }




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

function getFichesDataFromJson(arrJson, authorizedCol) {
    let finalArr = [];

    //
    for (var i = 0; i < arrJson.length; i++) {

        let e = arrJson[i];
        console.log(e);


        // IF DATE D'EVALUATION IS THE SAME AS TODAY
        let dateNow = new Date();
        if (comparingDates(dateNow.toISOString().split("T")[0], e.dateEvaluation.split("T")[0]).includes("greater")) {
            continue;
        }

        // console.log(i);
        let arr = [];

        authorizedCol.map((authorized, index) => {

            switch (authorized) {
                case "id":
                    arr.push(e.id);
                    break;
                case "collaborateur":
                    arr.push(e.collaborateur.matricule);
                    arr.push(e.collaborateur.firstName + " " + e.collaborateur.lastName);
                    break;
                case "evaluateurOne":
                    arr.push(e.evaluateurOne.matricule);
                    arr.push(e.evaluateurOne.firstName + " " + e.evaluateurOne.lastName);
                    break;
                case "emploi":
                    arr.push(e.emploi.intitule);
                    break;
                case "niveau":
                    arr.push(e.emploi.level);
                    break;
                case "associatedAssessment":
                    arr.push(e.associatedAssessment.name);
                    break;

                case "status":
                    console.log("HERE STATUS", authorized);
                    // Status attribute has special style
                    if (e.status === "CREATED") {
                        arr.push(`
                        <div class="mt-sm-1 d-block">
                            <span class="badge bg-danger-transparent rounded-pill text-danger p-2 px-3">Non évalué</span>
                        </div>
                            `)
                    } else if (e.status.includes("ÉVALUÉ")) {
                        arr.push(`
                        <div class="mt-sm-1 d-block">
                            <span class="badge bg-warning-transparent rounded-pill text-warning p-2 px-3">Évalué</span>
                        </div>
                            `)
                    } else if (e.status.includes("TERMINÉ")) {
                        arr.push(`
                        <div class="mt-sm-1 d-block">
                            <span class="badge bg-success-transparent rounded-pill text-success p-2 px-3">Terminé</span>
                         </div>
                        `)
                    }
                    console.log("fin STATUS");
                    break;

            }
        })



        // ACTION COL
        arr.push(`
            <div id="${i}" class="g-1">
                <a class="btn text-primary btn-sm view-btn" data-bs-toggle="tooltip"
                    data-bs-original-title="Évaluer"><span
                        class="fe fe-edit fs-14"></span></a>
            </div>
            `)



        finalArr.push(arr);
    }

    return finalArr;
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
    $(modalHeaderId).html(header);

    // SET CONTENT
    $(modalContentId).html(content)

    myModal.show();

}


function comparingDates(d1, d2) {
    let date1 = new Date(d1).getTime();
    let date2 = new Date(d2).getTime();

    if (date1 < date2) {
        return `${d1} is less than ${d2}`;
    } else if (date1 > date2) {
        return `${d1} is greater than ${d2}`;
    } else {
        return `Both dates are equal`;
    }
};

function getFicheInfoFromArr(ficheId) {

    for (var i = 0; i < listFiches.length; i++) {
        let ficheEva = listFiches[i];

        if (ficheId == ficheEva.id) {
            return {
                "index" : i,
                "fiche" : ficheEva
            }
        }

        return {
            "index" : -1,
            "fiche" : null
        }
    }
}