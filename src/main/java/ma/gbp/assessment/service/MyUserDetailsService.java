package ma.gbp.assessment.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import ma.gbp.assessment.model.Employee;

@Component
public class MyUserDetailsService implements UserDetailsService{
    
    @Autowired
    private ManagerOneService managerOneService;

    @Autowired
    private ManagerTwoService managerTwoService;

    @Autowired
    private DrhService drhService;

    @Override
    public UserDetails loadUserByUsername(String matricule) throws UsernameNotFoundException {

        // DETERMINE WHICH USER IN TRYING TO BE CONNECTED
        Employee employee = managerOneService.getManagerOneByMatricule(matricule);

        if (employee == null) {

            employee = managerTwoService.getManagerTwoByMatricule(matricule);

            if ( employee == null) {

                employee = managerTwoService.getManagerTwoByMatricule(matricule);

                if ( employee == null) {
                    throw new UsernameNotFoundException(matricule);
                }
            }
        }

        
        return new org.springframework.security.core.userdetails.User(
            employee.getMatricule(),
            employee.getHashedPwd(),
            true,
            true,
            true,
            true,
            getAuthorities(Arrays.asList("USER"))
        );
    }

    private Collection<? extends GrantedAuthority> getAuthorities(List<String> roles) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        for (String role : roles) {
            authorities.add(new SimpleGrantedAuthority(role));
        }
        return authorities;
    }
}
