package ma.gbp.assessment.model;

import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.Target;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name="collaborateur")
@NoArgsConstructor
public class Collaborateur extends Employee{
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    

}
