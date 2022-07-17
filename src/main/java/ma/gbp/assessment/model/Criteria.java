package ma.gbp.assessment.model;

import java.io.Serializable;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Criteria implements Serializable{

    private String name;
    private double min;
    private double max;
}
