package ma.gbp.assessment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ma.gbp.assessment.model.Collaborateur;

@Repository
public interface CollaborateurRepository extends JpaRepository<Collaborateur, Long>{
    
    Collaborateur findByFirstNameAndLastName(String firstname, String lastname);
    Collaborateur findByFirstNameAndLastNameAndMatricule(String firstname, String lastname, String matricule);
}
