package ma.gbp.assessment.model;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.TypeDefs;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.vladmihalcea.hibernate.type.array.ListArrayType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "fiche_evaluation")
@TypeDefs({
        @TypeDef(name = "list-array", typeClass = ListArrayType.class),

})
public class FicheEvaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private float score;
    private float sousPoints;
    private float surPoints;

    private float sectionRes;
    private float sectionExi;
    private float sectionMarq;
    private float sectionCompDc;
    private float sectionCompSf;
    private float sectionCompSe;

    private String status;

    private Date createdAt;
    private Date dateEvaluation;

    @Type(type = "list-array")
    @Column(columnDefinition = "text[]", length = 2048)
    private List<String> ficheContent;

    @Column(columnDefinition = "TEXT", length = 2048)
    private String re_manager1;

    @Column(columnDefinition = "TEXT", length = 2048)
    private String re_manager2;

    @ManyToOne
    @JoinColumn(name = "evaluateurOne_id", referencedColumnName = "idManagerOne")
    private ManagerOne evaluateurOne;

    @ManyToOne
    @JoinColumn(name = "evaluateurTwo_id", referencedColumnName = "idManagerTwo")
    private ManagerTwo evaluateurTwo;

    @ManyToOne
    @JoinColumn(name = "collaborateur_id", referencedColumnName = "id")
    private Collaborateur collaborateur;

    @ManyToOne
    @JoinColumn(name = "niveau_id")
    private Niveau emploi;

    @ManyToOne
    @JoinColumn(name = "assessment_id")
    private Assessment associatedAssessment;

    public FicheEvaluation(float score, float sousPoints, float surPoints, Date createdAt) {
        this.score = score;
        this.sousPoints = sousPoints;
        this.surPoints = surPoints;
        this.createdAt = createdAt;
    }

    public FicheEvaluation(float score, float sousPoints, float surPoints, Date createdAt,
            ManagerOne evaluateurOne, ManagerTwo evaluateurTwo, Collaborateur collaborateur, Niveau emploi,
            Assessment associatedAssessment) {
        this.score = score;
        this.sousPoints = sousPoints;
        this.surPoints = surPoints;
        this.createdAt = createdAt;
        this.evaluateurOne = evaluateurOne;
        this.evaluateurTwo = evaluateurTwo;
        this.collaborateur = collaborateur;
        this.emploi = emploi;
        this.associatedAssessment = associatedAssessment;
    }

    public FicheEvaluation(float score, float sousPoints, float surPoints, Date createdAt, Date dateEvaluation) {
        this.score = score;
        this.sousPoints = sousPoints;
        this.surPoints = surPoints;
        this.createdAt = createdAt;
        this.dateEvaluation = dateEvaluation;
    }

    public FicheEvaluation(float score, float sousPoints, float surPoints, Date createdAt, Date dateEvaluation,
            String status, List<String> ficheContent) {
        this.score = score;
        this.sousPoints = sousPoints;
        this.surPoints = surPoints;
        this.createdAt = createdAt;
        this.dateEvaluation = dateEvaluation;
        this.status = status;
        this.ficheContent = ficheContent;
    }

}
