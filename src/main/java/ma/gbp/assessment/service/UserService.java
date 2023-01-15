package ma.gbp.assessment.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ma.gbp.assessment.model.Drh;
import ma.gbp.assessment.model.Employee;
import ma.gbp.assessment.model.ManagerOne;
import ma.gbp.assessment.model.ManagerTwo;
import ma.gbp.assessment.model.User;
import ma.gbp.assessment.repository.UserRepository;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User saveUserForEmployee(Employee emp, List<String> assignedRoles) {
        User user  = new User(emp.getMatricule(), emp.getHashedPwd());

        user.setAutorizationRoles(assignedRoles);

        return userRepository.save(user);
    }

    public boolean existsByUsername(String matricule) {
        User user = getUserByUsername(matricule);

        if (user != null) {
            return true;
        } else {
            return false;
        }
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public boolean createUserAccFor(Employee emp) {

        User newUser = new User();

        if (emp instanceof ManagerOne) {
            ManagerOne m1 = (ManagerOne) emp;
            newUser = new User(emp.getMatricule(), emp.getHashedPwd());
            newUser.setAssociatedManagerOne(m1);
            m1.setUser(newUser);
            saveUser(newUser);

            return true;

        } else if (emp instanceof ManagerTwo) {

            ManagerTwo m2 = (ManagerTwo) emp;
            newUser = new User(emp.getMatricule(), emp.getHashedPwd());
            newUser.setAssociatedManagerTwo(m2);
            m2.setUser(newUser);
            saveUser(newUser);

            return true;

        } else if (emp instanceof Drh) {

            Drh drh = (Drh) emp;
            newUser = new User(emp.getMatricule(), emp.getHashedPwd());
            newUser.setAssociatedDrh(drh);
            drh.setUser(newUser);
            saveUser(newUser);

            return true;
        }

        return false;
    }
}
