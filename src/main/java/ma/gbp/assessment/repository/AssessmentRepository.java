package ma.gbp.assessment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ma.gbp.assessment.model.Assessment;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, String> {
    
}
