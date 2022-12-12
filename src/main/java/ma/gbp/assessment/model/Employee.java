package ma.gbp.assessment.model;

import java.util.List;

import javax.persistence.Embeddable;
import javax.persistence.ManyToMany;
import javax.persistence.MappedSuperclass;

import org.springframework.stereotype.Component;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@MappedSuperclass
@Data
@NoArgsConstructor
public class Employee {
    
    private String firstName;
    private String lastName;
    private String matricule;
    private String topDirection;
    private String direction;
    private String role;
    private String phoneNumber;
    private String workEmail;

    public Employee(String firstName, String lastName, String matricule) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.matricule = matricule;
        
    }

    public Employee(String firstName, String lastName, String matricule, String topDirection, String direction,
            String role) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.matricule = matricule;
        this.topDirection = topDirection;
        this.direction = direction;
        this.role = role;
    }

    


    

    
}
