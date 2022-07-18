package ma.gbp.assessment.model;

import javax.persistence.Embeddable;
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
    private String matriculle;
    private String topDirection;
    private String direction;
    private String role;
}
