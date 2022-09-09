// GET MANAGER OR CONSULTANT INFO

if (sessionStorage.getItem("manager") != null) {
    let manager = JSON.parse(sessionStorage.getItem("manager"));
    let managerFullName = manager.data.firstName + " " + manager.data.lastName;

    $("#profile-name").text(managerFullName);
    $("#profile-role").text("Manager");
} else if (sessionStorage.getItem("consultant") != null) {
    let consultant = JSON.parse(sessionStorage.getItem("consultant"));
    let consultantFullName = consultant.data.firstName + " " + consultant.data.lastName;

    $("#profile-name").text(managerFullName);
    $("#profile-role").text("Consultant BCP");
}

//ADD EVENT LISTENER ON SIGNOUT
$("#signout").click(function() {
    if (sessionStorage.getItem("manager") != null) {
        sessionStorage.removeItem("manager");
    } else if (sessionStorage.getItem("consultant") != null) {
        sessionStorage.removeItem("consultant");
    }

    // REDIRECT TO LOGINPAGE
    window.location.replace(extractDomain(window.location.href));
})

