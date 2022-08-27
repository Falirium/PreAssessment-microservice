package ma.gbp.assessment.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ma.gbp.assessment.model.Collaborateur;
import ma.gbp.assessment.repository.CollaborateurRepository;

@Service
public class CollaborateurService {
    
    @Autowired
    private CollaborateurRepository collaborateurRepository;

    public Collaborateur getCollaborateur(Long id) {
        return collaborateurRepository.findById(id).get();
    }
}
