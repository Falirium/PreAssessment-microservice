package ma.gbp.assessment.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ma.gbp.assessment.model.ManagerOne;
import ma.gbp.assessment.repository.ManagerOneRepository;

@Service
public class ManagerOneService {
    
    @Autowired
    private ManagerOneRepository managerOneRepository;

    public List<ManagerOne> getAllManagersOne() {
        return managerOneRepository.findAll();
    }

    public ManagerOne getManagerById(Long id) {
        return managerOneRepository.findById(id).get();
    }

    public List<ManagerOne> saveListOfManagers(List<ManagerOne> managers) {
        return managerOneRepository.saveAll(managers);
    }

    public ManagerOne saveManager(ManagerOne manager) {
        return managerOneRepository.save(manager);
    }

    public ManagerOne getManagerByFirstAndLastName (String firstname, String lastname) {
        return managerOneRepository.findByFirstNameAndLastName(firstname, lastname);
    }

    public ManagerOne getManagerByFirstAndLastNameAndMatricule (String firstname, String lastname, String matricule) {
        return managerOneRepository.findByFirstNameAndLastNameAndMatricule(firstname, lastname, matricule);
    }


    public ManagerOne getManagerOneByMatricule(String matricule) {
        return managerOneRepository.findByMatricule(matricule);
    }
    

    // TODO: GET LISTS OF : COLLABORATEURS, MANAGER N+2, FICHE EVALUATION
}
