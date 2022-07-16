package ma.gbp.assessment.service;

import java.io.IOException;
import java.util.Optional;
import java.util.stream.Stream;
import java.io.File;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.JsonNode;

import ma.gbp.assessment.model.FileDB;
import ma.gbp.assessment.repository.FileRepository;

@Service
public class FileStorageService {
    
    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private ExcelToJsonConverter excel2json;


    public FileDB store(MultipartFile file) throws IOException{
        
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        FileDB fileDB = new FileDB(fileName, file.getContentType(), file.getBytes());

        return fileRepository.save(fileDB);
        
    }


    public FileDB getFile(String id) {
        return fileRepository.findById(id).get();
    }


    public Stream<FileDB> getAllFiles() {
        return fileRepository.findAll().stream();
    }


    public JsonNode getJsonOf(byte[] excelBytes) {
        File excelFile = excel2json.bytesToFile(excelBytes);
        return excel2json.excelToJson(excelFile);
    }


}
