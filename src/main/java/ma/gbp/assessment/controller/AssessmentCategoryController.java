package ma.gbp.assessment.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ma.gbp.assessment.model.AssessmentCategory;
import ma.gbp.assessment.model.Category;
import ma.gbp.assessment.request.CategoriesReqBody;
import ma.gbp.assessment.service.AssessmentCategoryService;
import ma.gbp.assessment.service.CategoryService;

@RestController
@RequestMapping(path = "/preassessment/api/v1/assessment/category")
public class AssessmentCategoryController {
    
    @Autowired
    private AssessmentCategoryService assessmentCategoryService;

    @Autowired
    private CategoryService categoryService;


    @GetMapping(path = "/")
    public ResponseEntity<List<AssessmentCategory>> getAllCategories() {
        return ResponseEntity.status(HttpStatus.OK).body(assessmentCategoryService.getAllCategory());
    }

    @PostMapping(path = "/")
    public ResponseEntity<List<AssessmentCategory>> saveListOfCategories(@RequestBody List<CategoriesReqBody> categories ) {

        List<AssessmentCategory> savedAssessmentCategories = new ArrayList<AssessmentCategory>();

        for (int i = 0; i < categories.size(); i++) {
            // FIND THE ASSOCIATED CATEGORES
            Category associatedCategory = categoryService.getCategoryByName(categories.get(i).getName());

            // SAVE THE ASSESSMENT-CATEGORY
            AssessmentCategory savedAssessment = assessmentCategoryService.saveCategory(new AssessmentCategory(categories.get(i).getCriterias()));

            savedAssessmentCategories.add(savedAssessment);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(savedAssessmentCategories);
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<AssessmentCategory> getCategory(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(assessmentCategoryService.getCategory(id));
    }

}
