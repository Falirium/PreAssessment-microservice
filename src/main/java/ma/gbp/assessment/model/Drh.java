package ma.gbp.assessment.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name="drh")
@NoArgsConstructor
public class Drh extends Employee{
    

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idDrh;

    

    // EX : BANQUE REGIONALE DE TEOUANE-TANGER
    private String tag;

    private int[] codePrefix;
    private int[] codeSuffix;


}
