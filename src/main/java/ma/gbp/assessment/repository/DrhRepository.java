package ma.gbp.assessment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ma.gbp.assessment.model.Drh;

@Repository
public interface DrhRepository extends JpaRepository<Drh, Long> {
    
    Drh findByFirstNameAndLastName(String firstname, String lastname);
    Drh findByFirstNameAndLastNameAndMatricule(String firstname, String lastname, String matricule);
    Drh findByMatricule(String matricule);
}
