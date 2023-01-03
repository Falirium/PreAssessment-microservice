package ma.gbp.assessment.message;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmploiRequest {
    
    private String name;
    private Long emploiId;
}
