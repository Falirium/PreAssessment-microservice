// GET PARAMS FROM URL
const url = window.location.href;
let idParam = url.split("/").at(-1);

console.log(idParam);

// THIS VARIABLE DEFINED THE SHOWN COLUMN ON THE TABLE

let authorizedCol = ["id", "collaborateur", "evaluateurOne", "evaluateurTwo", "emploi", "niveau", "Score", "status"];


let assessmentJson;

// GET THE ASSESSMENT JSON
getFicheEvaluationsByAssessment(idParam).then((fiches) => {

    fichesArrJson = fiches;

    // GET ASSESSMENTJSON FROM FICHE EVALUATION
    assessmentJson = fiches[0].associatedAssessment;

    // COUNT HOLDS A JSON THAT CONTAINS : total, blank, inProgress, completed 
    let count = iterateOverEvaluations(fichesArrJson);
    console.log(count);

    // DISPLAY THE RESULTS
    displayBlankEvaluations(count.blank, count.total);
    displayInProgressEvaluations(count.inProgress, count.total);
    displayCompletedEvaluations(count.completed, count.total);
    displayTotalFiches(count.total);

    // DISPLAY THE LIST OF FICHES

    // INITIALIZE DATATABLE

    let dataSet = getFichesDataFromJson(fichesArrJson);
    let col = getFichesColumnFromJson(fichesArrJson[0], authorizedCol);
    let fileTitle = assessmentJson.name + "_At_" + new Date().toISOString().split("T")[0];

    ficheDatatable = $("#tb4").DataTable({
        data: dataSet,
        columns: col,
        columnDefs: [
            { "width": "6%", "targets": 2 }
        ],
        autoWidth: false,
        ordering: false,
        dom: 'Bfrtip',
        buttons: [

            {
                extend: 'excelHtml5',
                title: fileTitle,
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            }
        ]
    })

    // ADD EVENT LISTENER ON VIEW BTN
    $(".view-btn").click(function (e) {

        let aElement;
        if (e.target.tagName === "SPAN") {
            aElement = e.target.parentElement;
        } else {
            aElement = e.target;
        }

        let ficheEvaluationId = $(aElement).parents("td").siblings().slice(0, 1).text();
        console.log(ficheEvaluationId);

        let ficheFromArr = getFicheInfoFromArr(ficheEvaluationId).fiche;


        // CHECK IF THE FICHE IS ALREADY EVALUATED BY THE SAM MANAGER




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



        window.open(extractDomain(window.location.href) + url);
        // console.log(extractDomain(currentUrl) + url);


    })


})

async function getFicheEvaluationsByAssessment(idParam) {
    let url = "http://localhost:8080/preassessment/api/v1/ficheEvaluation/assessment/" + idParam;

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

function displayBlankEvaluations(number, total) {

    $("#total-blank-evaluation").html(number);

    let width = (number / total) * 100;

    $("#progress-bar-blank").attr("style", `width: ${width}%;`);

}

function displayInProgressEvaluations(number, total) {
    $("#total-inprogress-evaluation").html(number);

    let width = (number / total) * 100;

    $("#progress-bar-inprogress").attr("style", `width: ${width}%;`);
}

function displayCompletedEvaluations(number, total) {
    $("#total-completed-evaluation").html(number);

    let width = (number / total) * 100;

    $("#progress-bar-completed").attr("style", `width: ${width}%;`);
}

function displayTotalFiches(total) {
    $("#total-fiches").html(total);
}

function iterateOverEvaluations(arrJson) {

    let numberOfBlank = 0;
    let numberOfInProgress = 0;
    let numberOfCompleted = 0;

    arrJson.map((fiche, index) => {
        if (fiche.status === "CREATED") {
            numberOfBlank++;
        } else if (fiche.status.includes("ÉVALUÉ") || fiche.status.includes("TERMINÉ-0")) {
            numberOfInProgress++;
        } else if (fiche.status.includes("TERMINÉ-1")) {
            numberOfCompleted++;
        }
    });

    return {
        "total": arrJson.length,
        "blank": numberOfBlank,
        "inProgress": numberOfInProgress,
        "completed": numberOfCompleted
    }

}

function getFichesColumnFromJson(json, authorizedCol) {
    let colArr = [];



    // ADD CUSTOM COLUMNS


    authorizedCol.map((col, index) => {
        let value;
        console.log(col);
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
                case "evaluateurTwo":
                    value = "evaluateurTwo"
                    break;
                case "Score":
                    value = "score";
                    break;
                case "status":
                    value = "status"
                    break;
            }

            console.log(value);

            if (value === "collaborateur") {
                colArr.push({
                    "title": "Matriculle"
                }, {
                    "title": "Collaborateur"
                });
            } else if (value === "evaluateurOne") {
                colArr.push({
                    "title": "Matriculle - N+1"
                }, {
                    "title": "Manager N+1"
                });
            } else if (value === "evaluateurTwo") {
                colArr.push({
                    "title": "Matriculle - N+2"
                }, {
                    "title": "Manager N+2"
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

function getFichesDataFromJson(arrJson) {
    let finalArr = [];
    arrJson.map((e, i) => {
        console.log(i);
        let arr = [];

        arr.push(e.id);
        arr.push(e.collaborateur.matricule);
        arr.push(e.collaborateur.firstName + " " + e.collaborateur.lastName);
        arr.push(e.evaluateurOne.matricule);
        arr.push(e.evaluateurOne.firstName + " " + e.evaluateurOne.lastName);
        arr.push(e.evaluateurTwo.matricule);
        arr.push(e.evaluateurTwo.firstName + " " + e.evaluateurTwo.lastName);
        arr.push(e.emploi.intitule);
        arr.push(e.emploi.level);
        arr.push(e.score);

        // Status attribute has special style
        if (e.status === "CREATED") {
            arr.push(`
            <div class="mt-sm-1 d-block">
                <span class="badge bg-danger-transparent rounded-pill text-danger p-2 px-3">Non évalué</span>
            </div>
                `)
        } else if (e.status.includes("ÉVALUÉ-0")) {
            arr.push(`
            <div class="mt-sm-1 d-block">
                <span class="badge bg-warning-transparent rounded-pill text-warning p-2 px-3">Évalué</span>
            </div>
            <div class="mt-sm-1 d-block">
                <span class="badge bg-warning-transparent rounded-pill text-warning p-2 px-3">en cours</span>
            </div>
                `)
        } else if (e.status.includes("ÉVALUÉ-1")) {
            arr.push(`
            <div class="mt-sm-1 d-block">
                <span class="badge bg-success-transparent rounded-pill text-success p-2 px-3">Évalué par N+1</span>
            </div>
                `)
        } else if (e.status.includes("TERMINÉ-0")) {
            arr.push(`
            <div class="mt-sm-1 d-block">
                <span class="badge bg-warning-transparent rounded-pill text-warning p-2 px-3">Validé</span>
             </div>
             <div class="mt-sm-1 d-block">
                <span class="badge bg-warning-transparent rounded-pill text-warning p-2 px-3">En cours</span>
             </div>
            `)
        }  else if (e.status.includes("TERMINÉ-1")) {
            arr.push(`
            <div class="mt-sm-1 d-block">
                <span class="badge bg-success-transparent rounded-pill text-success p-2 px-3">Validé par N+2</span>
             </div>
            `)
        }


        // ACTION COL
        arr.push(`
            <div id="view-btn" class="g-1">
                <a class="btn text-primary btn-sm view-btn" data-bs-toggle="tooltip"
                    data-bs-original-title="Voir le résultat"><span
                        class="fe fe-eye fs-14"></span></a>
            </div>
            `)



        finalArr.push(arr);
    })

    return finalArr;
}

function getFicheInfoFromArr(ficheId) {

    for (var i = 0; i < fichesArrJson.length; i++) {
        let ficheEva = fichesArrJson[i];

        if (ficheId == ficheEva.id) {
            return {
                "index": i,
                "fiche": ficheEva
            }
        }


    }

    return {
        "index": -1,
        "fiche": null
    }
}

function buildURL(prefix, params) {

    let url = prefix + "?";
    for (var key of Object.keys(params)) {
        url = url + key + "=" + params[key] + "&";
    }

    return url;
}
