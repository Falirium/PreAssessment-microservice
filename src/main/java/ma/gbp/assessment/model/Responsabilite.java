package ma.gbp.assessment.model;

import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
public class Responsabilite {
    
    private String categorie;
    private List<String> valeur;
    
}
