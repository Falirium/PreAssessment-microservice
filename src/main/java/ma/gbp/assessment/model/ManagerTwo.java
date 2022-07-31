package ma.gbp.assessment.model;

import java.util.List;

import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import org.hibernate.annotations.Target;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name="manager2")
@NoArgsConstructor

public class ManagerTwo extends Employee{
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idManagerTwo;

    @ManyToMany(mappedBy = "listOfManagersTwo")
    @JsonProperty(access = Access.WRITE_ONLY)
    private List<Assessment> listOfAssessments;
}
