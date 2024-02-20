package com.sis.service.impl;

import com.sis.service.*;
import com.sis.service.dto.ReportResponseDTO;
import org.springframework.stereotype.Service;

@Service
public class ReportsServiceImpl implements ReportsService {

    private final CurriculumMappingReport curriculumMappingReport;

    public ReportsServiceImpl(CurriculumMappingReport curriculumMappingReport) {
        this.curriculumMappingReport = curriculumMappingReport;
    }

    @Override
    public ReportResponseDTO getCurMapReport(long courseId) throws Exception {
        return curriculumMappingReport.getCurMapReport(courseId);
    }
}
