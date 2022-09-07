package ma.gbp.assessment.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import ma.gbp.assessment.model.Collaborateur;
import ma.gbp.assessment.model.ManagerOne;
import ma.gbp.assessment.model.ManagerTwo;
import ma.gbp.assessment.repository.CollaborateurRepository;
import ma.gbp.assessment.repository.ManagerOneRepository;
import ma.gbp.assessment.repository.ManagerTwoRepository;

@Service
public class EmployeeService {
    

    @Autowired
    private ManagerOneRepository managerOneRepository;

    @Autowired
    private ManagerTwoRepository managerTwoRepository;

    @Autowired
    private CollaborateurRepository collaborateurRepository;


    //ManagerOne
    public ManagerOne saveManagerOne(ManagerOne managerOne) {
        return managerOneRepository.save(managerOne);
    }

    public List<ManagerOne> getManagersOne() {
        return managerOneRepository.findAll();
    }

    public ManagerOne getManagerOne(Long id) {
        return managerOneRepository.findById(id).get();
    }

    


    //ManagerTwo
    public ManagerTwo saveManagerTwo(ManagerTwo managerTwo) {
        return managerTwoRepository.save(managerTwo);
    }

    public List<ManagerTwo> getManagersTwo() {
        return managerTwoRepository.findAll();
    }

    public ManagerTwo getManagerTwo(Long id) {
        return managerTwoRepository.findById(id).get();
    }

    


    //Collaborateur
    public Collaborateur savCollaborateur(Collaborateur collaborateur) {
        return collaborateurRepository.save(collaborateur);
    }

    public List<Collaborateur> getCollaborateur() {
        return collaborateurRepository.findAll();
    }

    public Collaborateur getCollaborateur(Long id) {
        return collaborateurRepository.findById(id).get();
    }


}
