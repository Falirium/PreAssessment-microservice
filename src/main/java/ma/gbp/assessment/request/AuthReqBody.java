package ma.gbp.assessment.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.gbp.assessment.model.Drh;
import ma.gbp.assessment.model.ManagerOne;
import ma.gbp.assessment.model.ManagerTwo;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthReqBody {

    private String type;
    private String matricule;
    private String pwd;
    private boolean isAuth;
    private Drh dthUser;
    private ManagerOne managerOneUser;
    private ManagerTwo managerTwoUser;

    
}
