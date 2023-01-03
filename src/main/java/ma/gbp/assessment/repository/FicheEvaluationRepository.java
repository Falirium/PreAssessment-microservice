package ma.gbp.assessment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ma.gbp.assessment.model.FicheEvaluation;

@Repository
public interface FicheEvaluationRepository  extends JpaRepository<FicheEvaluation, Long>{
    
}
