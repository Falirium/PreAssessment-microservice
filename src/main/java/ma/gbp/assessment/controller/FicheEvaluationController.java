package ma.gbp.assessment.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ma.gbp.assessment.model.Assessment;
import ma.gbp.assessment.model.Collaborateur;
import ma.gbp.assessment.model.FicheEvaluation;
import ma.gbp.assessment.model.ManagerOne;
import ma.gbp.assessment.model.ManagerTwo;
import ma.gbp.assessment.model.Niveau;
import ma.gbp.assessment.request.FicheEvaluationReqBody;
import ma.gbp.assessment.service.AssessmentService;
import ma.gbp.assessment.service.CollaborateurService;
import ma.gbp.assessment.service.FicheEvaluationService;
import ma.gbp.assessment.service.ManagerOneService;
import ma.gbp.assessment.service.ManagerTwoService;
import ma.gbp.assessment.service.NiveauService;

@RestController
@RequestMapping(path = "/preassessment/api/v1/ficheEvaluation")
public class FicheEvaluationController {

    @Autowired
    private FicheEvaluationService ficheEvaluationService;

    @Autowired
    private AssessmentService assessmentService;

    @Autowired
    private ManagerOneService managerOneService;

    @Autowired
    private ManagerTwoService managerTwoService;

    @Autowired
    private NiveauService niveauService;

    @Autowired
    private CollaborateurService collaborateurSevice;
    

    // FETCH LIST OF FICHE EVALUATION BASED ON : MANAGERS IDS, ASSESSMENT ID, EMPLOI ID
    @GetMapping("/")
    public ResponseEntity<List<FicheEvaluation>> getListOfFiches( Map<String,String> allParams) {
        List<FicheEvaluation> listOfFiches = new ArrayList<FicheEvaluation>();
        if( ! allParams.get("manager1Id").equals(null) ) {
            // MEANS WE HAVE A MANAGERONE ID
            Long manager1 = Long.parseLong(allParams.get("manager1Id"));

            // GET MANAGERONE ENTITY
            ManagerOne managerOne = managerOneService.getManagerById(manager1);

            listOfFiches = managerOne.getFichesEvaluations();

        } else if( ! allParams.get("manager2Id").equals(null) ) {
            // MEANS WE HAVE A MANAGERTWO ID
            Long manager2 = Long.parseLong(allParams.get("manager2Id"));

            // GET MANAGERTWO ENTITY
            ManagerTwo managerTwo = managerTwoService.getManagerById(manager2);

            listOfFiches = managerTwo.getFichesEvaluations();

        } else if( ! allParams.get("assessmentId").equals(null) ) {
            // MEANS WE HAVE A ASSESSMENT ID
            String assessmentId = allParams.get("assessmentId");

            // GET ASSESSMENT ENTITY
            Assessment assessment = assessmentService.getAssessment(assessmentId);

            listOfFiches = assessment.getFichesEvaluations();

        } else if( ! allParams.get("emploiId").equals(null) ) {
            // MEANS WE HAVE A EMPLOI ID
            Long emploiId = Long.parseLong(allParams.get("emploiId"));

            // GET NIVEAU ENTITY
            Niveau emploi = niveauService.getNiveau(emploiId);

            listOfFiches = emploi.getAssociatedFichesEvaluations();
    
        }

        return ResponseEntity.status(HttpStatus.OK).body(listOfFiches);
    }

    @PostMapping("/")
    public ResponseEntity<List<FicheEvaluation>> saveListOfFiches(@RequestBody List<FicheEvaluationReqBody> fiches) {
        List<FicheEvaluation> savedFiches = new ArrayList<FicheEvaluation>();
        
        for (int i = 0; i < fiches.size(); i++) {
            FicheEvaluation savedSingleFiche = ficheEvaluationService.saveFicheEvaluation(new FicheEvaluation
                (
                    fiches.get(i).getScore(),
                    fiches.get(i).getSousPoints(),
                    fiches.get(i).getSurPoints(),
                    fiches.get(i).getCreatedAt(),
                    managerOneService.getManagerById(fiches.get(i).getEvaluateurOne()),
                    managerTwoService.getManagerById(fiches.get(i).getEvaluateurTwo()),
                    collaborateurSevice.getCollaborateur(fiches.get(i).getCollaborateur()),
                    niveauService.getNiveau(fiches.get(i).getEmploi()),
                    assessmentService.getAssessment(fiches.get(i).getAssociatedAssessment())
                )
            );

            // SET RELATIONSHIP ENTITIES

            savedFiches.add(savedSingleFiche);
        }


        return ResponseEntity.status(HttpStatus.CREATED).body(savedFiches);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FicheEvaluation> updateFiche(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }
    
}
