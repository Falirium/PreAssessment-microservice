package ma.gbp.assessment.controller;

import java.util.List;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ma.gbp.assessment.model.Competence;
import ma.gbp.assessment.service.CompetenceService;

@RestController
@RequestMapping(path = "/preassessment/api/v1/competence")
public class CompetenceCoontroller {
   
    @Autowired
    private CompetenceService competenceService;

    @GetMapping(value = "/competences")
    public ResponseEntity<List<Competence>> getAllCompetences() {
        return ResponseEntity.status(HttpStatus.OK).body(competenceService.getAllCompetence());
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Competence> getCompetence(Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(competenceService.getCompetence(id));
    }

    @PostMapping(value="/")
    public ResponseEntity<Competence> createCompetence( @RequestBody Competence competence) {
        return ResponseEntity.status(HttpStatus.CREATED).body(competenceService.saveCompetence(competence));
    }

    @PostMapping(value = "/competences")
    public ResponseEntity<List<Competence>> createListOfCompetences(@RequestBody List<Competence> competences) {
        return ResponseEntity.status(HttpStatus.CREATED).body(competenceService.saveListOfCompetences(competences));
    }

    
}
