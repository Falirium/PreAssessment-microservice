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

    // TODO: GET LISTS OF : COLLABORATEURS, MANAGER N+2, FICHE EVALUATION
}
