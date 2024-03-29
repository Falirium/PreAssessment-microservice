package ma.gbp.assessment.fontEndController;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(path = "/employee")
public class EmployeeFrontController {

    @GetMapping(path = "/drh/add")
    public String addDrh() {
        return "add-drh";
    }

    @GetMapping(path = "/drh/edit")
    public String editDrh() {
        return "edit-drh";
    }

    @GetMapping(path = "/manager/edit")
    public String editManager() {
        return "edit-manager";
    }

    @GetMapping(value = { "/drh/list", "/drh"})
    public String listDrhs() {
        return "list-drh";
    }

    @GetMapping(value = { "/manager/list", "/managers"})
    public String listManagers() {
        return "list-manager";
    }
    
}
