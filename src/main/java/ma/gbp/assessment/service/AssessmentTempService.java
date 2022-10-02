package ma.gbp.assessment.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ma.gbp.assessment.model.AssessmentTemp;
import ma.gbp.assessment.repository.AsessmentTempRepository;

@Service
public class AssessmentTempService {
    
    @Autowired 
    AsessmentTempRepository asessmentTempRepository;
    
    public AssessmentTemp getSavedAssessmentById(Long id) {
        return asessmentTempRepository.findById(id).get();
    }

    public List<AssessmentTemp> getAllSavedAssessments() {
        return asessmentTempRepository.findAll();
    }

    public AssessmentTemp getSavedAssessmentByName(String name) {
        return asessmentTempRepository.findByName(name);
    }

    public AssessmentTemp saveAssessmentTemp(AssessmentTemp at) {
        return asessmentTempRepository.save(at);
    }
}
