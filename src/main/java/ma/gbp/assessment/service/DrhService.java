package ma.gbp.assessment.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ma.gbp.assessment.model.Drh;
import ma.gbp.assessment.repository.DrhRepository;

@Service
public class DrhService {
    

    @Autowired
    private DrhRepository drhRepository;

    public List<Drh> getAllDrh() {
        return drhRepository.findAll();
    }

    public Drh getDrhById(Long id) {
        return drhRepository.findById(id).get();
    }

    public List<Drh> saveListOfDrhs(List<Drh> managers) {
        return drhRepository.saveAll(managers);
    }

    public Drh saveDrh(Drh manager) {
        return drhRepository.save(manager);
    }

    public Drh getDrhByFirstAndLastName (String firstname, String lastname) {
        return drhRepository.findByFirstNameAndLastName(firstname, lastname);
    }

    public Drh getDrhByFirstAndLastNameAndMatricule (String firstname, String lastname, String matricule) {
        return drhRepository.findByFirstNameAndLastNameAndMatricule(firstname, lastname, matricule);
    }


    public Drh getDrhByMatricule(String matricule) {
        return drhRepository.findByMatricule(matricule);
    }
}
