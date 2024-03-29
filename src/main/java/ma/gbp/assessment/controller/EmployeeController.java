package ma.gbp.assessment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import ma.gbp.assessment.exception.CustomErrorException;
import ma.gbp.assessment.model.Collaborateur;
import ma.gbp.assessment.model.Drh;
import ma.gbp.assessment.model.Employee;
import ma.gbp.assessment.model.ManagerOne;
import ma.gbp.assessment.model.ManagerTwo;
import ma.gbp.assessment.request.AuthReqBody;
import ma.gbp.assessment.service.CollaborateurService;
import ma.gbp.assessment.service.DrhService;
import ma.gbp.assessment.service.EmployeeService;
import ma.gbp.assessment.service.ManagerOneService;
import ma.gbp.assessment.service.ManagerTwoService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping(path = "/preassessment/api/v1/employee")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private ManagerOneService managerOneService;

    @Autowired
    private ManagerTwoService managerTwoService;

    @Autowired
    private CollaborateurService collaborateurService;

    @Autowired
    private DrhService drhService;

    @PostMapping("/managerOne")
    public ResponseEntity<List<ManagerOne>> saveManagersOne(@RequestBody List<ManagerOne> managersOne) {
        List<ManagerOne> savedManagersOne = new ArrayList<ManagerOne>();

        for (ManagerOne manager : managersOne) {

            // CHECK IF MANAGERTWO EXISTS
            if (doesEmployeeExist(manager.getFirstName(), manager.getLastName(), 1, false)) {
                savedManagersOne.add(
                        managerOneService.getManagerByFirstAndLastName(manager.getFirstName(), manager.getLastName()));
            } else {
                savedManagersOne.add(employeeService.saveManagerOne(manager));
            }
        }

        return ResponseEntity.status(HttpStatus.OK).body(savedManagersOne);
    }

    @PostMapping("/managerTwo")
    public ResponseEntity<List<ManagerTwo>> saveManagersTwo(@RequestBody List<ManagerTwo> managersTwo) {
        List<ManagerTwo> savedManagersTwo = new ArrayList<ManagerTwo>();

        for (ManagerTwo manager : managersTwo) {

            // CHECK IF MANAGERTWO EXISTS
            if (doesEmployeeExist(manager.getFirstName(), manager.getLastName(), 2, false)) {
                savedManagersTwo.add(
                        managerTwoService.getManagerByFirstAndLastName(manager.getFirstName(), manager.getLastName()));
            } else {
                savedManagersTwo.add(employeeService.saveManagerTwo(manager));
            }

        }

        return ResponseEntity.status(HttpStatus.OK).body(savedManagersTwo);
    }

    @PostMapping("/collaborateur")
    public ResponseEntity<List<Collaborateur>> saveCollaborateur(@RequestBody List<Collaborateur> collaborateurs) {
        List<Collaborateur> savedCollaborateurs = new ArrayList<Collaborateur>();

        for (Collaborateur collaborateur : collaborateurs) {

            // CHECK IF COLLABORATEUR EXISTS
            if (doesEmployeeExist(collaborateur.getFirstName(), collaborateur.getLastName(), 0, false)) {
                savedCollaborateurs.add(collaborateurService.getCollByFirstAndLastName(collaborateur.getFirstName(),
                        collaborateur.getLastName()));
            } else {
                savedCollaborateurs.add(employeeService.savCollaborateur(collaborateur));
            }

        }

        return ResponseEntity.status(HttpStatus.OK).body(savedCollaborateurs);
    }

    @PostMapping("/drh")
    public ResponseEntity<List<Drh>> saveDrh(@RequestBody List<Drh> listDrhs) {

        List<Drh> savedDrhs = new ArrayList<Drh>();

        for (Drh drh : listDrhs) {

            if (doesEmployeeExist(drh.getFirstName(), drh.getLastName(), 0, true)) {

                savedDrhs.add(drhService.getDrhByFirstAndLastName(drh.getFirstName(), drh.getLastName()));
            } else {
                drh.setHashedPwd(BCrypt.hashpw(drh.getHashedPwd(), BCrypt.gensalt()));

                savedDrhs.add(drhService.saveDrh(drh));
            }
        }
        return ResponseEntity.status(HttpStatus.OK).body(drhService.saveListOfDrhs(savedDrhs));
    }

    @PostMapping("/auth")
    public ResponseEntity<AuthReqBody> authenticateDrh(@RequestBody AuthReqBody auth) {

        boolean isAuth = false;

        switch (auth.getType()) {
            case "drh":
                Drh targetedUser = drhService.getDrhByMatricule(auth.getMatricule());

                if (targetedUser == null) {
                    throw new CustomErrorException(HttpStatus.NOT_FOUND, "Matricule not found");
                }

                auth.setAuth(BCrypt.checkpw(auth.getPwd(), targetedUser.getHashedPwd()));

                if (BCrypt.checkpw(auth.getPwd(), targetedUser.getHashedPwd())) {
                    auth.setDthUser(targetedUser);
                }

                break;
            case "managerOne":

                ManagerOne targetedManager1 = managerOneService.getManagerOneByMatricule(auth.getMatricule());
                if (targetedManager1 == null) {
                    throw new CustomErrorException(HttpStatus.NOT_FOUND, "Matricule not found");
                }

                isAuth = BCrypt.checkpw(auth.getPwd(), targetedManager1.getHashedPwd());
                break;

            case "manager":

                ManagerOne targetedManagerOne = managerOneService.getManagerOneByMatricule(auth.getMatricule());
                ManagerTwo targetedManagerTwo = managerTwoService.getManagerTwoByMatricule(auth.getMatricule());

                if (targetedManagerOne == null && targetedManagerTwo == null) {
                    throw new CustomErrorException(HttpStatus.NOT_FOUND, "Matricule not found");

                } else if (targetedManagerOne != null){

                    auth.setType("1");
                    auth.setAuth(BCrypt.checkpw(auth.getPwd(), targetedManagerOne.getHashedPwd()));

                    if (BCrypt.checkpw(auth.getPwd(), targetedManagerOne.getHashedPwd())) {
                        auth.setManagerOneUser(targetedManagerOne);
                    }

                }  else if (targetedManagerTwo != null){

                    auth.setType("2");
                    auth.setAuth(BCrypt.checkpw(auth.getPwd(), targetedManagerTwo.getHashedPwd()));
                    if (BCrypt.checkpw(auth.getPwd(), targetedManagerTwo.getHashedPwd())) {
                        auth.setManagerTwoUser(targetedManagerTwo);
                    }

                }

               
                break;

            case "managerTwo":

                ManagerTwo targetedManager2 = managerTwoService.getManagerTwoByMatricule(auth.getMatricule());
                if (targetedManager2 == null) {
                    throw new CustomErrorException(HttpStatus.NOT_FOUND, "Matricule not found");
                }

                isAuth = BCrypt.checkpw(auth.getPwd(), targetedManager2.getHashedPwd());
                break;
            case "admin":

                break;

        }

        return ResponseEntity.status(HttpStatus.OK).body(auth);
    }

    @PutMapping("/drh/update")
    public ResponseEntity<Drh> updateDrh(@RequestBody Drh updatedDrh) {

        Drh targetedDrh = drhService.getDrhByMatricule(updatedDrh.getMatricule());

        if (targetedDrh == null) {
            throw new CustomErrorException(HttpStatus.NOT_FOUND, "Drh not found");
        }

        targetedDrh.setCodePrefix(updatedDrh.getCodePrefix());
        targetedDrh.setCodeSuffix(updatedDrh.getCodeSuffix());
        targetedDrh.setDirection(updatedDrh.getDirection());
        targetedDrh.setFirstName(updatedDrh.getFirstName());
        targetedDrh.setLastName(updatedDrh.getLastName());
        targetedDrh.setTopDirection(updatedDrh.getTopDirection());
        targetedDrh.setMatricule(updatedDrh.getMatricule());
        targetedDrh.setPhoneNumber(updatedDrh.getPhoneNumber());
        targetedDrh.setWorkEmail(updatedDrh.getWorkEmail());
        targetedDrh.setTag(updatedDrh.getTag());

        return ResponseEntity.status(HttpStatus.OK).body(drhService.saveDrh(targetedDrh));
    }

    @PatchMapping("/drh/pwd")
    public ResponseEntity<Drh> changeDrhPwd(@RequestBody Drh drh) {

        Drh targetedDrh = drhService.getDrhByMatricule(drh.getMatricule());

        if (targetedDrh == null) {
            throw new CustomErrorException(HttpStatus.NOT_FOUND, "Drh not found");
        }

        targetedDrh.setHashedPwd(BCrypt.hashpw(drh.getHashedPwd(), BCrypt.gensalt()));

        return ResponseEntity.status(HttpStatus.OK).body(drhService.saveDrh(targetedDrh));
    }

    @PatchMapping("/manager/pwd")
    public ResponseEntity<Employee> changeManagerPwd(@RequestBody Employee manager) {

        Employee targetedEmployee = managerOneService.getManagerOneByMatricule(manager.getMatricule());

        if (targetedEmployee == null) {
            targetedEmployee = managerTwoService.getManagerTwoByMatricule(manager.getMatricule());

            if (targetedEmployee == null) {
                throw new CustomErrorException(HttpStatus.NOT_FOUND, "Manager not found");

            } else {

                targetedEmployee.setHashedPwd(BCrypt.hashpw(manager.getHashedPwd(), BCrypt.gensalt()));
                ManagerTwo targetedManagaer = (ManagerTwo) targetedEmployee;

                return ResponseEntity.status(HttpStatus.OK).body(managerTwoService.saveManager(targetedManagaer));
            }

        } else {

            targetedEmployee.setHashedPwd(BCrypt.hashpw(manager.getHashedPwd(), BCrypt.gensalt()));
            ManagerOne targetedManager = (ManagerOne) targetedEmployee;

            return ResponseEntity.status(HttpStatus.OK).body(managerOneService.saveManager(targetedManager));

        }

    }

    @GetMapping("/managerOne/{matricule}")
    public ResponseEntity<ManagerOne> getMananagerOneByName(@PathVariable String matricule) {

        ManagerOne manager = managerOneService.getManagerOneByMatricule(matricule);

        if (manager == null) {
            throw new CustomErrorException(HttpStatus.NOT_FOUND, "Manage not found");
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(managerOneService.getManagerOneByMatricule(matricule));
        }

    }

    @GetMapping("/managerTwo/{matricule}")
    public ResponseEntity<ManagerTwo> getManagerTwoByName(@PathVariable String matricule) {

        ManagerTwo manager = managerTwoService.getManagerTwoByMatricule(matricule);

        if (manager == null) {
            throw new CustomErrorException(HttpStatus.NOT_FOUND, "Manager not found");
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(managerTwoService.getManagerTwoByMatricule(matricule));
        }

    }

    @GetMapping("/drh/{matricule}")
    public ResponseEntity<Drh> getDrhByMatricule(@PathVariable String matricule) {

        Drh drh = drhService.getDrhByMatricule(matricule);

        if (drh == null) {
            throw new CustomErrorException(HttpStatus.NOT_FOUND, "Drh not found");
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(drhService.getDrhByMatricule(matricule));
        }

    }

    @DeleteMapping("/drh/{matricule}")
    public ResponseEntity<Boolean> deleteDrhByMatricule(@PathVariable String matricule) {

        Drh drh = drhService.getDrhByMatricule(matricule);

        if (drh == null) {
            throw new CustomErrorException(HttpStatus.NOT_FOUND, "Drh not found");
        } else {

            return ResponseEntity.status(HttpStatus.OK).body(true);
        }

    }

    @GetMapping("/drh")
    public ResponseEntity<List<Drh>> getListDrhs() {

        return ResponseEntity.status(HttpStatus.OK).body(drhService.getAllDrh());

    }

    @GetMapping("/managers")
    public ResponseEntity<List<Employee>> getListManagaers() {

        List<Employee> managers1 = new ArrayList<>(managerOneService.getAllManagersOne());
        List<Employee> managers2 = new ArrayList<>(managerTwoService.getAllManagersTwo());

        if (managers1.addAll(managers2)) {
            return ResponseEntity.status(HttpStatus.OK).body(managers1);
        } else {
            throw new CustomErrorException(HttpStatus.EXPECTATION_FAILED, "Internal error occured");
        }

    }

    private boolean doesEmployeeExist(String mFirstName, String mLastName, int mLevel, boolean isDrh) {

        Employee m = new Employee();

        if (mLevel == 1) {
            m = managerOneService.getManagerByFirstAndLastName(mFirstName, mLastName);

        } else if (mLevel == 2) {
            m = managerTwoService.getManagerByFirstAndLastName(mFirstName, mLastName);
        } else if (isDrh) {

            m = drhService.getDrhByFirstAndLastName(mFirstName, mLastName);
        } else {
            // CASE FOR COLLABORATEURS
            m = collaborateurService.getCollByFirstAndLastName(mFirstName, mLastName);
        }

        if (m == null) {
            return false;
        } else {
            return true;
        }
    }

}
