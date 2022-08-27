package ma.gbp.assessment.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ma.gbp.assessment.model.FicheEvaluation;
import ma.gbp.assessment.repository.FicheEvaluationRepository;

@Service
public class FicheEvaluationService {
    
    @Autowired
    private FicheEvaluationRepository ficheEvaluationRepository;


    public List<FicheEvaluation> saveAllFichesEvaluations(List<FicheEvaluation> list) {
        return ficheEvaluationRepository.saveAll(list);
    }

    public FicheEvaluation saveFicheEvaluation(FicheEvaluation fe) {
        return ficheEvaluationRepository.save(fe);
    }

    public FicheEvaluation getFicheEvaluationById(Long id) {
        return ficheEvaluationRepository.findById(id).get();
    }

    
}
