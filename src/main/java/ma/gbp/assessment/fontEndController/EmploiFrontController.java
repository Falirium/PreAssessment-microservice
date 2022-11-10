package ma.gbp.assessment.fontEndController;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(path ="/emploi")
public class EmploiFrontController {
    

    @GetMapping(path = "/add")
    public String addEmploi() {
        return "add-emploi";
    }

    @GetMapping(path = "/edit")
    public String editEmploi() {
        return "edit-emploi";
    }

    @GetMapping(path = "/competence/add")
    public String addCompetence() {
        return "add-competence";
    }

    @GetMapping(path = "/list")
    public String listOfEmplois() {
        return "list-emplois";
    }

    @GetMapping(path = "competence/list")
    public String listOfCompetences() {
        return "list-competences";
    }

    @GetMapping(path = "competence/edit")
    public String editOfCompetences() {
        return "edit-competence";
    }
}
