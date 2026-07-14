package com.sis.service.impl;

import com.sis.service.*;
import com.sis.service.dto.ReportResponseDTO;
import org.springframework.stereotype.Service;

@Service
public class ReportsServiceImpl implements ReportsService {

    private final PdfReport curriculumMappingReport;
    private final PdfReport registrationReport;

    public ReportsServiceImpl(CurriculumMappingReportImpl curriculumMappingReport, RegistrationReportImpl registrationReport) {
        this.curriculumMappingReport = curriculumMappingReport;
        this.registrationReport = registrationReport;
    }

    @Override
    public ReportResponseDTO getCurMapReport(long courseId) throws Exception {
        return curriculumMappingReport.getReport(courseId);
    }

    @Override
    public ReportResponseDTO getRegistrationReport(long studentId) throws Exception {
        return registrationReport.getReport(studentId);
    }
}
