// GET VALUES FROM INPUTS
let matricule;
let password;

$("#matricule-input").change(function (e) {
    matricule = e.target.value;
})

$("#pwd-input").change(function (e) {
    password = e.target.value;
})

$("#cnx-btn").click(function () {
    //console.log(typeof(authenticate(matricule)), typeof(authenticate(matricule).then));
    if (validateMatriculeConsultant(matricule, password)) {

        // SAVE MANAGER MATRICULE
        sessionStorage.setItem("manager", "admin");

        // REDIRECT TO HOMEPAGE
        let currentUrl = window.location.href;
        window.location.replace(extractDomain(currentUrl) + "assessment/list");
        

    } else {
        authenticate(matricule).then((manager) => {
            console.log(manager, password);
            console.log(manager.type, (password === "manager2"));
            if (manager.type === "1" && password === "manager1") {
                showModal("success", "Welcome :" + manager.data.firstName, "Vous avez été connecté avec succès");

                // SAVE MANAGER MATRICULE
                sessionStorage.setItem("manager", JSON.stringify(manager));

                // REDIRECT TO HOMEPAGE
                let currentUrl = window.location.href;
                window.location.replace(extractDomain(currentUrl) + "evaluation/list");
                console.log("redirected");


            } else if (manager.type == "2" && password === "manager2") {
                showModal("success", "Welcome :" + manager.data.firstName, "Vous avez été connecté avec succès");

                // SAVE MANAGER MATRICULE
                sessionStorage.setItem("manager", JSON.stringify(manager));

                // REDIRECT TO HOMEPAGE
                let currentUrl = window.location.href;
                window.location.replace(extractDomain(currentUrl) + "evaluation/list");

                console.log("redirected");

            } else {
                showModal("error", "échec", "Le mot de passe est incorrect")
            }

        });
    }

})

const extractDomain = (url) => {
    const elems = url.split("/");
    return elems[0] + "//" + elems[2] + "/";
}

async function authenticate(mat) {



    // GET THE MANAGER
    return validateMatriculeManagerOne(mat).then((res) => {
        let manager = {}
        if (res.code === 404) {
            console.log("mal9itoch");

            return validateMatriculeManagerTwo(mat).then((res) => {
                // let manager = {
                //     "type": "",
                //     "data": {}
                // }
                console.log(manager.type);
                if (res.code === 404) {
                    throw "Manager not found";
                } else {
                    manager.type = "2";
                    manager.data = res;
                    console.log(manager);
                }
                return manager;
            }).catch((error) => {
                console.log("not found manager 2");
                showModal("error", "L'authentification a échoué", "Le matricle est erroné", "");
            })
        } else {
            manager.type = "1";
            manager.data = res;
        }
        return manager;


    }).catch((error) => {
        let errorMsg = error;
        console.log("not found manager 1");
        console.log(mat);
        return error;

        //showModal("error", "L'authentification a échoué", error, "");

    })




}

async function validateMatriculeManagerOne(matricule) {
    let url1 = "http://localhost:8080/preassessment/api/v1/employee/managerOne/" + matricule;


    return fetch(url1, {
        method: 'GET'
    }).then(response => response.json())
        .then((success) => {
            console.log(success);
            return success;
        }).catch((error) => {
            console.error(error);
            return error;
        })
}

async function validateMatriculeManagerTwo(matricule) {

    let url2 = "http://localhost:8080/preassessment/api/v1/employee/managerTwo/" + matricule;

    return fetch(url2, {
        method: 'GET'
    }).then(response => response.json())
        .then((success) => {
            console.log(success);
            return success;
        }).catch((error) => {
            console.error(error);
            return error;
        })
}

function validateMatriculeConsultant(matricule, pwd) {

    if (matricule === "admin" && pwd === "admin123") {
        return true;
    } else {
        return false;
    }
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

