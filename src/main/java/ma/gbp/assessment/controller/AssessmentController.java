package ma.gbp.assessment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Pageable;
import org.springframework.data.querydsl.binding.QuerydslPredicate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.querydsl.core.types.Predicate;

import ma.gbp.assessment.exception.CustomErrorException;
import ma.gbp.assessment.message.EmploiRequest;
import ma.gbp.assessment.message.FicheEvaluationPreview;
import ma.gbp.assessment.model.Assessment;
import ma.gbp.assessment.model.AssessmentCategory;
import ma.gbp.assessment.model.AssessmentTemp;
import ma.gbp.assessment.model.Category;
import ma.gbp.assessment.model.Collaborateur;
import ma.gbp.assessment.model.Employee;
import ma.gbp.assessment.model.FicheEvaluation;
import ma.gbp.assessment.model.ManagerOne;
import ma.gbp.assessment.model.ManagerTwo;
import ma.gbp.assessment.model.Niveau;
import ma.gbp.assessment.repository.AsessmentTempRepository;
import ma.gbp.assessment.repository.FicheEvaluationRepository;
import ma.gbp.assessment.repository.NiveauRepository;
import ma.gbp.assessment.request.AssessmentReqBody;
import ma.gbp.assessment.service.AssessmentCategoryService;
import ma.gbp.assessment.service.AssessmentService;
import ma.gbp.assessment.service.AssessmentTempService;
import ma.gbp.assessment.service.CategoryService;
import ma.gbp.assessment.service.CollaborateurService;
import ma.gbp.assessment.service.FicheEvaluationService;
import ma.gbp.assessment.service.ManagerOneService;
import ma.gbp.assessment.service.ManagerTwoService;
import ma.gbp.assessment.service.NiveauService;

import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.TypeDefs;

import com.vladmihalcea.hibernate.type.array.ListArrayType;

import javassist.expr.NewArray;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Controller
@RequestMapping(path = "/preassessment/api/v1/assessment")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class AssessmentController {

        @Autowired
        private AssessmentService assessmentService;

        @Autowired
        private NiveauRepository niveauRepository;

        @Autowired
        private NiveauService niveauService;

        @Autowired
        private ManagerTwoService managerTwoService;

        @Autowired
        private ManagerOneService managerOneService;

        @Autowired
        private CollaborateurService collaborateurService;

        @Autowired
        private FicheEvaluationService ficheEvaluationService;

        @Autowired
        private AssessmentCategoryService assessmentCategoryService;

        @Autowired
        private CategoryService categoryService;

        @Autowired
        private AssessmentTempService assessmentTempService;

        @GetMapping("/")
        public ResponseEntity<List<Assessment>> getAssessments() {
                return ResponseEntity.status(HttpStatus.OK).body(assessmentService.getAll());
        }

        @PostMapping("/")
        public ResponseEntity<Assessment> saveAssessment(@RequestBody AssessmentReqBody assessmentReqBody) {

                // CREATE AN INSTANCE OF ASSESSMENT
                Assessment newAssessment = assessmentService.save(new Assessment(
                                assessmentReqBody.getName(),
                                assessmentReqBody.getTargetedDirection(),
                                assessmentReqBody.getStartedAt(),
                                assessmentReqBody.getFinishesAt(),
                                assessmentReqBody.getStatus()));

                List<ManagerOne> savedListManagers1 = new ArrayList<ManagerOne>();
                List<ManagerTwo> savedListManagers2 = new ArrayList<ManagerTwo>();
                List<Collaborateur> savedListCollaborateurs = new ArrayList<Collaborateur>();
                List<FicheEvaluation> savedListFiches = new ArrayList<FicheEvaluation>();
                List<AssessmentCategory> savedAssessmentCat = new ArrayList<AssessmentCategory>();
                List<Niveau> savedEmplois = new ArrayList<Niveau>();

                // SAVE MANAGERS 2
                // List<ManagerTwo> savedManagers2 = managerTwoService
                // .saveListOfManagers(assessmentReqBody.getManagers2());
                // savedListManagers2 = savedManagers2;

                for (ManagerTwo manager2 : assessmentReqBody.getManagers2()) {

                        ManagerTwo savedManager2 = new ManagerTwo();

                        // VERIFY IF THE MANAGER2 EXISTS
                        if (doesEmployeeExist(manager2.getFirstName(), manager2.getLastName(), 2)) {

                                savedManager2 = managerTwoService.getManagerByFirstAndLastName(manager2.getFirstName(), manager2.getLastName());
                        } else {

                                // SAVE IT AS A NEW ENTITY
                                savedManager2 = managerTwoService.saveManager(new ManagerTwo(
                                                manager2.getFirstName(),
                                                manager2.getLastName(),
                                                manager2.getMatricule()));

                
                        }

                         // ADD DIRECTLY TO THE LIST
                         savedListManagers2.add(savedManager2);
                }

                // SAVE MANAGERS 1
                for (ManagerOne manager1 : assessmentReqBody.getManagers1()) {

                        ManagerOne savedManager1 = new ManagerOne();

                        // WHEN MANAGER 1 DOES NOT EXIST ---> CREATE A NEW ONE
                        if (doesEmployeeExist(manager1.getFirstName(), manager1.getLastName(), 1)) {

                                savedManager1 = managerOneService.getManagerOneByMatricule(manager1.getMatricule());
                        } else {

                                savedManager1 = managerOneService.saveManager(new ManagerOne(
                                                manager1.getFirstName(),
                                                manager1.getLastName(),
                                                manager1.getMatricule()));

                                ManagerTwo associatedManagerTwo = managerTwoService.getManagerByFirstAndLastName(
                                                manager1.getManager().getFirstName(),
                                                manager1.getManager().getLastName());

                                // SET THE RELATIONSHIP

                                savedManager1.setManager(associatedManagerTwo);

                                savedManager1 = managerOneService.saveManager(savedManager1);
                        }

                        // ADD DIRECTLY TO THE LIST
                        savedListManagers1.add(savedManager1);
                }

                // SAVE COLLABORATEURS
                for (Collaborateur coll : assessmentReqBody.getCollaborateurs()) {

                        Collaborateur savedCollaborateur = new Collaborateur();

                        if (doesEmployeeExist(coll.getFirstName(), coll.getLastName(), 0)) {

                                savedCollaborateur = collaborateurService.getCollByFirstAndLastName(coll.getFirstName(),
                                                coll.getLastName());

                        } else {
                                savedCollaborateur = collaborateurService.saveCollaborateur(new Collaborateur(
                                                coll.getFirstName(),
                                                coll.getLastName(),
                                                coll.getMatricule(),
                                                coll.getTopDirection(),
                                                coll.getDirection(),
                                                coll.getRole()));

                        }

                        ManagerOne associatedManager = managerOneService.getManagerByFirstAndLastName(
                                        coll.getManagerOne().getFirstName(), coll.getManagerOne().getLastName());

                        // SET THE RELATIONSHIP
                        savedCollaborateur.setManagerOne(associatedManager);

                        savedCollaborateur = collaborateurService.saveCollaborateur(savedCollaborateur);

                        savedListCollaborateurs.add(savedCollaborateur);
                }

                // SAVE FICHE EVALUATION
                for (FicheEvaluation ficheEvaluation : assessmentReqBody.getFichesEvaluations()) {

                        FicheEvaluation savedFicheEvaluation = ficheEvaluationService
                                        .saveFicheEvaluation(new FicheEvaluation(
                                                        ficheEvaluation.getScore(),
                                                        ficheEvaluation.getSousPoints(),
                                                        ficheEvaluation.getSurPoints(),
                                                        ficheEvaluation.getCreatedAt(),
                                                        ficheEvaluation.getDateEvaluation(),
                                                        "CREATED",
                                                        ficheEvaluation.getFicheContent()));

                        // SET RELATIONSHIPS
                        ManagerOne associatedManagerOne = managerOneService.getManagerByFirstAndLastName(
                                        ficheEvaluation.getEvaluateurOne().getFirstName(),
                                        ficheEvaluation.getEvaluateurOne().getLastName());
                        ManagerTwo associatedManagerTwo = managerTwoService.getManagerByFirstAndLastName(
                                        ficheEvaluation.getEvaluateurTwo().getFirstName(),
                                        ficheEvaluation.getEvaluateurTwo().getLastName());
                        Collaborateur associatedColl = collaborateurService.getCollByFirstAndLastName(
                                        ficheEvaluation.getCollaborateur().getFirstName(),
                                        ficheEvaluation.getCollaborateur().getLastName());
                        Niveau associatedNiveau = niveauService.getNiveauByNameAndByLevel(
                                        ficheEvaluation.getEmploi().getIntitule(),
                                        Integer.valueOf(ficheEvaluation.getEmploi().getLevel()));

                        savedFicheEvaluation.setCollaborateur(associatedColl);
                        savedFicheEvaluation.setEvaluateurOne(associatedManagerOne);
                        savedFicheEvaluation.setEvaluateurTwo(associatedManagerTwo);
                        savedFicheEvaluation.setEmploi(associatedNiveau);

                        savedFicheEvaluation.setAssociatedAssessment(newAssessment);

                        savedFicheEvaluation = ficheEvaluationService.saveFicheEvaluation(savedFicheEvaluation);

                        savedListFiches.add(savedFicheEvaluation);
                }

                // SAVE ASSESSMENT CATEGORIES
                for (AssessmentCategory ac : assessmentReqBody.getAssessmentCategories()) {
                        // GET THE ASSOCIATED CATEGORY
                        Category associatedCategory = categoryService.getCategoryByName(ac.getCategorie().getName());

                        AssessmentCategory savedAssessmentCategory = assessmentCategoryService
                                        .saveCategory(new AssessmentCategory(ac.getCriterias()));

                        savedAssessmentCategory.setCategorie(associatedCategory);

                        savedAssessmentCategory = assessmentCategoryService.saveCategory(savedAssessmentCategory);
                        savedAssessmentCat.add(savedAssessmentCategory);

                }

                // GET EMPLOIS ENTITIES FROM DB
                for (Niveau niveau : assessmentReqBody.getTargetEmplois()) {
                        Niveau associatedNiveau = niveauService.getNiveauByNameAndByLevel(niveau.getIntitule(),
                                        niveau.getLevel());

                        savedEmplois.add(associatedNiveau);

                }

                // NOW SET VALUES TO ASSESSMENT ENTITY
                newAssessment.setListOfManagersOne(savedListManagers1);
                newAssessment.setListOfManagersTwo(savedListManagers2);
                newAssessment.setListOfCollaborateurs(savedListCollaborateurs);
                newAssessment.setFichesEvaluations(savedListFiches);
                newAssessment.setAssessmentCategories(savedAssessmentCat);
                newAssessment.setEmplois(savedEmplois);

                return ResponseEntity.status(HttpStatus.CREATED).body(assessmentService.save(newAssessment));
        }

        @GetMapping("/{id}")
        public ResponseEntity<Assessment> getAssessment(@PathVariable String id) {
                return ResponseEntity.status(HttpStatus.OK).body(assessmentService.getAssessment(id));
        }

        @PutMapping("/{id}")
        public ResponseEntity<Assessment> updateAssessment(@PathVariable String id,
                        @RequestBody Assessment updatedAssessment) {

                Assessment assessment = assessmentService.getAssessment(id);

                assessment.setAssessmentCategories(updatedAssessment.getAssessmentCategories());
                assessment.setListOfCollaborateurs(updatedAssessment.getListOfCollaborateurs());
                assessment.setListOfManagersOne(updatedAssessment.getListOfManagersOne());
                assessment.setListOfManagersTwo(updatedAssessment.getListOfManagersTwo());
                assessment.setExcelFile(updatedAssessment.getExcelFile());

                return ResponseEntity.status(HttpStatus.OK).body(assessmentService.save(assessment));
        }

        @PostMapping("/temp")
        public ResponseEntity<AssessmentTemp> saveAssessmentTemp(@RequestBody AssessmentTemp tempAssessment) {

                // CHECK IF THE ASSESSMENT IS ALREADY EXITED
                AssessmentTemp newSavedAssessment = assessmentTempService
                                .getSavedAssessmentByName(tempAssessment.getName());

                if (newSavedAssessment == null) {

                        newSavedAssessment = tempAssessment;

                } else {

                        // SET NEW VALUES OF PROPERTIES
                        newSavedAssessment.setName(tempAssessment.getName());
                        newSavedAssessment.setContent(tempAssessment.getContent());
                }

                return ResponseEntity.status(HttpStatus.OK)
                                .body(assessmentTempService.saveAssessmentTemp(newSavedAssessment));
        }

        @PutMapping("/temp")
        public ResponseEntity<AssessmentTemp> updateAssessmentTemp(@RequestBody AssessmentTemp tempAssessment) {

                // CHECK IF THE ASSESSMENT IS ALREADY EXITED
                AssessmentTemp updatedAssessment = assessmentTempService.getSavedAssessmentById(tempAssessment.getId());

                if (updatedAssessment == null) {

                        throw new CustomErrorException(HttpStatus.NOT_FOUND, "Assessment Not Found");

                } else {

                        // SET NEW VALUES OF PROPERTIES
                        updatedAssessment.setName(tempAssessment.getName());
                        updatedAssessment.setContent(tempAssessment.getContent());
                }

                return ResponseEntity.status(HttpStatus.OK)
                                .body(assessmentTempService.saveAssessmentTemp(updatedAssessment));
        }

        @GetMapping("/temp/{id}")
        public ResponseEntity<AssessmentTemp> getAssesmentTempById(@PathVariable Long id) {

                // CHECK IF THE ELEMENT EXISTS
                AssessmentTemp tempAssessment = assessmentTempService.getSavedAssessmentById(id);

                if (tempAssessment == null) {
                        throw new CustomErrorException(HttpStatus.NOT_FOUND, "Assessment Not Found");
                } else {
                        return ResponseEntity.status(HttpStatus.OK).body(tempAssessment);
                }

        }

        @GetMapping("/temp/list")
        public ResponseEntity<List<AssessmentTemp>> getAllAssessmentsTemp() {
                return ResponseEntity.status(HttpStatus.OK).body(assessmentTempService.getAllSavedAssessments());
        }

        @DeleteMapping("/temp/{name}")
        public ResponseEntity<Long> deleteTempAssessmentById(@PathVariable String name) {

                return ResponseEntity.status(HttpStatus.OK)
                                .body(assessmentTempService.deleteAssessmentTempByName(name));
        }

        private boolean doesEmployeeExist(String mFirstName, String mLastName, int mLevel) {

                Employee m = new Employee();

                if (mLevel == 1) {
                        m = managerOneService.getManagerByFirstAndLastName(mFirstName, mLastName);

                } else if (mLevel == 2) {
                        m = managerTwoService.getManagerByFirstAndLastName(mFirstName, mLastName);
                } else {
                        // CASE FOR COLLABORATEURS
                        m = collaborateurService.getCollByFirstAndLastName(mFirstName, mLastName);
                }

                if (m == null) {
                        return false;
                } else {
                        return true;
                }
        }

}