package ma.gbp.assessment.controller;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import ma.gbp.assessment.exception.CustomErrorException;
import ma.gbp.assessment.model.CompetenceRe;
import ma.gbp.assessment.model.Emploi;
import ma.gbp.assessment.model.Niveau;
import ma.gbp.assessment.service.CompetenceReService;
import ma.gbp.assessment.service.EmploiService;
import ma.gbp.assessment.service.NiveauService;

@Controller
@RequestMapping(path = "/preassessment/api/v1/emploi")
public class EmploiController {

    @Autowired
    private EmploiService emploiService;

    @Autowired
    private NiveauService niveauService;

    @Autowired
    private CompetenceReService competenceReService;

    private static final Logger logger = LoggerFactory.getLogger(EmploiController.class);

    @GetMapping(value = "/")
    public ResponseEntity<List<Emploi>> getAllEmplois() {
        return ResponseEntity.status(HttpStatus.OK).body(emploiService.getListEmplois());
    }

    @PostMapping(value = "/add")
    public ResponseEntity<Emploi> saveEmploi(@RequestBody Emploi savedEmploi) {

        // SAVE THE LIST OF NIVEAUX
        List<Niveau> savedNiveaux = new ArrayList<Niveau>();

        for (int i = 0; i < savedEmploi.getNiveaux().size(); i++) {

            Niveau niveau = savedEmploi.getNiveaux().get(i);

            // CHECK IF NIVEAU IS ALREADY EXIST
            Niveau n = niveauService.getNiveauByNameAndByLevel(niveau.getIntitule().toLowerCase(), niveau.getLevel());

            if (n != null) {
                throw new CustomErrorException(HttpStatus.NOT_ACCEPTABLE, "L'emploi " + niveau.getIntitule()
                        + " niveau de séniorité : " + niveau.getLevel() + " est déjà enregistré");
            }

            // Create an istance of Niveau
            Niveau newNiveau = new Niveau(
                    niveau.getIntitule().toLowerCase(),
                    niveau.getFiliere(),
                    niveau.getSousFiliere(),
                    niveau.getDateMaj(),
                    niveau.getVocation(),
                    niveau.getLevel(),
                    niveau.getResponsabilites(),
                    niveau.getExigences(),
                    niveau.getMarqueurs());

            // CREATE COMPETENCE REQUIES ENTIES -> THEN ASSIGN THEM
            // ITERATE OVER LIST OF COMPETENCES REQUIS : NEW COMPETENCES REQUIS - ALREADY
            // SAVED COMPETENCES REQUIS

            List<CompetenceRe> listOfCompetencesRe = new ArrayList<CompetenceRe>();

            for (CompetenceRe cr : niveau.getCompetencesRequis()) {

                CompetenceRe competenceRe = new CompetenceRe();

                if (!doesCompetenceReExist(cr.getName(), cr.getType(), cr.getNiveauRequis())) {
                    competenceRe = competenceReService.saveCompetenceRequis(cr);
                } else {
                    competenceRe = competenceReService.getCompetenceReByName(cr.getName());
                }

                listOfCompetencesRe.add(competenceRe);

            }

            // SET CCOMPETENCE-REQUIS INTO NIVEAU
            newNiveau.setCompetencesRequis(listOfCompetencesRe);

            // ADD NIVEAU TO THE LIST OF SAVED NIVEAU
            savedNiveaux.add(newNiveau);
        }
        savedNiveaux = niveauService.saveListOfNiveau(savedNiveaux);

        // NOW SAVE THE EMPLOI ENITTY;
        Emploi newEmploi = new Emploi(savedEmploi.getIntitule());

        // SET THE RELATIONSHIP BETWEEN EMPLOI-NIVEAU
        for (Niveau sn : savedNiveaux) {
            sn.setEmploi(newEmploi);
        }

        newEmploi = emploiService.saveEmploi(newEmploi);

        return ResponseEntity.status(HttpStatus.OK).body(newEmploi);
    }

    @PutMapping(value = "/edit")
    public ResponseEntity<Emploi> updateEmploi(@RequestBody Emploi newEmploi) {

        // GET THE EMPLOI BY ID
        Emploi editedEmploi = emploiService.getEmploiById(newEmploi.getId());

        if (editedEmploi == null) {
            throw new CustomErrorException(HttpStatus.NOT_FOUND,
                    "L'emploi " + "' " + newEmploi.getIntitule() + " ' " + "n'est pas trouvé");
        }

        // STEP 1 : UPDATE LES INFORMATIONS DE BASE L'EMPLOI

        // GET LIST OF NIVEAUX OF THE ASSOCIATED EMPLOI
        List<Niveau> listNiveauxOfEditedEmploi = editedEmploi.getNiveaux();
        List<Niveau> listNiveauOfNewEmploi = newEmploi.getNiveaux();

        // STEP 2 : DELETE THE NIVEAU THAT WE DON' T WANT ANYMORE
        if (listNiveauxOfEditedEmploi.size() > listNiveauOfNewEmploi.size()) {
            int lastLevelIndex = getMaxIndex(listNiveauOfNewEmploi);

            for (int i = 0; i < listNiveauxOfEditedEmploi.size(); i++) {

                Niveau niveau = editedEmploi.getNiveaux().get(i);

                if (niveau.getLevel() == lastLevelIndex + 1) {

                    // REMOVE THE NIVEAU
                    niveauService.removeNiveauById(niveau.getId());

                    // REMOVE THE NIVEAU FROM THE LIST
                    listNiveauxOfEditedEmploi.remove(i);

                    lastLevelIndex++;

                }

            }
        }

        // STEP 3 : UPDATE LES INFORMATIONS DES NIVEAUX + SAVE ANY NEW NIVEAU DE
        // SENIOURITÉ
        for (int i = 0; i < listNiveauOfNewEmploi.size(); i++) {

            Niveau niveau = listNiveauOfNewEmploi.get(i);

            // GET THE ASSOCIATED NIVEAU
            Niveau associatedNiveau = getNiveauFromList(niveau.getLevel(), listNiveauxOfEditedEmploi);

            // NEW NIVEAU CREATED
            if (associatedNiveau == null) {
                // Create an istance of Niveau
                Niveau newNiveau = new Niveau(
                        niveau.getIntitule().toLowerCase(),
                        niveau.getFiliere(),
                        niveau.getSousFiliere(),
                        niveau.getDateMaj(),
                        niveau.getVocation(),
                        niveau.getLevel(),
                        niveau.getResponsabilites(),
                        niveau.getExigences(),
                        niveau.getMarqueurs());

                // CREATE COMPETENCE REQUIES ENTIES -> THEN ASSIGN THEM
                // ITERATE OVER LIST OF COMPETENCES REQUIS : NEW COMPETENCES REQUIS - ALREADY
                // SAVED COMPETENCES REQUIS

                List<CompetenceRe> listOfCompetencesRe = new ArrayList<CompetenceRe>();

                for (CompetenceRe cr : niveau.getCompetencesRequis()) {

                    CompetenceRe competenceRe = new CompetenceRe();

                    if (!doesCompetenceReExist(cr.getName(), cr.getType(), cr.getNiveauRequis())) {
                        competenceRe = competenceReService.saveCompetenceRequis(cr);
                    } else {
                        
                        competenceRe = competenceReService.getCompetenceReByNameAndTypeAndNiveau(cr.getName(), cr.getType(), cr.getNiveauRequis());

                    }

                    listOfCompetencesRe.add(competenceRe);

                }

                // SET CCOMPETENCE-REQUIS INTO NIVEAU
                newNiveau.setCompetencesRequis(listOfCompetencesRe);

                // SAVE NEW NIVEAU
                associatedNiveau = niveauService.saveNiveau(newNiveau);

            } else {

                // UPDATE LES INFORMATIONS DE BASE
                associatedNiveau.setFiliere(niveau.getFiliere());
                associatedNiveau.setSousFiliere(niveau.getSousFiliere());
                associatedNiveau.setDateMaj(niveau.getDateMaj());
                associatedNiveau.setVocation(niveau.getVocation());
                associatedNiveau.setResponsabilites(niveau.getResponsabilites());

                // STEP 3.1 : UPDATE EXIGENCES + MARQUEURS
                associatedNiveau.setExigences(niveau.getExigences());
                associatedNiveau.setMarqueurs(niveau.getMarqueurs());

                // STEP 3.2 : UPDATE LES COMPETENCES REQUIS
                List<CompetenceRe> listOfCompetencesRe = new ArrayList<CompetenceRe>();

                List<CompetenceRe> newNiveauCompetenceRe = niveau.getCompetencesRequis();
                List<CompetenceRe> editedNiveauCompetenceRe = associatedNiveau.getCompetencesRequis();

                logger.info(
                        "PUT API : -----" + newNiveauCompetenceRe.size() + " == " + editedNiveauCompetenceRe.size());

                for (CompetenceRe cr : newNiveauCompetenceRe) {

                    logger.info("INFO ABT NEW COMPT-RE : -----" + cr.getType() + "_" + cr.getName() + "_"
                            + cr.getNiveauRequis());

                    boolean hasBeenRemoved = false;

                    CompetenceRe competenceRe = new CompetenceRe();

                    if (!doesCompetenceReExist(cr.getName(), cr.getType(), cr.getNiveauRequis())) {
                        competenceRe = competenceReService.saveCompetenceRequis(cr);
                    } else {

                        // VERIFY IF IT IS REMOVED FROM THE ORIGINAL LIST
                        if (doesCompetenceExistInPreviousNiveau(cr.getName(), editedNiveauCompetenceRe)) {

                            // logger.info("CompetenceRe <<" + cr.getName() + ">> is FOUNDED");

                            // CASE : COMPETENCE-REQUIS STILL IN THE LIST
                            competenceRe = competenceReService.getCompetenceReByNameAndTypeAndNiveau(cr.getName(),
                                    cr.getType(), cr.getNiveauRequis());
                        } else {

                            // CASE : THE COMPETENCE-REQUIS HAS BEEN REMOVED FROM NIVEAU
                            competenceReService.removeCompetenceRequis(cr);
                            hasBeenRemoved = true;
                        }

                    }

                    logger.info("INFO ABT NIVEAU : -----" + niveau.getIntitule() + "_" + niveau.getLevel() + "_");
                    logger.info("PUT API : -----" + competenceRe.getType() + "_" + competenceRe.getName() + "_"
                            + competenceRe.getNiveauRequis());

                    if (!hasBeenRemoved) {
                        // logger.info("Check CompetenceRe : " + competenceRe);
                        listOfCompetencesRe.add(competenceRe);
                    }

                }

                // SET THE NEW LIST OF COMPETENCES-REQUIS
                associatedNiveau.setCompetencesRequis(listOfCompetencesRe);

            }

            associatedNiveau.setEmploi(editedEmploi);

            // associatedNiveau = niveauService.saveNiveau(associatedNiveau);

        }

        // STEP 3 : SAVE THE NEW UPDATES ON EMPLOI
        return ResponseEntity.status(HttpStatus.OK).body(emploiService.saveEmploi(editedEmploi));

    }

    private boolean doesCompetenceReExist(String compName, String type, String niveauRe) {
        // CompetenceRe competenceRe =
        // competenceReService.getCompetenceReByName(compName);
        CompetenceRe competenceRe = competenceReService.getCompetenceReByNameAndTypeAndNiveau(compName, type, niveauRe);

        if (competenceRe == null) {
            return false;
        } else {
            logger.info("doesCompetenceReExist method :" + competenceRe.getName());
            return true;
        }
    }

    private Niveau getNiveauFromList(int level, List<Niveau> list) {

        for (Niveau niveau : list) {
            if (level == niveau.getLevel()) {
                return niveau;
            }
        }

        return null;
    }

    private boolean doesCompetenceExistInPreviousNiveau(String compName, List<CompetenceRe> list) {

        if (list.size() == 0) {
            return false;
        }

        for (CompetenceRe cr : list) {
            if (cr.getName().equals(compName)) {
                return true;
            }
        }

        return false;
    }

    private int getMaxIndex(List<Niveau> list) {
        if (list.size() == 0) {
            return -1;
        }

        int max = list.get(0).getLevel();

        for (int i = 1; i < list.size(); i++) {
            if (list.get(i).getLevel() > max) {
                max = list.get(i).getLevel();
            }
        }

        return max;
    }
}
