package ma.gbp.assessment.model;

import java.util.List;

import javax.persistence.Column;

import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
public class Responsabilite {
    
    private String categorie;
    
    @Column(columnDefinition = "text[]", length = 2048)
    private List<String> valeur;
    
}
