// GET MANAGER OR CONSULTANT INFO
let user = localStorage.getItem("user");

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
    
    // CLEAR EVERY DATA STORED IN LOCAL_STORAGE
    localStorage.clear();

    // REDIRECT TO LOGINPAGE
    window.location.replace(extractDomain(window.location.href));
})

