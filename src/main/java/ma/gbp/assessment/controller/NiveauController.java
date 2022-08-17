package ma.gbp.assessment.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;


import ma.gbp.assessment.model.Niveau;
import ma.gbp.assessment.service.CompetenceReService;
import ma.gbp.assessment.service.NiveauService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping(path = "/preassessment/api/v1/emploi/niveau")
public class NiveauController {

    @Autowired
    private NiveauService niveauService;

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

    @PostMapping(value="/")
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

        savedNiveau.setListOfCompetenceRequis(niveau.getListOfCompetenceRequis());

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

            savedNiveau.setListOfCompetenceRequis(niveaux.get(i).getListOfCompetenceRequis());

            savedNiveaux.add(niveauService.saveNiveau(savedNiveau));
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(savedNiveaux);
    }
    
}
