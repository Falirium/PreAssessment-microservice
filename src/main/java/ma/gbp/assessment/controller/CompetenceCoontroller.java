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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ma.gbp.assessment.exception.CustomErrorException;
import ma.gbp.assessment.model.Competence;
import ma.gbp.assessment.model.Level;
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

    @PostMapping(value = "/")
    public ResponseEntity<Competence> createCompetence(@RequestBody Competence competence) {
        return ResponseEntity.status(HttpStatus.CREATED).body(competenceService.saveCompetence(competence));
    }

    @PostMapping(value = "/competences")
    public ResponseEntity<List<Competence>> createListOfCompetences(@RequestBody List<Competence> competences) {
        return ResponseEntity.status(HttpStatus.CREATED).body(competenceService.saveListOfCompetences(competences));
    }

    @PostMapping(value = "/matrice")
    public ResponseEntity<MatriceCompetence> saveMatriceCompetence(@RequestBody MatriceCompetence mc) {

        // CHECK IF THE NAME IS ALREADY EXISTS
        MatriceCompetence newMc = matriceCompetenceService.getMatriceCompetenceByName(mc.getName());
        if (newMc != null) {
            throw new CustomErrorException(HttpStatus.FOUND, "Cette matrice de compétence existe déja");
        }
        // STEP 1 : CRREATE A NEW INSTANCE OF MATRICE
        newMc = new MatriceCompetence(
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

    @PutMapping(value = "/matrice")
    public ResponseEntity<MatriceCompetence> updateMatriceCompetence(@RequestBody MatriceCompetence mc) {

        // STEP 1 : GET THE TARGET MATRICE COMPETENCE
        MatriceCompetence newMc = matriceCompetenceService.getMatriceCompetenceById(mc.getId());
        if (newMc == null) {
            throw new CustomErrorException(HttpStatus.OK, "Matrice Competence is not found");
        }

        // STEP 2 : CHECK FOR NEW COMPETENCE OR CHANGED COMPETENCES
        // COMPARE THE TWO LISTS : RETURNS TWO LISTS : NEW COMPETENCES + DELETE
        // COMPETENCES
        List<Competence> associatedListOfCompetence = new ArrayList<Competence>();

        for (Competence competence : mc.getCompetences()) {

            Competence comp = new Competence();

            // VERIFY IF THE COMPETENCE EXISTS BY NAME
            if (doesCompetenceExist(competence.getName())) {

                comp = competenceService.getCompetenceByName(competence.getName());

                // UPDATE THE COMPETENCE
                for (int i = 0; i < comp.getNiveaux().size(); i++) {
                    Level level = comp.getNiveaux().get(i);
                    switch (level.getLevel()) {
                        case "Elémentaire":
                            level.setDefinition(getLevelByName("Elémentaire", competence.getNiveaux()).getDefinition());
                            break;
                        case "Maitrise":
                            level.setDefinition(getLevelByName("Maitrise", competence.getNiveaux()).getDefinition());

                            break;
                        case "Avancé":
                            level.setDefinition(getLevelByName("Avancé", competence.getNiveaux()).getDefinition());

                            break;
                        case "Expert":
                            level.setDefinition(getLevelByName("Expert", competence.getNiveaux()).getDefinition());

                            break;
                    }
                }

                // SAVE THE NEW MODIFICATIONS OF COMPETENCE
                comp = competenceService.saveCompetence(comp);

            } else {

                // SAVE THE NEW COMPETENCE
                comp = competenceService.saveCompetence(competence);

            }

            // ADD TO THE LIST
            associatedListOfCompetence.add(comp);
        }

        // STEP 3 : UPDATE THE PROPERTIES
        newMc.setName(mc.getName());
        newMc.setCreatedAt(mc.getCreatedAt());
        newMc.setUpdatesAt(mc.getUpdatesAt());
        newMc.setCompetences(associatedListOfCompetence);

        // STEP 4 : SAVE THE NEW ENTITY
        return ResponseEntity.status(HttpStatus.OK).body(matriceCompetenceService.saveMatriceCompetence(newMc));
    }

    @GetMapping(value = "/matrice/list")
    public ResponseEntity<List<MatriceCompetence>> getAllMatricesCompetences() {
        return ResponseEntity.status(HttpStatus.OK).body(matriceCompetenceService.getAllMatricesCompetences());
    }

    private boolean doesCompetenceExist(String compName) {

        if (competenceService.getCompetenceByName(compName) != null) {
            return true;
        }

        return false;
    }

    private Level getLevelByName(String str, List<Level> list) {
        for (Level level : list) {
            System.out.println(level.getLevel() + " " + level.getDefinition());
            if (str.equals(level.getLevel())) {
                return level;
            }
        }
        return null;
    }
}
