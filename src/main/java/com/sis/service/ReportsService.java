package com.sis.service;

import com.sis.service.dto.ReportResponseDTO;

public interface ReportsService {
    public ReportResponseDTO getCurMapReport(long courseId) throws Exception;
}
