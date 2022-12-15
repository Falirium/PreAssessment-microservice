package ma.gbp.assessment.fontEndController;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class DashboardController {
    

    @RequestMapping("/")
    public String index() {
        return "list-assessment";
    }


}
