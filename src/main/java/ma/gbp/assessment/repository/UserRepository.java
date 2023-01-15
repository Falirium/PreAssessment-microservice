package ma.gbp.assessment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ma.gbp.assessment.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    User findByUsername(String matricule);
}
