package ma.gbp.assessment.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ma.gbp.assessment.model.ManagerTwo;
import ma.gbp.assessment.repository.ManagerTwoRepository;

@Service
public class ManagerTwoService {

    @Autowired
    private ManagerTwoRepository managerTwoRepository;

    public List<ManagerTwo> getAllManagersOne() {
        return managerTwoRepository.findAll();
    }

    public ManagerTwo getManagerById(Long id) {
        return managerTwoRepository.findById(id).get();
    }

    public List<ManagerTwo> saveListOfManagers(List<ManagerTwo> managers) {
        return managerTwoRepository.saveAll(managers);
    }

    public ManagerTwo saveManager(ManagerTwo manager) {
        return managerTwoRepository.save(manager);
    }

    public ManagerTwo getManagerByFirstAndLastName (String firstname, String lastname) {
        return managerTwoRepository.findByFirstNameAndLastName(firstname, lastname);
    }

    public ManagerTwo getManagerByFirstAndLastNameAndMatricule (String firstname, String lastname, String matricule) {
        return managerTwoRepository.findByFirstNameAndLastNameAndMatricule(firstname, lastname,matricule);
    }
    // TODO: GET LISTS OF : COLLABORATEURS, MANAGER N+2, FICHE EVALUATION
}
