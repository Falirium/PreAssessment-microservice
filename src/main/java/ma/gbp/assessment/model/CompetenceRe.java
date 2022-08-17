package ma.gbp.assessment.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "competenceRequis")
public class CompetenceRe {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String type;
    private String name;
    private String pisteObservation;

    @ManyToMany(mappedBy = "listOfCompetenceRequis")
    @JsonIgnore
    private Set<Niveau> niveaux = new HashSet<>();


    
    
}
