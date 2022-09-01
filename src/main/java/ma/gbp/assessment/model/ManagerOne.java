package ma.gbp.assessment.model;

import java.util.List;

import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.Target;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name="manager1")
@NoArgsConstructor
public class ManagerOne extends Employee {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idManagerOne;

    @ManyToOne
    @JoinColumn(name = "managerTwo_id", referencedColumnName = "idManagerTwo")
    private ManagerTwo manager;

    @OneToMany(mappedBy = "managerOne")
    @JsonIgnore
    private List<Collaborateur> collaborateurs;

    @ManyToMany(mappedBy = "listOfManagersOne")
    @JsonProperty(access = Access.WRITE_ONLY)
    private List<Assessment> listOfAssessments;

    @OneToMany(mappedBy = "evaluateurOne")
    @JsonIgnore
    private List<FicheEvaluation> fichesEvaluations;

    public ManagerOne(String firstName, String lastName, String matricule) {
        super(firstName, lastName, matricule);
    }


    
}
