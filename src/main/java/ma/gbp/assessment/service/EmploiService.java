package ma.gbp.assessment.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ma.gbp.assessment.model.Emploi;
import ma.gbp.assessment.repository.EmploiRepository;

@Service
public class EmploiService {
    
    @Autowired
    private EmploiRepository emploiRepository;

    public Emploi saveEmploi(Emploi e) {
        return emploiRepository.save(e);
    }

    public List<Emploi> getListEmplois() {
        return emploiRepository.findAll();
    }

    public Emploi getEmploiById(Long id) {
        return emploiRepository.findById(id).get();
    }

    public Emploi getEmploiByIntitule(String name) {
        return emploiRepository.findByIntitule(name);
    }


}
