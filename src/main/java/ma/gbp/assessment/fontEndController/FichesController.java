package ma.gbp.assessment.fontEndController;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping(path = "/evaluation")
public class FichesController {

    @GetMapping(value = "/list")
    public String getListFiches() {
        return "list-fiches";
    }



    @GetMapping(path = "/evaluate")
    public String buildFicheEvaluationFor(
        @RequestParam(name = "eName") String emploiName,
        @RequestParam(name = "level") int level,
        @RequestParam(name = "marqueurs") Boolean marqueurs,
        @RequestParam(name = "exigences") Boolean exigences,
        @RequestParam(name = "responsabilites") Boolean responsabilites,
        @RequestParam(name = "competences_dc") Boolean competences_dc,
        @RequestParam(name = "competences_se") Boolean competences_se,
        @RequestParam(name = "competences_sf") Boolean competences_sf,
        Model model) {

            return "fiche-evaluation";
        }
    
}
