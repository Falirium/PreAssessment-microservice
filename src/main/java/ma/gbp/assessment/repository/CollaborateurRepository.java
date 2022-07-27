package ma.gbp.assessment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ma.gbp.assessment.model.Collaborateur;

@Repository
public interface CollaborateurRepository extends JpaRepository<Collaborateur, Long>{
    
}
