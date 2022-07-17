package ma.gbp.assessment.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name="manager2")
@NoArgsConstructor

public class ManagerTwo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long idManagerTwo;
}
