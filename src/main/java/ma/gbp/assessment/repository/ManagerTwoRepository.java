package ma.gbp.assessment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ma.gbp.assessment.model.ManagerTwo;

@Repository
public interface ManagerTwoRepository extends JpaRepository<ManagerTwo, Long> {
    
    ManagerTwo findByFirstNameAndLastName(String firstname, String lastname);
    ManagerTwo findByFirstNameAndLastNameAndMatricule(String firstname, String lastname, String matricule);
    ManagerTwo findByMatricule(String matricule);
}
