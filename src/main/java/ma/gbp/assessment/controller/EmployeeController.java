package ma.gbp.assessment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import ma.gbp.assessment.exception.CustomErrorException;
import ma.gbp.assessment.model.Collaborateur;
import ma.gbp.assessment.model.Drh;
import ma.gbp.assessment.model.Employee;
import ma.gbp.assessment.model.ManagerOne;
import ma.gbp.assessment.model.ManagerTwo;
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
    private DrhService drhService;

    @PostMapping("/managerOne")
    public ResponseEntity<List<ManagerOne>> saveManagersOne(@RequestBody List<ManagerOne> managersOne) {
        List<ManagerOne> savedManagersOne = new ArrayList<ManagerOne>();

        for (ManagerOne manager : managersOne) {
            savedManagersOne.add(employeeService.saveManagerOne(manager));
        }

        return ResponseEntity.status(HttpStatus.OK).body(savedManagersOne);
    }

    @PostMapping("/managerTwo")
    public ResponseEntity<List<ManagerTwo>> saveManagersTwo(@RequestBody List<ManagerTwo> managersTwo) {
        List<ManagerTwo> savedManagersTwo = new ArrayList<ManagerTwo>();

        for (ManagerTwo manager : managersTwo) {
            savedManagersTwo.add(employeeService.saveManagerTwo(manager));
        }

        return ResponseEntity.status(HttpStatus.OK).body(savedManagersTwo);
    }

    @PostMapping("/collaborateur")
    public ResponseEntity<List<Collaborateur>> saveCollaborateur(@RequestBody List<Collaborateur> collaborateurs) {
        List<Collaborateur> savedCollaborateurs = new ArrayList<Collaborateur>();

        for (Collaborateur manager : collaborateurs) {
            savedCollaborateurs.add(employeeService.savCollaborateur(manager));
        }

        return ResponseEntity.status(HttpStatus.OK).body(savedCollaborateurs);
    }

    @PostMapping("/drh")
    public ResponseEntity<Drh> saveDrh(@RequestBody Drh drh) {
        return ResponseEntity.status(HttpStatus.OK).body(drhService.saveDrh(drh));
    }

    @GetMapping("/managerOne/{matricule}")
    public ResponseEntity<ManagerOne> getMananagerOneByName(@PathVariable String matricule) {

        ManagerOne manager = managerOneService.getManagerOneByMatricule(matricule);

        if (manager == null) {
            throw new CustomErrorException(HttpStatus.NOT_FOUND,"Manage not found");
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

}
