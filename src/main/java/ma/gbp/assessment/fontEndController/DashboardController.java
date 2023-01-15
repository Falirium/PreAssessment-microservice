package ma.gbp.assessment.fontEndController;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class DashboardController {
    

    @RequestMapping(value = {"/contact-us","/contact"})
    public String index() {
        return "contact-us";
    }

    @RequestMapping(value = {"/"})
    public String mainPage() {
        return "list-assessments.html";
    }


}
