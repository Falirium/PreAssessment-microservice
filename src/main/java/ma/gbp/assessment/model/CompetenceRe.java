package ma.gbp.assessment.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import groovy.transform.ToString;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@Table(name = "competenceRequis")
public class CompetenceRe {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    // Means : Domaine de competence - Savoir-faire - Savoir-etre
    private String type;
    private String name;
    private String pisteObservation;

    // Means : E M A X
    private String niveauRequis;

    @ManyToMany(fetch = FetchType.LAZY, cascade = {
            CascadeType.PERSIST,
            CascadeType.MERGE
    }, mappedBy = "competencesRequis")
    @JsonIgnore
    private Set<Niveau> niveaux = new HashSet<>();

}
