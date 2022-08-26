package ma.gbp.assessment.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import ma.gbp.assessment.message.FicheEvaluation;
import ma.gbp.assessment.message.FullCompetenceRequis;
import ma.gbp.assessment.model.Competence;
import ma.gbp.assessment.model.CompetenceRe;
import ma.gbp.assessment.model.Niveau;
import ma.gbp.assessment.service.CompetenceReService;
import ma.gbp.assessment.service.CompetenceService;
import ma.gbp.assessment.service.NiveauService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping(path = "/preassessment/api/v1/emploi/niveau")
public class NiveauController {

    @Autowired
    private NiveauService niveauService;

    @Autowired
    private CompetenceService competenceService;

    @Autowired
    private CompetenceReService competenceReService;

    @GetMapping(value = "/")
    public ResponseEntity<List<Niveau>> getAllNiveaux() {
        return ResponseEntity.status(HttpStatus.OK).body(niveauService.getAllNiveaux());
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Niveau> getNiveau(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(niveauService.getNiveau(id));
    }

    @GetMapping(value = "/test")
    public ResponseEntity<String> getTest(@RequestParam(name = "eName") String name) {
        return ResponseEntity.status(HttpStatus.OK).body("ID is : " + name);
    }

    @PostMapping(value = "/")
    public ResponseEntity<Niveau> createNiveau(@RequestBody Niveau niveau) {

        Niveau savedNiveau = niveauService.saveNiveau(new Niveau(
                niveau.getIntitule(),
                niveau.getFiliere(),
                niveau.getSousFiliere(),
                niveau.getDateMaj(),
                niveau.getVocation(),
                niveau.getLevel(),
                niveau.getResponsabilites(),
                niveau.getExigences(),
                niveau.getMarqueurs()));

        // CREATE COMPETENCE REQUIES ENTIES -> THEN ASSIGN THEM
        List<CompetenceRe> newCompetencesReq = competenceReService.saveListOfComeptences(niveau.getCompetencesRequis());

        savedNiveau.setCompetencesRequis(newCompetencesReq);

        // SAVE COMPETENCE INTO COMPETENCE

        return ResponseEntity.status(HttpStatus.CREATED).body(niveauService.saveNiveau(savedNiveau));
    }

    @PostMapping(value = "/niveaux")
    public ResponseEntity<List<Niveau>> createListOfNiveaux(@RequestBody List<Niveau> niveaux) {

        List<Niveau> savedNiveaux = new ArrayList<Niveau>();

        for (int i = 0; i < niveaux.size(); i++) {
            Niveau savedNiveau = niveauService.saveNiveau(new Niveau(
                    niveaux.get(i).getIntitule(),
                    niveaux.get(i).getFiliere(),
                    niveaux.get(i).getSousFiliere(),
                    niveaux.get(i).getDateMaj(),
                    niveaux.get(i).getVocation(),
                    niveaux.get(i).getLevel(),
                    niveaux.get(i).getResponsabilites(),
                    niveaux.get(i).getExigences(),
                    niveaux.get(i).getMarqueurs()));

            // CREATE COMPETENCE REQUIES ENTIES -> THEN ASSIGN THEM
            List<CompetenceRe> newCompetencesReq = competenceReService
                    .saveListOfComeptences(niveaux.get(i).getCompetencesRequis());

            savedNiveau.setCompetencesRequis(newCompetencesReq);

            savedNiveaux.add(niveauService.saveNiveau(savedNiveau));
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(savedNiveaux);
    }

    // @GetMapping(value = "/fiche")
    // public ResponseEntity<FicheEvaluation> buildFicheEvaluationFor(
    //         @RequestParam(name = "eId") Long emploiId,
    //         @RequestParam(name = "level") int level,
    //         @RequestParam(name = "marqueurs") Boolean marqueurs,
    //         @RequestParam(name = "exigences") Boolean exigences,
    //         @RequestParam(name = "responsabilites") Boolean responsabilites,
    //         @RequestParam(name = "competences_dc") Boolean competences_dc,
    //         @RequestParam(name = "competences_se") Boolean competences_se,
    //         @RequestParam(name = "competences_sf") Boolean competences_sf) {

    //     FicheEvaluation fe = new FicheEvaluation();

    //     Niveau niveau = niveauService.getNiveauByIdAndByLevel(emploiId, level);

    //     // BASES INFORMATIONS
    //     fe.setIntitule(niveau.getIntitule());
    //     fe.setFiliere(niveau.getFiliere());
    //     fe.setSousFiliere(niveau.getSousFiliere());
    //     fe.setLevel(niveau.getLevel());
    //     fe.setVocation(niveau.getVocation());
    //     fe.setDateMaj(niveau.getDateMaj());

    //     // MARQUEURS
    //     if (marqueurs) {
    //         fe.setMarqueurs(niveau.getMarqueurs());
    //     } else {
    //         fe.setMarqueurs(null);
    //     }

    //     // EXIGENCES
    //     if (exigences) {
    //         fe.setExigences(niveau.getExigences());
    //     } else {
    //         fe.setExigences(null);
    //     }

    //     // RESPONSABILITES
    //     if (responsabilites) {
    //         fe.setResponsabilites(niveau.getResponsabilites());
    //     } else {
    //         fe.setResponsabilites(null);
    //     }

    //     List<CompetenceRe> niveauCompetencesReq = niveau.getCompetencesRequis();

    //     // COMPETENCES
    //     List<FullCompetenceRequis> dc = new ArrayList<FullCompetenceRequis>();
    //     List<FullCompetenceRequis> se = new ArrayList<FullCompetenceRequis>();
    //     List<FullCompetenceRequis> sf = new ArrayList<FullCompetenceRequis>();

    //     for (CompetenceRe competence : niveauCompetencesReq) {

    //         FullCompetenceRequis fullCompetenceRequis = new FullCompetenceRequis();

    //         // GET THE FULL COMPETENCE METADATA -> GET DEFINITION OF NIVEAUX
    //         Competence fullCompetence = competenceService.getCompetenceByName(competence.getName());

    //         // CASE 1 : DOMAINNES DE CONNAISSANCE
    //         if (competence.getType().equals("Domaines de connaissance") && competences_dc) {
    //             fullCompetenceRequis.setName(competence.getName());
    //             fullCompetenceRequis.setRequiredNiveau(competence.getNiveauRequis());
    //             fullCompetenceRequis.setNiveaux(fullCompetence.getNiveaux());

    //             // ADD THIS FULLCOMPETENCEREQUIS TO THE LIST
    //             dc.add(fullCompetenceRequis);
    //         }

    //         // CASE 2 : SAVOIR FAIRE
    //         if (competence.getType().equals("Savoir-faire") && competences_sf) {
    //             fullCompetenceRequis.setName(competence.getName());
    //             fullCompetenceRequis.setRequiredNiveau(competence.getNiveauRequis());
    //             fullCompetenceRequis.setNiveaux(fullCompetence.getNiveaux());

    //             // ADD THIS FULLCOMPETENCEREQUIS TO THE LIST
    //             sf.add(fullCompetenceRequis);
    //         }

    //         // CASE 3 : SAVOIR ETRE
    //         if (competence.getType().equals("Savoir-etre") && competences_se) {
    //             fullCompetenceRequis.setName(competence.getName());
    //             fullCompetenceRequis.setRequiredNiveau(competence.getNiveauRequis());
    //             fullCompetenceRequis.setNiveaux(fullCompetence.getNiveaux());

    //             // ADD THIS FULLCOMPETENCEREQUIS TO THE LIST
    //             se.add(fullCompetenceRequis);
    //         }
    //     }

    //     // ADD THE LIST TO THE RETURNED INSTANCE
    //     fe.setCompetences_dc(dc);
    //     fe.setCompetences_sf(sf);
    //     fe.setCompetences_se(se);

    //     return ResponseEntity.status(HttpStatus.OK).body(fe);
    // }

    @GetMapping(value = "/fiche")
    public ResponseEntity<Niveau> buildFicheEva(
        @RequestParam(name = "eName") String emploiName,
        @RequestParam(name = "level") int level
        ) {
            Niveau niveau = niveauService.getNiveauByNameAndByLevel(emploiName, level);
            return ResponseEntity.status(HttpStatus.OK).body(niveau);
        }
}
