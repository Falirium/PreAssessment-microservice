package ma.gbp.assessment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ma.gbp.assessment.model.MatriceCompetence;

@Repository
public interface MatriceCompetenceRepository extends JpaRepository<MatriceCompetence, Long> {
    
}
