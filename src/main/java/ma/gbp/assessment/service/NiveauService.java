package ma.gbp.assessment.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import ma.gbp.assessment.model.Niveau;
import ma.gbp.assessment.repository.NiveauRepository;

@Service
public class NiveauService {
    
    @Autowired
    private NiveauRepository niveauRepository;

    public Niveau saveNiveau(Niveau newNiveau) {
        return niveauRepository.save(newNiveau);
    }

    public Niveau getNiveau(Long id) {
        return niveauRepository.findById(id).get();
    }

    public List<Niveau> getAllNiveaux() {
        return niveauRepository.findAll();
    }
}
