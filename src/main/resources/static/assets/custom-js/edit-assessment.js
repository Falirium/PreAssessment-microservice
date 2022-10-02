

// CHECK IF THERE IS A ASSESSMENT ON LOCAL STORAGE
if (localStorage.getItem('assessmentId') != null) {

    let assessmentId = localStorage.getItem('assessmentId');

    // GET THE ASSESSMENT TEMP ENTITY
    getAssessmentTemp(assessmentId).then((assessmentValues) => {

        // ASSIGN VALUES TO VARIABLES
        populateAssessmentVariables(assessmentValues);

        // PARSE THE ASSESSMENT
        parseAssessmentFieldsForEdit();
    })





} else {

    // REDIRECT TO ASSESSMENTS PAGE
    setTimeout(function () {
        let currentUrl = window.location.href;

        window.open(extractDomain(currentUrl) + "assessment/list");
    }, 1000);
}

async function getAssessmentTemp(id) {
    let url = "http://localhost:8080/preassessment/api/v1/assessment/temp/" + id;

    return fetch(url, {
        method: 'GET'
    }).then(
        response => response.json()
    ).then(
        success => success
    ).catch(error => console.log(error))
}

function populateAssessmentVariables(json) {


    let values = JSON.parse(json.content);
    console.log(values);

    // START ASSIGN REQUESTASSESSMENT BASE INFO FIELDS
    requestBodyAssessment.name = json.name;
    requestBodyAssessment.targetedDirection = values.targetedDirection;
    requestBodyAssessment.status = values.status;
    requestBodyAssessment.startedAt = values.startedAt;
    requestBodyAssessment.finishesAt = values.finishesAt;

    // START ASSIGN VARIABLES
    categoriesRequestBody = values.categoriesRequestBody;
    classificationColumns = values.classificationColumns;
    populationArr = values.populationArr;
    categorizedPopulationArr = values.categorizedPopulationArr;
    listEmploi = values.listEmploi;
}

function parseAssessmentFieldsForEdit() {

    // PARSE GENERAL INFO
    $("#input-name-campagne").val(requestBodyAssessment.name);
    console.log(requestBodyAssessment);
    $("#input-regions-campagne").val(requestBodyAssessment.targetedDirection);
    $("#input-regions-campagne").trigger('change');

    $("#input-started-date").val(requestBodyAssessment.startedAt);
    $("#input-finishes-date").val(requestBodyAssessment.finishesAt);


    // PARSE THE POPULATION TABLE IN STEP 2
    let dataSetPopulation = populationArr.filter((element, index) => {
        if (index !== 0) return true;
    });

    let colPopulation = generateColumnsForDatatable(populationArr[0]);

    populationTable = $("#tb1").DataTable({
        data: dataSetPopulation,
        columns: colPopulation
    });

    //POPULATE CLASSIFICATION COLUMNS FOR CRITERIAS SELECT2 
    populateWithClassificationColumns();

    // POPULATE THE TABLE OF CATEGORIES
    parseToCategoryTable(categoriesRequestBody);

    // POPULATE THE TABLE OF CATEGORIZED POPULATION
    let colCatPopulation = generateColumnsForDatatable(categorizedPopulationArr[0]);
    let dataSetCatPopulation = categorizedPopulationArr.filter((e, i) => {
        if (i !== 0) return true;
    })
    categorizationTable = $("#tb2").DataTable(
        {
            data: dataSetCatPopulation,
            columns: colCatPopulation
        }
    );


}