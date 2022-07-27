package ma.gbp.assessment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ma.gbp.assessment.model.ManagerOne;

@Repository
public interface ManagerOneRepository extends JpaRepository<ManagerOne, Long> {
    
}
