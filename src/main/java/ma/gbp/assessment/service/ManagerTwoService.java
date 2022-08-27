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

    // TODO: GET LISTS OF : COLLABORATEURS, MANAGER N+2, FICHE EVALUATION
}
