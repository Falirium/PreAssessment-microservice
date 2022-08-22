package ma.gbp.assessment.model;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "assessment")
@NoArgsConstructor
public class Assessment {
    

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    private String id;
    private String name;
    private String targetedDirection;
    private Date startedAt;
    private Date finishesAt;

    @ManyToMany
    @JoinTable(
        name = "assessment_collaborateur",
        joinColumns = @JoinColumn(name = "assessment_id"),
        inverseJoinColumns = @JoinColumn(name = "collaborateur_id")
    )
    private List<Collaborateur> listOfCollaborateurs;


    @ManyToMany
    @JoinTable(
        name = "assessment_managerOne",
        joinColumns = @JoinColumn(name = "assessment_id"),
        inverseJoinColumns = @JoinColumn(name = "managerOne_id")
    )
    private List<ManagerOne> listOfManagersOne;


    @ManyToMany
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


    @ManyToMany
    @JoinTable(
        name = "assessment_categorie",
        joinColumns = @JoinColumn(name = "assessment_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<AssessmentCategory> assessmentCategories = new HashSet<>();


}
