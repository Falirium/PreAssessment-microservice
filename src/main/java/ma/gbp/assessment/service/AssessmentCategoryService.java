package ma.gbp.assessment.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import ma.gbp.assessment.model.AssessmentCategory;
import ma.gbp.assessment.repository.AssessmentCategoryRepository;

@Service
public class AssessmentCategoryService {
    
    @Autowired
    private AssessmentCategoryRepository assessmentCategoryRepository;


    public AssessmentCategory saveCategory(AssessmentCategory category) {
        return assessmentCategoryRepository.save(category);
    }

    public List<AssessmentCategory> saveListOfCategories(List<AssessmentCategory> categories) {
        return assessmentCategoryRepository.saveAll(categories);
    }

    public AssessmentCategory getCategory(Long id) {
        return assessmentCategoryRepository.findById(id).get();
    }

    public List<AssessmentCategory> getAllCategory() {
        return assessmentCategoryRepository.findAll();
    }
}
