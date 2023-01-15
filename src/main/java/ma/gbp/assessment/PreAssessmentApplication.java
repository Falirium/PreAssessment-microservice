package ma.gbp.assessment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.web.config.EnableSpringDataWebSupport;


@SpringBootApplication
@EnableSpringDataWebSupport
public class PreAssessmentApplication {
	
	public static void main(String[] args) {
		SpringApplication.run(PreAssessmentApplication.class, args);
	}

}
