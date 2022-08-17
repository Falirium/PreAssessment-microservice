package ma.gbp.assessment.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "niveau")
@Data
@NoArgsConstructor

public class Niveau extends EmploiBase{

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private int level;
    private String exigences;
    private String marqueurs;

    @ManyToMany
    @JoinTable(
        name = "niveau_competenceRequis",
        joinColumns = {@JoinColumn(name = "niveau_id")},
        inverseJoinColumns = {@JoinColumn(name = "competenceRequis_id")})

    private Set<CompetenceRe> listOfCompetenceRequis = new HashSet<>();

    
}
