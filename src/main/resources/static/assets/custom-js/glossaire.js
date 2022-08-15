$(function () {
    let glossaireArray = [];

    let fileExcel = document.querySelector("#input-file");
    let competenceArray = [];

    let competenceNameArray = [];
    let competenceDefArray = [];
    let competenceLevelsDefArray = [];

    let counter = 1;


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

        console.log("HEEERRE");
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
                    let nameCell = tr.insertCell(-1);
                    nameCell.innerHTML = glossaire[j].name;

                    let niveauCell = tr.insertCell(-1);
                    niveauCell.innerHTML = glossaire[j]["niveaux"][i].level;

                    let defCell = tr.insertCell(-1);
                    defCell.innerHTML = glossaire[j]["niveaux"][i].definition;
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

        // ADD DATABALE LIBRARY SCRIPTS
        loadJS("/assets/plugins/datatable/js/jquery.dataTables.min.js", false);
        loadJS("/assets/plugins/datatable/js/dataTables.bootstrap5.js", false);
        loadJS("/assets/plugins/datatable/js/dataTables.buttons.min.js", false);
        loadJS("/assets/plugins/datatable/js/buttons.bootstrap5.min.js", false);
        loadJS("/assets/plugins/datatable/js/jszip.min.js", false);
        loadJS("/assets/plugins/datatable/pdfmake/pdfmake.min.js", false);
        loadJS("/assets/plugins/datatable/pdfmake/vfs_fonts.js", false);
        loadJS("/assets/plugins/datatable/js/buttons.html5.min.js", false);
        loadJS("/assets/plugins/datatable/js/buttons.print.min.js", false);
        loadJS("/assets/plugins/datatable/js/buttons.colVis.min.js", false);
        loadJS("/assets/plugins/datatable/dataTables.responsive.min.js", false);
        loadJS("/assets/plugins/datatable/responsive.bootstrap5.min.js", false);
        loadJS("/assets/js/table-data.js", false);






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


    fileExcel.addEventListener("change", (e) => {

        // HIDE MODAL
        // var myModal = new bootstrap.Modal(document.getElementById('input-modal'));
        // myModal.hide();
        $("#input-modal").modal('hide');

        // ADD LOADER ON THE PAGE
        $("#btn-add-file").addClass("btn-loading");

        // POPULATE GLOSSAIRE ARRAY
        parseExcelFile2(fileExcel);






    })

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

                        console.log(level, levelDef, row);

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
                    glossaireArray = competenceArray;
                    // //HIDE LOADER
                    $("#btn-add-file").removeClass("btn-loading");

                    // DISPLAY THE TABLE
                    parseGlossaireToTable(glossaireArray);
                });
        };
        reader.readAsArrayBuffer(file);
    }

    function getGlossaireOfCompentence(names, defs, levels) {
        names.map((e, index) => {
            let competenceJson = {
                "name": e,
                "définition": defs[index],
                "niveaux": []
            }
            for (var i = 0; i < 4; i++) {
                competenceJson["niveaux"].push(levels[0]);
                levels.shift();
            }

            competenceArray.push(competenceJson);
        })
    }

    function loadJS(FILE_URL, async = true) {
        let scriptEle = document.createElement("script");

        scriptEle.setAttribute("src", FILE_URL);
        scriptEle.setAttribute("type", "text/javascript");
        scriptEle.setAttribute("async", async);

        document.body.appendChild(scriptEle);

        // success event 
        scriptEle.addEventListener("load", () => {
            console.log("File loaded")
        });
        // error event
        scriptEle.addEventListener("error", (ev) => {
            console.log("Error on loading file", ev);
        });
    }


});
