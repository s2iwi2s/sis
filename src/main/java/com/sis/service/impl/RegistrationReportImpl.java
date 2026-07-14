package com.sis.service.impl;

import com.sis.service.AbstractPdfReport;
import com.sis.service.StudentService;
import com.sis.service.dto.StudentDTO;
import org.springframework.stereotype.Service;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Service
public class RegistrationReportImpl extends AbstractPdfReport<StudentDTO, Long> {

    private final SpringTemplateEngine templateEngine;
    private final StudentService studentService;

    public RegistrationReportImpl(SpringTemplateEngine templateEngine, StudentService studentService) {
        this.templateEngine = templateEngine;
        this.studentService = studentService;
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
        return studentService
            .findOne(studentId)
            .map(studentDTO -> studentDTO)
            .orElseThrow();
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
