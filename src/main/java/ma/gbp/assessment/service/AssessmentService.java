package ma.gbp.assessment.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import ma.gbp.assessment.model.Assessment;
import ma.gbp.assessment.repository.AssessmentRepository;

public class AssessmentService {

    @Autowired
    private AssessmentRepository assessmentRepository;

    public List<Assessment> getAll() {
        return assessmentRepository.findAll();
    }

    public Assessment save(Assessment assessment) {
        return assessmentRepository.save(assessment);
    }
    
}
