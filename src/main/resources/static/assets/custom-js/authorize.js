// CHECK FOR MANAGER ENTITY
let currentUrl;
if (sessionStorage.getItem("user") === null) {
        currentUrl = window.location.href;
        window.location.replace(extractDomain(currentUrl));
    
}

function extractDomain(url) {
    const elems = url.split("/");
    return elems[0] + "//" + elems[2] + "/";
}