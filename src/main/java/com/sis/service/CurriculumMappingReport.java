package com.sis.service;

import com.sis.service.dto.CurriculumMappingReportDetailDto;
import com.sis.service.dto.ReportResponseDTO;

public interface CurriculumMappingReport {
    ReportResponseDTO getCurMapReport(long courseId) throws Exception;
    String getFilename() throws Exception;

    CurriculumMappingReportDetailDto getCurMapDetails(Long courseId);
}
