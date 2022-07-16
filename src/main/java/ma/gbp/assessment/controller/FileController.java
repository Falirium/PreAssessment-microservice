package ma.gbp.assessment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.fasterxml.jackson.databind.JsonNode;

import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import ma.gbp.assessment.message.ResponseMessage;
import ma.gbp.assessment.model.FileDB;
import ma.gbp.assessment.message.ResponseFile;
import ma.gbp.assessment.service.FileStorageService;

@Controller
@RequestMapping (path = "/preassessment/api/v1")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class FileController {
    
    @Autowired
    private FileStorageService fileStorageService;


    @PostMapping("/upload")
    public ResponseEntity<ResponseMessage> uploadFile(@RequestParam("file") MultipartFile file) {

        String message ="";

        try {
            FileDB savedFile = fileStorageService.store(file);
            // message =" Téléchargement du fichier " + file.getOriginalFilename() + " est réussi";
            message = savedFile.getId();
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
        } catch (Exception e) {
            //TODO: handle exception
            message = " Impossible de télécharger le fichier \"" + file.getOriginalFilename() + " \"";
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
        }
    }

    @GetMapping("/files")
    public ResponseEntity<List<ResponseFile> > getListFiles() {
        List<ResponseFile> files = fileStorageService.getAllFiles().map(dbFile -> {
            String fileDownloadUri = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/files/")
                .path(dbFile.getId())
                .toUriString();
            return new ResponseFile(dbFile.getName(), fileDownloadUri, dbFile.getType(), dbFile.getData().length);  
        }).collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.OK).body(files);
    }

    @GetMapping("/files/{id}")
    public ResponseEntity<byte[]> getFile(@PathVariable String id) {
        FileDB fileDB = fileStorageService.getFile(id);

        return ResponseEntity
                .ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=\"" + fileDB.getName() + "\"")
                .body(fileDB.getData()); 
    }

    @GetMapping("/2json/{id}")
    public ResponseEntity<JsonNode> getJsonText(@PathVariable String id) {
        FileDB fileDB = fileStorageService.getFile(id);

        JsonNode json =  fileStorageService.getJsonOf(fileDB.getData());

        return ResponseEntity.status(HttpStatus.OK).body(json);
    }
}
