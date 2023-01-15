package ma.gbp.assessment.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import groovy.transform.ToString;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@ToString
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

    @JsonIgnore
    @OneToOne(mappedBy = "associatedDrh")
    private User user;


}
