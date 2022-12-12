package ma.gbp.assessment.fontEndController;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import ma.gbp.assessment.message.FicheEvaluationPreview;
import ma.gbp.assessment.message.FullCompetenceRequis;
import ma.gbp.assessment.model.Assessment;
import ma.gbp.assessment.model.Competence;
import ma.gbp.assessment.model.CompetenceRe;
import ma.gbp.assessment.model.Niveau;
import ma.gbp.assessment.service.AssessmentService;
import ma.gbp.assessment.service.CompetenceService;
import ma.gbp.assessment.service.NiveauService;

@Controller
@RequestMapping(path = "/assessment")
public class FrontAssessmentController {

    @Autowired
    private AssessmentService assessmentService;

    @Autowired
    private NiveauService niveauService;

    @Autowired
    private CompetenceService competenceService;




    @GetMapping(value = {"/list","/"} )
    public String getAllAssessment(Model model) {
         List<Assessment> listAssessments = assessmentService.getAll();

         model.addAttribute("assessments", listAssessments);

        return "list-assessments";
    }

    @GetMapping(path = "/add")
    public String addAssessment() {
        return "add-assessment";
    }

    @GetMapping(path = "/add/fiche")
    public String buildFicheEvaluationPreviewFor(
        @RequestParam(name = "eName") String emploiName,
        @RequestParam(name = "level") int level,
        @RequestParam(name = "marqueurs") Boolean marqueurs,
        @RequestParam(name = "exigences") Boolean exigences,
        @RequestParam(name = "responsabilites") Boolean responsabilites,
        @RequestParam(name = "competences_dc") Boolean competences_dc,
        @RequestParam(name = "competences_se") Boolean competences_se,
        @RequestParam(name = "competences_sf") Boolean competences_sf,
        Model model) {

    FicheEvaluationPreview fe = new FicheEvaluationPreview();

    Niveau niveau = niveauService.getNiveauByNameAndByLevel(emploiName.toLowerCase(), level);

    // // BASES INFORMATIONS
    // fe.setIntitule(niveau.getIntitule());
    // fe.setFiliere(niveau.getFiliere());
    // fe.setSousFiliere(niveau.getSousFiliere());
    // fe.setLevel(niveau.getLevel());
    // fe.setVocation(niveau.getVocation());
    // fe.setDateMaj(niveau.getDateMaj());

    // // MARQUEURS
    // if (marqueurs) {
    //     fe.setMarqueurs(niveau.getMarqueurs());
    // } else {
    //     fe.setMarqueurs(null);
    // }

    // // EXIGENCES
    // if (exigences) {
    //     fe.setExigences(niveau.getExigences());
    // } else {
    //     fe.setExigences(null);
    // }

    // // RESPONSABILITES
    // if (responsabilites) {
    //     fe.setResponsabilites(niveau.getResponsabilites());
    // } else {
    //     fe.setResponsabilites(null);
    // }

    // List<CompetenceRe> niveauCompetencesReq = niveau.getCompetencesRequis();

    // // COMPETENCES
    // List<FullCompetenceRequis> dc = new ArrayList<FullCompetenceRequis>();
    // List<FullCompetenceRequis> se = new ArrayList<FullCompetenceRequis>();
    // List<FullCompetenceRequis> sf = new ArrayList<FullCompetenceRequis>();

    // for (CompetenceRe competence : niveauCompetencesReq) {

    //     FullCompetenceRequis fullCompetenceRequis = new FullCompetenceRequis();

    //     // GET THE FULL COMPETENCE METADATA -> GET DEFINITION OF NIVEAUX
    //     Competence fullCompetence = competenceService.getCompetenceByName(competence.getName());

    //     // CASE 1 : DOMAINNES DE CONNAISSANCE
    //     if (competence.getType().equals("Domaines de connaissance") && competences_dc) {
    //         fullCompetenceRequis.setName(competence.getName());
    //         fullCompetenceRequis.setRequiredNiveau(competence.getNiveauRequis());
    //         fullCompetenceRequis.setNiveaux(fullCompetence.getNiveaux());

    //         // ADD THIS FULLCOMPETENCEREQUIS TO THE LIST
    //         dc.add(fullCompetenceRequis);
    //     }

    //     // CASE 2 : SAVOIR FAIRE
    //     if (competence.getType().equals("Savoir-faire") && competences_sf) {
    //         fullCompetenceRequis.setName(competence.getName());
    //         fullCompetenceRequis.setRequiredNiveau(competence.getNiveauRequis());
    //         fullCompetenceRequis.setNiveaux(fullCompetence.getNiveaux());

    //         // ADD THIS FULLCOMPETENCEREQUIS TO THE LIST
    //         sf.add(fullCompetenceRequis);
    //     }

    //     // CASE 3 : SAVOIR ETRE
    //     if (competence.getType().equals("Savoir-etre") && competences_se) {
    //         fullCompetenceRequis.setName(competence.getName());
    //         fullCompetenceRequis.setRequiredNiveau(competence.getNiveauRequis());
    //         fullCompetenceRequis.setNiveaux(fullCompetence.getNiveaux());

    //         // ADD THIS FULLCOMPETENCEREQUIS TO THE LIST
    //         se.add(fullCompetenceRequis);
    //     }
    // }

    // // ADD THE LIST TO THE RETURNED INSTANCE
    // fe.setCompetences_dc(dc);
    // fe.setCompetences_sf(sf);
    // fe.setCompetences_se(se);

    // // ADD THIS TO MODEL
    // model.addAttribute("ficheJson", fe);

    return "preview-fiche.html";
}



    @GetMapping(path = "/edit")
    public String editAssessment() {
        return "edit-assessment";
    }

    @GetMapping(path = "/{id}")
    public String getAssessmentResults(@PathVariable String id) {
        return "assesment-result";
    }

    @GetMapping(path = "/drh/list")
    public String getListDrh() {
        return "drh-list";
    }

    @GetMapping(path = "/drh/edit")
    public String editDrh() {
        return "drh-edit";
    }


    @GetMapping(path = "/drh/add")
    public String addDrh() {
        return "drh-add";
    }
    


   
    
}
