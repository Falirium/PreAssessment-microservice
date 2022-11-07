package ma.gbp.assessment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ma.gbp.assessment.model.Emploi;

@Repository
public interface EmploiRepository  extends JpaRepository<Emploi, Long>{
    
    Emploi findByIntitule(String emploiName);
}
