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

    public List<Niveau> saveListOfNiveau(List<Niveau> niveaux) {
        return niveauRepository.saveAll(niveaux);
    }

    public Niveau getNiveau(Long id) {
        return niveauRepository.findById(id).get();
    }

    public List<Niveau> getAllNiveaux() {
        return niveauRepository.findAll();
    }

    public Niveau getNiveauByIdAndByLevel(Long id, int level) {
        return niveauRepository.findByIdAndLevel(id, level);
    }

    public Niveau getNiveauByNameAndByLevel(String name, int level) {
        return niveauRepository.findByIntituleAndLevel(name, level);
    }
}