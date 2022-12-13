package ma.gbp.assessment.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthReqBody {

    private String type;
    private String matricule;
    private String pwd;
    
}
