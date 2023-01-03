package ma.gbp.assessment.model;

import java.io.Serializable;

import javax.persistence.Column;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Level implements Serializable{
    

    private String level;
    @Column(columnDefinition = "TEXT" ,length = 200048)
    private String definition;
}
