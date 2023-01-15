
package ma.gbp.assessment.message;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthentificationRes {
    
   private String role;
   private boolean isAuth;
   private String firstName;
    private String lastName;
    private String matricule;

}
