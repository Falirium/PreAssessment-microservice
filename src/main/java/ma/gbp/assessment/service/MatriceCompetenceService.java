package ma.gbp.assessment.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ma.gbp.assessment.model.MatriceCompetence;
import ma.gbp.assessment.repository.MatriceCompetenceRepository;

@Service
public class MatriceCompetenceService {
    
    @Autowired
    private MatriceCompetenceRepository matriceCompetenceRepository;


    public MatriceCompetence getMatriceCompetenceById(Long id) {
        return matriceCompetenceRepository.findById(id).get();
    }

    public List<MatriceCompetence> getAllMatricesCompetences() {
        return matriceCompetenceRepository.findAll();
    }

    public MatriceCompetence saveMatriceCompetence(MatriceCompetence mc) {
        return matriceCompetenceRepository.save(mc);
    }

    public void deleteMatriceCompetenceById(Long id) {
        matriceCompetenceRepository.deleteById(id);

        return ;
    }
    
}
