// CHECK FOR MANAGER ENTITY
if (sessionStorage.getItem("user") === null) {
    

        currentUrl = window.location.href;
        window.location.replace(extractDomain(currentUrl));
    
   

}

const extractDomain = (url) => {
    const elems = url.split("/");
    return elems[0] + "//" + elems[2] + "/";
}