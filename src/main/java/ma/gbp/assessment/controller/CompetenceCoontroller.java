package ma.gbp.assessment.controller;

import java.util.ArrayList;
import java.util.List;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ma.gbp.assessment.model.Competence;
import ma.gbp.assessment.model.MatriceCompetence;
import ma.gbp.assessment.service.CompetenceService;
import ma.gbp.assessment.service.MatriceCompetenceService;

@RestController
@RequestMapping(path = "/preassessment/api/v1/competence")
public class CompetenceCoontroller {
   
    @Autowired
    private CompetenceService competenceService;

    @Autowired
    private MatriceCompetenceService matriceCompetenceService;

    @GetMapping(value = "/")
    public ResponseEntity<List<Competence>> getAllCompetences() {
        return ResponseEntity.status(HttpStatus.OK).body(competenceService.getAllCompetence());
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Competence> getCompetence(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(competenceService.getCompetence(id));
    }

    @PostMapping(value="/")
    public ResponseEntity<Competence> createCompetence(@RequestBody Competence competence) {
        return ResponseEntity.status(HttpStatus.CREATED).body(competenceService.saveCompetence(competence));
    }

    @PostMapping(value = "/competences")
    public ResponseEntity<List<Competence>> createListOfCompetences(@RequestBody List<Competence> competences) {
        return ResponseEntity.status(HttpStatus.CREATED).body(competenceService.saveListOfCompetences(competences));
    }

    @PostMapping(value ="/matrice")
    public ResponseEntity<MatriceCompetence> saveMatriceCompetence(@RequestBody MatriceCompetence mc) {
        
        // STEP 1 : CRREATE A NEW INSTANCE OF MATRICE
        MatriceCompetence newMc = new MatriceCompetence(
            mc.getName(),
            mc.getCreatedAt(),
            mc.getUpdatesAt());

        // STEP 2 : SAVE THE NEW LIST OF COMPETENCES
        List<Competence> savedComp = new ArrayList<Competence>();
        for (Competence competence : mc.getCompetences()) {

            Competence comp = new Competence();

            // VERIFY IF THE COMPETENCE EXISTS BY NAME
            if (doesCompetenceExist(competence.getName())) {

                comp = competenceService.getCompetenceByName(competence.getName());

            } else {

                // SAVE THE NEW COMPETENCE
               comp = competenceService.saveCompetence(competence);

            }

            // ADD TO THE LIST
            savedComp.add(comp);
        }

        // STEP 3 : SET THE RELATIONSHIP BETWEEN THE MATRICE AND LIST OF COMPETENCES
        newMc.setCompetences(savedComp);

        // STEP 4 : PERSIST THE MATRICE
        return ResponseEntity.status(HttpStatus.OK).body(matriceCompetenceService.saveMatriceCompetence(newMc));
    }


    private boolean doesCompetenceExist(String compName) {

        if (competenceService.getCompetenceByName(compName) != null) {
            return true;
        }

        return false;
    }
    

    
}
