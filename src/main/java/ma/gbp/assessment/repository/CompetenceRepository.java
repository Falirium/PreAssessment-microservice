package ma.gbp.assessment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ma.gbp.assessment.model.Competence;

@Repository
public interface CompetenceRepository extends JpaRepository<Competence, Long>{
    
    public Competence findByName(String name);
    
}
