package ma.gbp.assessment.fontEndController;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(path ="/emploi")
public class EmploiController {
    

    @GetMapping(path = "/add")
    public String addEmploi() {
        return "add-emploi";
    }
}
