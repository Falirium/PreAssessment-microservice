package ma.gbp.assessment.request;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FicheEvaluationReqBody {
    
    private float score;
    private float sousPoints;
    private float surPoints;

    private Date createdAt;
    private Date dateEvaluation;

    private Long evaluateurOne;
    private Long evaluateurTwo;
    private Long collaborateur;
    private Long emploi;
    private String associatedAssessment;
}
