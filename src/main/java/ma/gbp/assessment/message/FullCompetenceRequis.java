package ma.gbp.assessment.message;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import ma.gbp.assessment.model.Level;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class FullCompetenceRequis {
    

    private String name;
    private String requiredNiveau;
    private List<Level> niveaux;

}
