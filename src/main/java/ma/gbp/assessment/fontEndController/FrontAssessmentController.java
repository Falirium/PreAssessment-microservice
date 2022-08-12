package ma.gbp.assessment.fontEndController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import ma.gbp.assessment.model.Assessment;
import ma.gbp.assessment.service.AssessmentService;

@Controller
@RequestMapping(path = "/assessment")
public class FrontAssessmentController {

    @Autowired
    private AssessmentService assessmentService;




    @GetMapping(value = {"/list","/"} )
    public String getAllAssessment(Model model) {
         List<Assessment> listAssessments = assessmentService.getAll();

         model.addAttribute("assessments", listAssessments);

        return "list-assessments";
    }

    @GetMapping(path = "/add")
    public String addAssessment() {
        return "add-assessment";
    }

    @GetMapping(path = "/edit/{id}")
    public String editAssessment() {
        return null;
    }

   
    
}
