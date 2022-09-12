
console.log("list-assessments.js")



let authorizedCol = ["id", "name","startedAt","finishesAt", "status"];

let assessmentDatatable;


let listAssessments;

// GET LIST OF ASSESSMENTS
getListOfAssessments().then((data) => {


    listAssessments = data;
    // INITIALIZE DATATABLE

    let dataSet = getAssessmentsDataFromJson(data);
    let col = getAssessmentColumnFromJson(data[0], authorizedCol);

    assessmentDatatable = $("#tbs2").DataTable({
        data: dataSet,
        columns: col
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
        let indexOfAssessment = btns.indexOf(aElement);

        // GET THE ASSOCIATED ASSESSMENT
        let assessment = listAssessments[indexOfAssessment];
        console.log(assessment);

        //SAVE ASSESSMENT ON LOCAL SESSION
        sessionStorage.setItem("assessment", JSON.stringify(assessment));

        // REDIRECT TO THE ASSESSMENT PAGE 
        // let url = buildURL("evaluation/evaluate", urlParams);

        // window.open(extractDomain(currentUrl) + url)
        console.log(sessionStorage.getItem("assessment"));
    })

})

function buildURL(prefix, params) {

    let url = prefix + "?";
    for (var key of Object.keys(params)) {
        url = url + key + "=" + params[key] + "&";
    }

    return url;
}

async function getListOfAssessments() {
    let url = "http://localhost:8080/preassessment/api/v1/assessment/" ;
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

function getAssessmentColumnFromJson(json, authorizedCol) {
    let colArr = [];



    authorizedCol.map((col, index) => {
        let value;
        console.log(col);
        console.log(json.hasOwnProperty(col));
        if (json.hasOwnProperty(col)) {
            switch (col) {
                case "name":
                    value = "Nom";
                    break;
                case "id":
                    value = "id";
                    break;
                case "startedAt":
                    value = "date de début"
                    break;
                case "finishesAt":
                    value = "date de fin";
                    break;
                case "status":
                    value = "status"
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

function getAssessmentsDataFromJson(arrJson) {
    let finalArr = [];
    arrJson.map((e, i) => {
        console.log(i);
        let arr = [];

        arr.push(e.id.split("-")[0]);
        arr.push(e.name);
        arr.push(e.startedAt.split("T")[0]);
        arr.push(e.finishesAt.split("T")[0]);

        // Status attribute has special style
        if (e.status === "CREATED") {
            arr.push(`
            <div class="mt-sm-1 d-block">
             <span class="badge bg-purple-transparent rounded-pill text-purple p-2 px-3"> Enregistré </span>
            </div>
                `)
        } else if (e.status === "LANCHED") {
            let todayDate = new Date();
            let finishingDate = new Date(e.finishesAt.split("T")[0]);

            if ( finishingDate < todayDate ) {

                arr.push(`
                <div class="mt-sm-1 d-block">
                    <span class="badge bg-primary-transparent rounded-pill text-primary p-2 px-3"> Lancé </span>
                </div>
                <div class="mt-sm-1 d-block">
                    <span class="badge bg-danger-transparent rounded-pill text-danger p-2 px-3"> Dépassée </span>
                </div>
                    `)

            } else {

                arr.push(`
                <div class="mt-sm-1 d-block">
                    <span class="badge bg-primary-transparent rounded-pill text-primary p-2 px-3"> Lancé </span>
                </div>
                <div class="mt-sm-1 d-block">
                    <span class="badge bg-warning-transparent rounded-pill text-warning p-2 px-3"> En cours </span>
                </div>
                    `)

            }
            
        } else if (e.status === "COMPLETED") {
            arr.push(`
            <div class="mt-sm-1 d-block">
                <span class="badge bg-primary-transparent rounded-pill text-primary p-2 px-3"> Lancé </span>
            </div>
            <div class="mt-sm-1 d-block">
                <span class="badge bg-success-transparent rounded-pill text-success p-2 px-3"> Terminé </span>
            </div>
                `)
        }

        // ACTION COL
        arr.push(`
            <div class="g-1">
                <a class="btn text-primary btn-sm view-btn" data-bs-toggle="tooltip"
                    data-bs-original-title="Voir les résultas"><span
                        class="fe fe-edit fs-14"></span></a>
            </div>
            `)



        finalArr.push(arr);
    })

    return finalArr;
}