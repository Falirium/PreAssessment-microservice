let glossaireArray = [];


const btnAddGlossaire = document.querySelector("#btn-add-glossaire");


btnAddGlossaire.addEventListener("click", (e) => {
    let nomCompGlossaire = document.querySelector("#input-nom-competence-glossaire");
    let niveauCompGlassaire = Array.from(document.querySelectorAll("#input-niveau-competence-glossaire"));
    let defCompGlaossaire = Array.from(document.querySelectorAll("#input-def-competence-glossaire"));

    let competenceGlassaireJson = {
        "name": nomCompGlossaire.value,
        "niveaux": []
    }



    for (var i = 0; i < niveauCompGlassaire.length; i++) {
        let nivaeuJson = {
            "niveau": niveauCompGlassaire[i].value,
            "description": defCompGlaossaire[i].value
        }

        competenceGlassaireJson["niveaux"].push(nivaeuJson);
    }

    glossaireArray.push(competenceGlassaireJson);

    // INITIALIZE THE INPUTS
    nomCompGlossaire.value = "";
    defCompGlaossaire.forEach((definition) => {
        definition.value = "";
    })

    parseGlossaireToTable(glossaireArray);
})

function parseGlossaireToTable(glossaire) {
    let tableBody = document.querySelector("#glossaire-table-body");


    // Initilize the table body

    tableBody.innerHTML = ``;
    for (var j = 0; j < glossaire.length; j++) {

        for (var i = 0; i < glossaire[j]["niveaux"].length; i++) {

            let tr = tableBody.insertRow(-1);

            if (i === 0) {

                let nameCell = tr.insertCell(-1);
                nameCell.setAttribute("rowspan", "4");
                nameCell.innerHTML = glossaire[j].name;

                let niveauCell = tr.insertCell(-1);
                niveauCell.innerHTML = glossaire[j]["niveaux"][i].niveau;

                let defCell = tr.insertCell(-1);
                defCell.innerHTML = glossaire[j]["niveaux"][i].description;
                let actionCell = tr.insertCell(-1);
                actionCell.setAttribute("rowspan", "4");
                actionCell.innerHTML = `
                    <div class="g-2">
                        <a id="glo-table-btn-edit" class="btn text-primary btn-sm" data-bs-toggle="tooltip"
                            data-bs-original-title="Edit"><span class="fe fe-edit fs-14"></span></a>
                        <a id="glo-table-btn-delete" class="btn text-danger btn-sm" data-bs-toggle="tooltip"
                            data-bs-original-title="Delete"><span
                                class="fe fe-trash-2 fs-14"></span></a>
                    </div> 
                `;

            } else {
                let niveauCell = tr.insertCell(-1);
                niveauCell.innerHTML = glossaire[j]["niveaux"][i].niveau;

                let defCell = tr.insertCell(-1);
                defCell.innerHTML = glossaire[j]["niveaux"][i].description;



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

            console.log(competenceIndex);
            glossaireArray.splice(glossaireIndex, 1);

            parseGlossaireToTable(glossaireArray, niveau);

        })
    })



}