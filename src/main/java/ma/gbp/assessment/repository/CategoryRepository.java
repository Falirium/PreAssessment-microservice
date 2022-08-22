package ma.gbp.assessment.repository;

import org.springframework.stereotype.Repository;

import ma.gbp.assessment.model.Category;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>{
    
    List<Category> findAll();
    Category findByName(String name);
}
