package ma.gbp.assessment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ma.gbp.assessment.model.CompetenceRe;

@Repository
public interface CompetenceReRepository extends JpaRepository<CompetenceRe, Long>{

    // List<CompetenceRe> findCompetenceResByNiveausId(Long niveauId);
    
}
