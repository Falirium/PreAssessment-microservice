package ma.gbp.assessment.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ma.gbp.assessment.model.Competence;
import ma.gbp.assessment.repository.CompetenceRepository;

@Service

public class CompetenceService {
    
    @Autowired
    private CompetenceRepository competenceRepository;

    public Competence getCompetence(Long id) {
        return competenceRepository.findById(id).get();
    }

    public List<Competence> getAllCompetence() {
        return competenceRepository.findAll();
    }

    public Competence saveCompetence (Competence newCompetence) {
        return competenceRepository.save(newCompetence);
    }

    public List<Competence> saveListOfCompetences(List<Competence> competences) {
        return competenceRepository.saveAll(competences);
    }
}
