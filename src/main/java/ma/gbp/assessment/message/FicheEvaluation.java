package ma.gbp.assessment.message;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.gbp.assessment.model.CompetenceRe;
import ma.gbp.assessment.model.Responsabilite;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FicheEvaluation {

    private String intitule;
    private String filiere;
    private String sousFiliere;
    private Date dateMaj;
    private String vocation;
    private int level;


    private List<Responsabilite> responsabilites;
    private List<String> exigences;
    private List<String> marqueurs;
    private List<FullCompetenceRequis> competences_dc = new ArrayList<FullCompetenceRequis>();
    private List<FullCompetenceRequis> competences_se = new ArrayList<FullCompetenceRequis>();
    private List<FullCompetenceRequis> competences_sf = new ArrayList<FullCompetenceRequis>();

}
