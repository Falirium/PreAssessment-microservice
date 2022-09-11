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

import ma.gbp.assessment.exception.CustomErrorException;
import ma.gbp.assessment.message.FicheEvaluationPreview;
import ma.gbp.assessment.message.FullCompetenceRequis;
import ma.gbp.assessment.model.Assessment;
import ma.gbp.assessment.model.Collaborateur;
import ma.gbp.assessment.model.Competence;
import ma.gbp.assessment.model.CompetenceRe;
import ma.gbp.assessment.model.Employee;
import ma.gbp.assessment.model.FicheEvaluation;
import ma.gbp.assessment.model.ManagerOne;
import ma.gbp.assessment.model.ManagerTwo;
import ma.gbp.assessment.model.Niveau;
import ma.gbp.assessment.request.FicheEvaluationReqBody;
import ma.gbp.assessment.service.AssessmentService;
import ma.gbp.assessment.service.CollaborateurService;
import ma.gbp.assessment.service.CompetenceService;
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

    @Autowired
    private CompetenceService competenceService;
    

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

    @GetMapping(path = "/preview")
    public ResponseEntity<FicheEvaluationPreview> buildFicheEvaluationPreviewFor(
        @RequestParam(name = "eName") String emploiName,
        @RequestParam(name = "level") int level,
        @RequestParam(name = "marqueurs") Boolean marqueurs,
        @RequestParam(name = "exigences") Boolean exigences,
        @RequestParam(name = "responsabilites") Boolean responsabilites,
        @RequestParam(name = "competences_dc") Boolean competences_dc,
        @RequestParam(name = "competences_se") Boolean competences_se,
        @RequestParam(name = "competences_sf") Boolean competences_sf) {

    FicheEvaluationPreview fe = new FicheEvaluationPreview();

    Niveau niveau = niveauService.getNiveauByNameAndByLevel(emploiName.toLowerCase(), level);

    // BASES INFORMATIONS
    fe.setIntitule(niveau.getIntitule());
    fe.setFiliere(niveau.getFiliere());
    fe.setSousFiliere(niveau.getSousFiliere());
    fe.setLevel(niveau.getLevel());
    fe.setVocation(niveau.getVocation());
    fe.setDateMaj(niveau.getDateMaj());

    // MARQUEURS
    if (marqueurs) {
        fe.setMarqueurs(niveau.getMarqueurs());
    } else {
        fe.setMarqueurs(null);
    }

    // EXIGENCES
    if (exigences) {
        fe.setExigences(niveau.getExigences());
    } else {
        fe.setExigences(null);
    }

    // RESPONSABILITES
    if (responsabilites) {
        fe.setResponsabilites(niveau.getResponsabilites());
    } else {
        fe.setResponsabilites(null);
    }

    List<CompetenceRe> niveauCompetencesReq = niveau.getCompetencesRequis();

    // COMPETENCES
    List<FullCompetenceRequis> dc = new ArrayList<FullCompetenceRequis>();
    List<FullCompetenceRequis> se = new ArrayList<FullCompetenceRequis>();
    List<FullCompetenceRequis> sf = new ArrayList<FullCompetenceRequis>();

    for (CompetenceRe competence : niveauCompetencesReq) {

        FullCompetenceRequis fullCompetenceRequis = new FullCompetenceRequis();

        // GET THE FULL COMPETENCE METADATA -> GET DEFINITION OF NIVEAUX
        Competence fullCompetence = competenceService.getCompetenceByName(competence.getName());

        // CASE 1 : DOMAINNES DE CONNAISSANCE
        if (competence.getType().equals("Domaines de connaissance") && competences_dc) {
            fullCompetenceRequis.setName(competence.getName());
            fullCompetenceRequis.setRequiredNiveau(competence.getNiveauRequis());
            fullCompetenceRequis.setNiveaux(fullCompetence.getNiveaux());

            // ADD THIS FULLCOMPETENCEREQUIS TO THE LIST
            dc.add(fullCompetenceRequis);
        }

        // CASE 2 : SAVOIR FAIRE
        if (competence.getType().equals("Savoir-faire") && competences_sf) {
            fullCompetenceRequis.setName(competence.getName());
            fullCompetenceRequis.setRequiredNiveau(competence.getNiveauRequis());
            fullCompetenceRequis.setNiveaux(fullCompetence.getNiveaux());

            // ADD THIS FULLCOMPETENCEREQUIS TO THE LIST
            sf.add(fullCompetenceRequis);
        }

        // CASE 3 : SAVOIR ETRE
        if (competence.getType().equals("Savoir-etre") && competences_se) {
            fullCompetenceRequis.setName(competence.getName());
            fullCompetenceRequis.setRequiredNiveau(competence.getNiveauRequis());
            fullCompetenceRequis.setNiveaux(fullCompetence.getNiveaux());

            // ADD THIS FULLCOMPETENCEREQUIS TO THE LIST
            se.add(fullCompetenceRequis);
        }
    }

    // ADD THE LIST TO THE RETURNED INSTANCE
    fe.setCompetences_dc(dc);
    fe.setCompetences_sf(sf);
    fe.setCompetences_se(se);



    return ResponseEntity.status(HttpStatus.OK).body(fe);
}
    
    @GetMapping(path ="/{matricule}")
    public ResponseEntity<List<FicheEvaluation>> getFichesByManager(@PathVariable String matricule) {

        List<FicheEvaluation> fichesEvaluations = new ArrayList<FicheEvaluation>();
        ManagerOne manager1 = managerOneService.getManagerOneByMatricule(matricule);
        ManagerTwo manager2 = managerTwoService.getManagerTwoByMatricule(matricule);
        // GET THE MANAGER  = 
        if (manager1 == null && manager2 == null) {
            throw new CustomErrorException(HttpStatus.NOT_FOUND, "Manager not found");
        } else if (manager1 != null) {
            // TODO: Better to use Streams and filters
            fichesEvaluations = manager1.getFichesEvaluations();

        } else if (manager2 != null) {

            fichesEvaluations = manager2.getFichesEvaluations();
        }

        return ResponseEntity.status(HttpStatus.OK).body(fichesEvaluations);
    }

    @PutMapping(path = "/update/{id}")
    public ResponseEntity<FicheEvaluation> updateFicheEvaluation(@PathVariable Long id, @RequestBody FicheEvaluation updatedFiche) {
        FicheEvaluation fe = ficheEvaluationService.getFicheEvaluationById(id);
        
        fe.setScore(updatedFiche.getScore());
        fe.setSousPoints(updatedFiche.getSousPoints());
        fe.setSurPoints(updatedFiche.getSurPoints());
        fe.setStatus(updatedFiche.getStatus());

        return ResponseEntity.status(HttpStatus.CREATED).body(ficheEvaluationService.saveFicheEvaluation(fe));


    }
}
