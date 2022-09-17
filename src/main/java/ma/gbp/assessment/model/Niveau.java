package ma.gbp.assessment.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.TypeDefs;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.vladmihalcea.hibernate.type.array.ListArrayType;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import com.vladmihalcea.hibernate.type.json.JsonStringType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "niveau")
@Data
@NoArgsConstructor

@TypeDefs({
        @TypeDef(name = "list-array", typeClass = ListArrayType.class),
        @TypeDef(name = "json" , typeClass = JsonStringType.class),
        @TypeDef(name = "jsonb", typeClass = JsonBinaryType.class)
})

public class Niveau {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    
    private String intitule;

    private String filiere;
 
    private String sousFiliere;
    
    private Date dateMaj;

    @Column(columnDefinition = "TEXT", length = 2048)
    private String vocation;
    
    private int level;

    @Type(type = "jsonb")
    @Column(columnDefinition = "jsonb", length = 2048)
    private List<Responsabilite> responsabilites;

    @Type(type = "list-array")
    @Column(columnDefinition = "text[]", length = 2048)
    private List<String> exigences;

    @Type(type = "list-array")
    @Column(columnDefinition = "text[]", length = 2048)
    private List<String> marqueurs;

    @ManyToMany(mappedBy = "emplois")
    private List<Assessment> assessments;

    @ManyToMany(fetch = FetchType.LAZY, cascade = {
            CascadeType.PERSIST,
            CascadeType.MERGE
    })
    @JoinTable(name = "niveau_competenceRequis", joinColumns = {
            @JoinColumn(name = "niveau_id") }, inverseJoinColumns = { @JoinColumn(name = "competenceRequis_id") })
        
    private List<CompetenceRe> competencesRequis = new ArrayList<>();


    @OneToMany(mappedBy="emploi")
    @JsonIgnore
    private List<FicheEvaluation> associatedFichesEvaluations;

    public Niveau(String intitule, String filiere, String sousFiliere, Date dateMaj, String vocation, int level,
            List<Responsabilite> responsabilites, List<String> exigences, List<String> marqueurs) {
        this.intitule = intitule;
        this.filiere = filiere;
        this.sousFiliere = sousFiliere;
        this.dateMaj = dateMaj;
        this.vocation = vocation;
        this.level = level;
        this.responsabilites = responsabilites;
        this.exigences = exigences;
        this.marqueurs = marqueurs;
    }

}
