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
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.TypeDefs;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.vladmihalcea.hibernate.type.array.ListArrayType;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "assessment")
@NoArgsConstructor

@TypeDefs({
    @TypeDef(name = "list-array", typeClass = ListArrayType.class)
})
public class Assessment {
    

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    private String id;
    private String name;

    @Type(type = "list-array")
    @Column(columnDefinition = "text[]", length = 2048)
    private List<String> targetedDirection;
    
    private Date startedAt;
    private Date finishesAt;
    private String status;

    @ManyToMany(
        fetch = FetchType.LAZY, cascade = {
            CascadeType.PERSIST,
            CascadeType.MERGE
    }
    )
    @JoinTable(
        name = "assessment_emploi",
        joinColumns = @JoinColumn(name = "assessment_id"),
        inverseJoinColumns = @JoinColumn(name = "emploi_id")
    )
    private List<Niveau> emplois;

    @ManyToMany(
        fetch = FetchType.LAZY, cascade = {
            CascadeType.PERSIST,
            CascadeType.MERGE
    }
    )
    @JoinTable(
        name = "assessment_collaborateur",
        joinColumns = @JoinColumn(name = "assessment_id"),
        inverseJoinColumns = @JoinColumn(name = "collaborateur_id")
    )
    private List<Collaborateur> listOfCollaborateurs;


    @ManyToMany(
        fetch = FetchType.LAZY, cascade = {
            CascadeType.PERSIST,
            CascadeType.MERGE
    }
    )
    @JoinTable(
        name = "assessment_managerOne",
        joinColumns = @JoinColumn(name = "assessment_id"),
        inverseJoinColumns = @JoinColumn(name = "managerOne_id")
    )
    private List<ManagerOne> listOfManagersOne;


    @ManyToMany(
        fetch = FetchType.LAZY, cascade = {
            CascadeType.PERSIST,
            CascadeType.MERGE
    }
    )
    @JoinTable(
        name = "assessment_managerTwo",
        joinColumns = @JoinColumn(name = "assessment_id"),
        inverseJoinColumns = @JoinColumn(name = "managerTwo_id")
    )
    private List<ManagerTwo> listOfManagersTwo;

    // @ManyToMany
    // @JoinTable(
    //     name = "assessment_category",
    //     joinColumns = @JoinColumn(name = "assessment_id"),
    //     inverseJoinColumns = @JoinColumn(name = "category_id")
    // )
    // private List<Category> listOfCategories;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "file_id", referencedColumnName = "id")
    private FileDB excelFile;


    @ManyToMany(
        fetch = FetchType.LAZY, cascade = {
            CascadeType.PERSIST,
            CascadeType.MERGE
    }
    )
    @JoinTable(
        name = "assessment_categorie",
        joinColumns = @JoinColumn(name = "assessment_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<AssessmentCategory> assessmentCategories = new ArrayList<>();


    @OneToMany(mappedBy = "associatedAssessment")
    @JsonIgnore
    private List<FicheEvaluation> fichesEvaluations;


    public Assessment(String name, List<String> targetedDirection, Date startedAt, Date finishesAt, String status) {
        this.name = name;
        this.targetedDirection = targetedDirection;
        this.startedAt = startedAt;
        this.finishesAt = finishesAt;
        this.status = status;
    }


    
}
