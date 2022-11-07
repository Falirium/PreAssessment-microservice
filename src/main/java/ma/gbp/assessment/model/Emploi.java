package ma.gbp.assessment.model;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name="emploi")
@NoArgsConstructor
public class Emploi {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String intitule;

    @OneToMany(mappedBy = "emploi")
    @Fetch(FetchMode.JOIN)
    private List<Niveau> niveaux;

    public Emploi(String intitule) {
        this.intitule = intitule;
    }
}
