package ma.gbp.assessment.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ma.gbp.assessment.model.Category;
import ma.gbp.assessment.repository.CategoryRepository;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public Category save(Category category) {
        return categoryRepository.save(category);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    
    public Category getCategory(Long id) {
        return categoryRepository.findById(id).get();
    }

    public List<Category> saveListOfCategory(List<Category> categories) {
        return categoryRepository.saveAll(categories);
    }

    public Category getCategoryByName(String name) {
        return categoryRepository.findByName(name);
    }
}
