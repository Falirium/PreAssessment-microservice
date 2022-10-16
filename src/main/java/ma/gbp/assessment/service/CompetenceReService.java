package ma.gbp.assessment.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ma.gbp.assessment.model.CompetenceRe;
import ma.gbp.assessment.repository.CompetenceReRepository;

@Service
public class CompetenceReService {

    @Autowired
    private CompetenceReRepository competenceReRepository;


    public CompetenceRe getCompetenceRequis(Long id) {
        return competenceReRepository.findById(id).get();
    }

    public List<CompetenceRe> getAllCompetenceRequis() {
        return competenceReRepository.findAll();
    }
    
    public CompetenceRe saveCompetenceRequis(CompetenceRe newCompetence) {
        return competenceReRepository.save(newCompetence);
    }

    public List<CompetenceRe> saveListOfComeptences(List<CompetenceRe> competences) {
        return competenceReRepository.saveAll(competences);
    }
    
    public CompetenceRe getCompetenceReByName(String compName) {
        return competenceReRepository.findByName(compName);
    }
}
