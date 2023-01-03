package ma.gbp.assessment.request;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.gbp.assessment.model.Criteria;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoriesReqBody {

    private String name;
    private List<String> evaluationContent;
    private List<Criteria> criterias;
    
}
