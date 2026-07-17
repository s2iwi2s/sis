package com.sis.service.impl;

import com.sis.service.AbstractPdfReport;
import com.sis.service.AppConfigService;
import com.sis.service.StudentService;
import com.sis.service.dto.AppConfigDTO;
import com.sis.service.dto.StudentDTO;
import org.springframework.stereotype.Service;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.spring6.dialect.SpringStandardDialect;
import org.thymeleaf.templateresolver.StringTemplateResolver;

@Service
public class RegistrationReportImpl extends AbstractPdfReport<StudentDTO, Long> {

    private final SpringTemplateEngine templateEngine;
    private final StudentService studentService;
    private final AppConfigService appConfigService;

    public RegistrationReportImpl(StudentService studentService, AppConfigService appConfigService, SpringTemplateEngine templateEngine) {
        this.studentService = studentService;
        this.appConfigService = appConfigService;

        templateEngine.setDialect(new SpringStandardDialect());
        StringTemplateResolver templateResolver = new StringTemplateResolver();
        templateEngine.setTemplateResolver(templateResolver);
        this.templateEngine = templateEngine;
    }

    @Override
    public SpringTemplateEngine getTemplateEngine() {
        return this.templateEngine;
    }

    @Override
    public String getContextVariable() {
        return "student";
    }

    @Override
    public StudentDTO getData(Long studentId) {
        StudentDTO dto = studentService
            .findOne(studentId)
            .map(studentDTO -> studentDTO)
            .orElseThrow();
        //        if(dto.getGender() == null) {
        //            dto.setGender(new AppConfigDTO()
        //                .value("")
        //                .code(""));
        //        }
        //        if(dto.getGradelevel() == null) {
        //            dto.setGradelevel(new AppConfigDTO()
        //                .value("")
        //                .code(""));
        //        }
        //        if(dto.getParentCivilStatus() == null) {
        //            dto.setParentCivilStatus(new AppConfigDTO()
        //                .value("")
        //                .code(""));
        //        }
        return dto;
    }

    @Override
    public AppConfigService getAppConfigService() {
        return this.appConfigService;
    }

    @Override
    public String getAppConfigKey() {
        return "REGISTRATION_PDF";
    }

    @Override
    public String setLine(String line, StudentDTO data) {
        return line;
    }

    public String getTemplateFileName() {
        return null;
    }

    @Override
    public String getTemplateName() {
        return "reports/registration-template";
    }

    public String getOutputFileName() {
        return "registration.pdf";
    }
}
