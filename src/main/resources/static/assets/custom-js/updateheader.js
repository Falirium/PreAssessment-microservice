// GET MANAGER OR CONSULTANT INFO
let user = sessionStorage.getItem("user");

if (user === "admin") {
    // IS ADMIN
    $("#profile-name").text("ADMIN");
    $("#profile-role").text("Consultant BCP");

} else {
    // IS MANAGER
    let manager = JSON.parse(user);
    let managerFullName = manager.data.firstName + " " + manager.data.lastName;

    $("#profile-name").text(managerFullName);
    $("#profile-role").text("Manager");
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

