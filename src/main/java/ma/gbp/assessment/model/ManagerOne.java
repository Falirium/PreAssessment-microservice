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
@Table(name="manager1")
@NoArgsConstructor
public class ManagerOne extends Employee {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long idManagerOne;
}
