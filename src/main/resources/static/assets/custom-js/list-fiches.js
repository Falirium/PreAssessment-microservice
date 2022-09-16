
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

let manager = JSON.parse(sessionStorage.getItem("user"));

let managerMatricule =  manager.data.matricule;;

let authorizedCol = ["id", "collaborateur","emploi","niveau", "associatedAssessment", "status"];

let ficheDatatable;





let listFiches;

// GET LIST OF FICHES
let fichesJson = getListOfFichesByMatricule(managerMatricule).then((data) => {


    listFiches = data;
    // INITIALIZE DATATABLE

    let dataSet = getFichesDataFromJson(data);
    let col = getFichesColumnFromJson(data[0], authorizedCol);

    ficheDatatable = $("#tb1").DataTable({
        data: dataSet,
        columns: col,
        columnDefs: [
            { "width": "6%", "targets": 2 }
        ],
        autoWidth: false
    })

    // ADD EVENTLISTENERS TO VIEW BTN
    $(".view-btn").click(function (e) {

        let aElement;
        if (e.target.tagName === "SPAN") {
            aElement = e.target.parentElement;
        } else {
            aElement = e.target;
        }

        let btns = $(".view-btn").get();
        let indexOfFiche = btns.indexOf(aElement);

        // GET THE ASSOCIATED FIHCE D EVALUATION
        let fiche = listFiches[indexOfFiche];
        console.log(fiche);

        //SAVE FICHE OBJECT ON LOCAL SESSION
        sessionStorage.setItem("ficheEvaluation", JSON.stringify(fiche));

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

        window.open(extractDomain(currentUrl) + url)
        // console.log(extractDomain(currentUrl) + url);
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

    // for (var key of Object.keys(json)) {
    //     if (authorizedCol.includes(key)) {
    //         let value;
    //         switch (key) {
    //             case "collaborateur":
    //                 value = "collaborateur";
    //                 break;
    //             case "emploi":
    //                 value = "emploi ciblé"
    //                 break;
    //             case "associatedAssessment":
    //                 value = "assessment";
    //                 break;
    //             case "status":
    //                 value = "status"
    //                 break;

    //         }
    //         colArr.push({
    //             "title": value
    //         });

    // }

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
        } else if (e.status === "ÉVALUÉ") {
            arr.push(`
                <div class="mt-sm-1 d-block">
                <span class="badge bg-warning-transparent rounded-pill text-warning p-2 px-3">Évalué</span>
            </div>
                `)
        } else if (e.status === "TERMINÉ") {
            arr.push(`
                <div class="mt-sm-1 d-block">
                <span class="badge bg-success-transparent rounded-pill text-success p-2 px-3">Terminé</span>
            </div>
                `)
        }

        // ACTION COL
        arr.push(`
            <div class="g-1">
                <a class="btn text-primary btn-sm view-btn" data-bs-toggle="tooltip"
                    data-bs-original-title="Évaluer"><span
                        class="fe fe-edit fs-14"></span></a>
            </div>
            `)



        finalArr.push(arr);
    })

    return finalArr;
}