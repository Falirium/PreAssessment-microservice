
package ma.gbp.assessment.request;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.gbp.assessment.model.AssessmentCategory;
import ma.gbp.assessment.model.Collaborateur;
import ma.gbp.assessment.model.FicheEvaluation;
import ma.gbp.assessment.model.ManagerOne;
import ma.gbp.assessment.model.ManagerTwo;
import ma.gbp.assessment.model.Niveau;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentReqBody {
    private String name;
    private List<String> targetedDirection;
    private String status;
    private Date startedAt;
    private Date finishesAt;
    private List<Niveau> targetEmplois;
    private List<AssessmentCategory> assessmentCategories;
    private List<Collaborateur> collaborateurs;
    private List<ManagerOne> managers1;
    private List<ManagerTwo> managers2;
    private List<FicheEvaluation> fichesEvaluations;

}
