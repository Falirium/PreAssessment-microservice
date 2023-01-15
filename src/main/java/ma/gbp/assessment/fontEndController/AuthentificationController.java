package ma.gbp.assessment.fontEndController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import ma.gbp.assessment.message.AuthentificationRes;
import ma.gbp.assessment.model.Drh;
import ma.gbp.assessment.model.Employee;
import ma.gbp.assessment.model.ManagerOne;
import ma.gbp.assessment.model.ManagerTwo;
import ma.gbp.assessment.service.DrhService;
import ma.gbp.assessment.service.ManagerOneService;
import ma.gbp.assessment.service.ManagerTwoService;
import ma.gbp.assessment.service.UserService;

@Controller
public class AuthentificationController {

    @Autowired
    private ManagerOneService managerOneService;

    @Autowired
    private ManagerTwoService managerTwoService;

    @Autowired
    private DrhService drhService;

    @Autowired
    private UserService userService;
    
    @GetMapping(value = {"/login"})
    public String loging() {
        return "login.html";
    }

    @PostMapping("/login") 
    public ResponseEntity<AuthentificationRes> authetificateUser(@RequestBody Employee user) {

        AuthentificationRes authUser = new AuthentificationRes();

        ManagerOne userManagerOne = managerOneService.getManagerOneByMatricule(user.getMatricule());
        ManagerTwo userManagerTwo = managerTwoService.getManagerTwoByMatricule(user.getMatricule());
        Drh userDrh = drhService.getDrhByMatricule(user.getMatricule());

        if (userManagerOne != null || userManagerTwo != null) {
            authUser.setAuth(true);
            authUser.setRole("manager");
            authUser = new AuthentificationRes("manager",
                 true, 
                 (userManagerOne == null) ? (userManagerTwo.getFirstName()) : (userManagerOne.getFirstName()),
                 (userManagerOne == null) ? (userManagerTwo.getLastName()) : (userManagerOne.getLastName()),
                 (userManagerOne == null) ? (userManagerTwo.getMatricule()) : (userManagerOne.getMatricule()));


        } else if (userDrh != null) {
            // authUser.setAuth(true);
            // authUser.setRole("drh");
            authUser = new AuthentificationRes("drh",
                true,
                userDrh.getFirstName(),
                userDrh.getLastName(),
                userDrh.getMatricule());

        } else {
            // authUser.setAuth(true);
            // authUser.setRole("admin");
            authUser = new AuthentificationRes(
                "admin",
                true,
                "Consultant BCP",
                "",
                ""
            );
        }

        return ResponseEntity.status(HttpStatus.OK).body(authUser);
    }

}
