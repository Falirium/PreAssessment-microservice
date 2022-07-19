package ma.gbp.assessment.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ma.gbp.assessment.model.Assessment;

public interface AssessmentRepository extends JpaRepository<Assessment, String> {
    
}
