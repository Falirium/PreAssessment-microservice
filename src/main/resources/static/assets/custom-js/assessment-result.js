// GET PARAMS FROM URL
const url = window.location.href;
let idParam = url.split("/").at(-1);

console.log(idParam);

// THIS VARIABLE DEFINED THE SHOWN COLUMN ON THE TABLE

let authorizedCol = ["id", "collaborateur", "evaluateurOne", "evaluateurTwo", "emploi", "niveau", "associatedAssessment", "status"];


let assessmentJson;

// GET THE ASSESSMENT JSON
getFicheEvaluationsByAssessment(idParam).then((fiches) => {

    fichesArrJson = fiches;

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
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
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
        } else if (fiche.status.includes("ÉVALUÉ")) {
            numberOfInProgress++;
        } else if (fiche.status.includes("TERMINÉ")) {
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
                case "associatedAssessment":
                    value = "assessment";
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
        arr.push(e.associatedAssessment.name);

        // Status attribute has special style
        if (e.status === "CREATED") {
            arr.push(`
            <div class="mt-sm-1 d-block">
                <span class="badge bg-danger-transparent rounded-pill text-danger p-2 px-3">Non évalué</span>
            </div>
                `)
        } else if (e.status.includes("ÉVALUÉ") ){
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

        // ACTION COL
        arr.push(`
            <div id="${i}" class="g-1">
                <a class="btn text-primary btn-sm view-btn" data-bs-toggle="tooltip"
                    data-bs-original-title="Voir le résultat"><span
                        class="fe fe-edit fs-14"></span></a>
            </div>
            `)



        finalArr.push(arr);
    })

    return finalArr;
}