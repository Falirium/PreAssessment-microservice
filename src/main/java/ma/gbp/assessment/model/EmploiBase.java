package ma.gbp.assessment.model;

import java.util.Date;

import javax.persistence.MappedSuperclass;

import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@MappedSuperclass

public class EmploiBase {


    private String intitule;
    private String filiere;
    private String sousFiliere;
    private Date dateMaj;
    private String vocation;
    private String responsabilites;  

    
    
}
