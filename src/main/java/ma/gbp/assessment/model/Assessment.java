package ma.gbp.assessment.model;

import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Table;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "assessment")
@NoArgsConstructor
public class Assessment {
    

    private String id;
    private String name;
    private String targetedDirection;
    private Date startedAt;
    private Date finishesAt;

    private List<Employee> listOfEmployees;
    private List<Category> listOfCategories;



}
