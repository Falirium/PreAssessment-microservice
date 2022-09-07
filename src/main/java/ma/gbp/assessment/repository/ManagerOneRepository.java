package ma.gbp.assessment.repository;

import org.apache.catalina.Manager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ma.gbp.assessment.model.ManagerOne;

@Repository
public interface ManagerOneRepository extends JpaRepository<ManagerOne, Long> {
    
    ManagerOne findByFirstNameAndLastName(String firstname, String lastname);
    ManagerOne findByFirstNameAndLastNameAndMatricule(String firstname, String lastname, String matricule);
    ManagerOne findByMatricule(String matricule);
}
