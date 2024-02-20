package com.sis.web.rest;

import com.sis.service.ReportsService;
import com.sis.service.dto.ReportResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/report")
public class ReportsResource {

    private final Logger log = LoggerFactory.getLogger(ReportsResource.class);

    private final ReportsService reportsService;

    public ReportsResource(ReportsService reportsService) {
        this.reportsService = reportsService;
    }

    @GetMapping("/currMap/{courseId}")
    public ResponseEntity<ReportResponseDTO> getReport(@PathVariable("courseId") long courseId) throws Exception {
        return ResponseEntity.ok().body(reportsService.getCurMapReport(courseId));
    }
}
