package ma.gbp.assessment.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ma.gbp.assessment.model.Collaborateur;

public interface CollaborateurRepository extends JpaRepository<Collaborateur, Long>{
    
}
