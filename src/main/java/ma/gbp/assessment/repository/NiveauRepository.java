package ma.gbp.assessment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ma.gbp.assessment.model.Niveau;


@Repository
public interface NiveauRepository extends JpaRepository<Niveau, Long> {
    
    // List<Niveau> findNiveausByCompetenceResId(Long competenceReId);
}
