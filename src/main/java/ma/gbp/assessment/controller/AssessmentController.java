package ma.gbp.assessment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


import ma.gbp.assessment.model.Assessment;
import ma.gbp.assessment.service.AssessmentService;

import java.util.List;

@Controller
@RequestMapping (path = "/preassessment/api/v1/assessment")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class AssessmentController {

    @Autowired
    private AssessmentService assessmentService;


    @GetMapping("/")
    public ResponseEntity<List<Assessment>> getAssessments() {
        return ResponseEntity.status(HttpStatus.OK).body(assessmentService.getAll());
    }


    @PostMapping("/")
    public ResponseEntity<Assessment> saveAssessment(@RequestBody Assessment assessment) {
        return ResponseEntity.status(HttpStatus.OK).body(assessmentService.save(assessment));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Assessment> getAssessment(@PathVariable String id) {
        return ResponseEntity.status(HttpStatus.OK).body(assessmentService.getAssessment(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Assessment> updateAssessment(@PathVariable String id, @RequestBody Assessment updatedAssessment) {

        Assessment assessment = assessmentService.getAssessment(id);

        assessment.setListOfCategories(updatedAssessment.getListOfCategories());
        assessment.setListOfCollaborateurs(updatedAssessment.getListOfCollaborateurs());
        assessment.setListOfManagersOne(updatedAssessment.getListOfManagersOne());
        assessment.setListOfManagersTwo(updatedAssessment.getListOfManagersTwo());
        assessment.setExcelFile(updatedAssessment.getExcelFile());

        
        return ResponseEntity.status(HttpStatus.OK).body(assessmentService.save(assessment));
    }
    
}
