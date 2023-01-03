package ma.gbp.assessment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ma.gbp.assessment.model.AssessmentTemp;

@Repository
public interface AsessmentTempRepository extends JpaRepository<AssessmentTemp, Long>{
    
    AssessmentTemp findByName(String assessmentName);
    long deleteByName(String assessmentName);
}
