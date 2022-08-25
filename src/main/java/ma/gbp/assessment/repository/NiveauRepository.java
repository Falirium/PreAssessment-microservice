package ma.gbp.assessment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import ma.gbp.assessment.model.Niveau;


@Repository
public interface NiveauRepository extends JpaRepository<Niveau, Long> {
    
    // List<Niveau> findNiveausByCompetenceResId(Long competenceReId);

    Niveau findByIdAndLevel(Long id, int level);
}
