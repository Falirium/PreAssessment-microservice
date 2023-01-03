package ma.gbp.assessment.fontEndController;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AuthentificationController {
    
    @GetMapping("/")
    public String loging() {
        return "login.html";
    }
}
