package ma.gbp.assessment.model;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

import org.hibernate.annotations.Type;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name="appUser")

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String username;
    private String password;

    @Type(type = "list-array")
    @Column(columnDefinition = "text[]", length = 50)
    private List<String> autorizationRoles;

    @OneToOne
    @JoinColumn(name="managerOne_id", referencedColumnName = "idManagerOne")
    private ManagerOne associatedManagerOne;

    @OneToOne
    @JoinColumn(name="managerTwo_id", referencedColumnName = "idManagerTwo")
    private ManagerTwo associatedManagerTwo;

    @OneToOne
    @JoinColumn(name="drh_id", referencedColumnName = "idDrh")
    private Drh associatedDrh;

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    

}
