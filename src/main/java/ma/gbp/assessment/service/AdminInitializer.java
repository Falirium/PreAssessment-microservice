package ma.gbp.assessment.service;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import ma.gbp.assessment.model.User;
import ma.gbp.assessment.repository.UserRepository;

@Service
public class AdminInitializer implements CommandLineRunner{
   
    @Autowired
    private UserService userService;

    @Override
    public void run(String... args) {
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(BCrypt.hashpw("password", BCrypt.gensalt()));
        admin.setAutorizationRoles(Arrays.asList("ADMIN"));

        if (!userService.existsByUsername("admin")) {
            userService.saveUser(admin);
        }
    }
}
