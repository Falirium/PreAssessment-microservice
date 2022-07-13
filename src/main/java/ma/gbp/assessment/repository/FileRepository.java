package ma.gbp.assessment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ma.gbp.assessment.model.FileDB;

@Repository
public interface FileRepository extends JpaRepository<FileDB, String>{
}
