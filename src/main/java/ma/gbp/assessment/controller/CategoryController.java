package ma.gbp.assessment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import ma.gbp.assessment.model.Category;
import ma.gbp.assessment.service.CategoryService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.ArrayList;
import java.util.List;


@Controller
@RequestMapping(path = "/preassessment/api/v1/category")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class CategoryController {
    
    @Autowired
    private CategoryService categoryService;


    @PostMapping(value="/")
    public ResponseEntity<List<Category>> saveCategories(@RequestBody List<Category>  categories) {
        //TODO: process POST request

        List<Category> savedCategories = new ArrayList<Category>();
        // for ( Category category : categories) {
        //     savedCategories.add(categoryService.save(category));
        // }

        return ResponseEntity.status(HttpStatus.OK).body(categoryService.saveListOfCategory(categories));
        
    }

    @GetMapping(value = "/") 
    public ResponseEntity<List<Category>> getCategories() {
        return  ResponseEntity.status(HttpStatus.OK).body(categoryService.getAllCategories()) ;
    }

    @GetMapping(value = "/{name}")
    public ResponseEntity<Category> getCategory (@PathVariable String name) {
        return ResponseEntity.status(HttpStatus.OK).body(categoryService.getCategoryByName(name));
    }


    
}
