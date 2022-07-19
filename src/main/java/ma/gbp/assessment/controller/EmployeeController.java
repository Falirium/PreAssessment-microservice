package ma.gbp.assessment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import ma.gbp.assessment.model.ManagerOne;
import ma.gbp.assessment.model.ManagerTwo;
import ma.gbp.assessment.service.EmployeeService;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping(path = "/preassessment/api/v1/employee")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @PostMapping("/managerOne")
    public ResponseEntity<List<ManagerOne>> saveManagersOne(@RequestBody List<ManagerOne> managersOne) {
        List<ManagerOne> savedManagersOne = new ArrayList<ManagerOne>();

        for(ManagerOne manager : managersOne) {
            savedManagersOne.add(employeeService.saveManagerOne(manager));
        }

        return ResponseEntity.status(HttpStatus.OK).body(savedManagersOne) ;
    }


    @PostMapping("/managerTwo")
    public ResponseEntity<List<ManagerTwo>> saveManagersTwo(@RequestBody List<ManagerTwo> managersTwo) {
        List<ManagerTwo> savedManagersTwo = new ArrayList<ManagerTwo>();

        for(ManagerTwo manager : managersTwo) {
            savedManagersTwo.add(employeeService.saveManagerTwo(manager));
        }

        return ResponseEntity.status(HttpStatus.OK).body(savedManagersTwo) ;
    }
    
}
