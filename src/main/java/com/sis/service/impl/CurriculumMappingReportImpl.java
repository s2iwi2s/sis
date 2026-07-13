package com.sis.service.impl;

import com.sis.service.*;
import com.sis.service.dto.*;
import com.sis.service.util.PdfConverter;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class CurriculumMappingReportImpl implements CurriculumMappingReport {

    private final Logger log = LoggerFactory.getLogger(this.getClass());
    private final CourseService courseService;
    private final CurriculumMapService curriculumMapService;
    private final LearningCompetencyServiceImpl learningCompetencyService;
    private final StrategiesService strategiesService;
    private final AssessmentService assessmentService;

    public CurriculumMappingReportImpl(
        CourseService courseService,
        CurriculumMapService curriculumMapService,
        LearningCompetencyServiceImpl learningCompetencyService,
        StrategiesService strategiesService,
        AssessmentService assessmentService
    ) throws Exception {
        this.courseService = courseService;
        this.curriculumMapService = curriculumMapService;
        this.learningCompetencyService = learningCompetencyService;
        this.strategiesService = strategiesService;
        this.assessmentService = assessmentService;
    }

    @Override
    public ReportResponseDTO getCurMapReport(long courseId) throws Exception {
        log.info("Service report with course id={}", courseId);
        CurriculumMappingReportDetailDto curMapDetails = getCurMapDetails(courseId);
        List<CurriculumMappingReportRowDto> list = new ArrayList<>();
        List<QuarterDTO> qtrList = new ArrayList<>();
        try {
            List<String> qtrSubList = null;
            QuarterDTO qtr = new QuarterDTO(-1, new ArrayList<>());
            boolean qtrChanged = false;
            for (CurriculumMapDTO c : curMapDetails.getCurriculumMapDTOS()) {
                boolean skipHead = false;
                if (qtr.getQuarter().longValue() != c.getQuarterNo().longValue()) {
                    qtrSubList = new ArrayList<>();
                    qtr = new QuarterDTO(c.getQuarterNo(), qtrSubList);
                    qtrList.add(qtr);
                    qtrChanged = true;
                }
                qtrSubList.add(c.getTopic());

                if (c.getLearningCompetencyDTOS() == null || c.getLearningCompetencyDTOS().isEmpty()) {
                    list.add(
                        new CurriculumMappingReportRowDto(
                            qtrChanged ? qtr : null,
                            "Week " + c.getWeekNo(),
                            c.getTopic(),
                            c.getContentStandards(),
                            c.getPerformanceStandards(),
                            "",
                            "",
                            ""
                        )
                    );
                    qtrChanged = false;
                } else {
                    for (LearningCompetencyDTO l : c.getLearningCompetencyDTOS()) {
                        boolean skipLc = false;
                        if (l.getStrategiesDTOS().isEmpty() && l.getAssessmentDTOS().isEmpty()) {
                            list.add(
                                new CurriculumMappingReportRowDto(
                                    qtrChanged ? qtr : null,
                                    !skipHead ? "Week " + c.getWeekNo() : "",
                                    !skipHead ? c.getTopic() : "",
                                    !skipHead ? c.getContentStandards() : "",
                                    !skipHead ? c.getPerformanceStandards() : "",
                                    l.getCompetencyCode() + "-" + l.getDescription(),
                                    "",
                                    ""
                                )
                            );
                            skipHead = true;
                            qtrChanged = false;
                        } else {
                            for (int i = 0; i < l.getStrategiesDTOS().size() || i < l.getAssessmentDTOS().size(); i++) {
                                list.add(
                                    new CurriculumMappingReportRowDto(
                                        qtrChanged ? qtr : null,
                                        !skipHead ? "Week " + c.getWeekNo() : "",
                                        !skipHead ? c.getTopic() : "",
                                        !skipHead ? c.getContentStandards() : "",
                                        !skipHead ? c.getPerformanceStandards() : "",
                                        !skipLc ? l.getCompetencyCode() + "-" + l.getDescription() : "",
                                        i < l.getStrategiesDTOS().size() ? l.getStrategiesDTOS().get(i).getDescription() : "",
                                        i < l.getAssessmentDTOS().size()
                                            ? l.getAssessmentDTOS().get(i).getInstruction() + l.getAssessmentDTOS().get(i).getMarkScheme()
                                            : ""
                                    )
                                );
                                skipHead = true;
                                skipLc = true;
                                qtrChanged = false;
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error: " + e.getMessage(), e);
        }
        CourseDTO courseDTO = curMapDetails.getCourseDTO();
        StringBuilder html = new StringBuilder(
            "<html><head>" +
                "<base href=\"http://localhost:8080/\" target=\"_blank\"/>" +
                "<link href=\"https://getbootstrap.com//docs/5.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\" integrity=\"sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN\" crossorigin=\"anonymous\"/>" +
                "<style type=\"text/css\">" +
                "@page{ size: landscape</style>" +
                "</head>" +
                "<body>"
        );
        html.append("<div class=\"row py-2 mb-sm-3 bg-body-tertiary\">")
            .append("<div class=\"col-sm-6 mb-sm-1\">")
            .append("<span class=\"fw-bold\">Grade level</span>:")
            .append(courseDTO.getGradelevel().getDescription())
            .append("</div>")
            .append("<div class=\"col-sm-6 mb-sm-1 text-end\">")
            .append("<span class=\"fw-bold\">Hr/Qtr</span>:")
            .append(courseDTO.getHoursPerQuarter())
            .append("</div>")
            .append("<div class=\"col-sm-12 mb-sm-3\">")
            .append("<span class=\"fw-bold\">Subject</span>:")
            .append(courseDTO.getSubject())
            .append("</div>")
            .append("<div class=\"col-sm-12 mb-sm-1\"><span class=\"fw-bold\">Description</span></div>")
            .append("<div class=\"col-sm-12 mb-sm-2\">")
            .append(courseDTO.getCourseDescription())
            .append("</div>")
            .append("<div class=\"col-sm-12 mb-sm-2\"><span class=\"fw-bold\">Objectives</span></div>")
            .append("<div class=\"col-sm-12 mb-sm-3\"\">")
            .append(courseDTO.getCourseObjectives())
            .append("</div></div>")
            .append("<BR/>")
            .append("<div class=\"fw-bold text-center col-sm-12 mb-sm-2\">")
            .append(courseDTO.getSubject())
            .append("</div>")
            .append("<div class=\"fw-bold text-center col-sm-12 mb-sm-2\">SCOPE AND SEQUENCE</div>")
            .append("<BR/>")
            .append("<table class=\"table table-striped border\">")
            .append("<thead><tr>");
        for (QuarterDTO qtr : qtrList) {
            html.append("<th class=\"fw-bold text-center\">").append("Quarter ").append(qtr.getQuarter()).append("</th>");
        }
        html.append("</tr></thead>").append("<tbody class=\"table-group-divider\">").append("<tr>");
        for (QuarterDTO qtr : qtrList) {
            html.append("<td class=\"row\">");
            for (String topic : qtr.getTopics()) {
                html.append("<div class=\"col-sm-12\">").append(topic).append("</div>");
            }
            html.append("</td>");
        }
        html.append("</tr></tbody>").append("</table>").append("<BR/>");

        for (int i = 0; i < list.size(); i++) {
            CurriculumMappingReportRowDto dto = list.get(i);
            if (dto.getQuarterDTO() != null) {
                if (i != 0) {
                    html.append("</tbody>").append("</table>").append("<BR/>");
                }
                html.append("<table class=\"table table-striped border\">")
                    .append("<thead>")
                    .append("<tr><th class=\"text-center\">")
                    .append(
                        String.format(
                            "%s - %s - Quarter %d",
                            courseDTO.getSubject(),
                            courseDTO.getGradelevel().getDescription(),
                            dto.getQuarterDTO().getQuarter()
                        )
                    )
                    .append("</th></tr>")
                    .append("<tr><th class=\"text-center\">Curriculum Map</th></tr>")
                    .append("</thead></table>")
                    .append("<BR/>")
                    .append("<table class=\"table table-striped border\">")
                    .append("<thead><tr>")
                    .append("<th style=\"width: 100px\">")
                    .append("Time Frame")
                    .append("</th>")
                    .append("<th>")
                    .append("Topic")
                    .append("</th>")
                    .append("<th>")
                    .append("Content Standards")
                    .append("</th>")
                    .append("<th>")
                    .append("Performance Standards")
                    .append("</th>")
                    .append("<th>")
                    .append("Learning Competencies")
                    .append("</th>")
                    .append("<th>")
                    .append("Strategies")
                    .append("</th>")
                    .append("<th>")
                    .append("Assessment")
                    .append("</th>")
                    .append("</tr></thead>")
                    .append("<tbody class=\"table-group-divider\">");
            }
            html.append("<tr class=\"border-1\">")
                .append("<td>")
                .append(dto.getTimeFrame())
                .append("</td>")
                .append("<td>")
                .append(dto.getTopic())
                .append("</td>")
                .append("<td>")
                .append(dto.getContentStandards())
                .append("</td>")
                .append("<td>")
                .append(dto.getPerformaneStandards())
                .append("</td>")
                .append("<td>")
                .append(dto.getLearningCompetencies())
                .append("</td>")
                .append("<td>")
                .append(dto.getStrategies())
                .append("</td>")
                .append("<td>")
                .append(dto.getAssessment())
                .append("</td>")
                .append("</tr>");
        }

        html.append("</tbody>").append("</table>").append("</body></html>");
        //log.info(html.toString());

        ReportResponseDTO dto = null;
        try {
            dto = PdfConverter.htmlToPdf(
                String.format("course_%d_%d_%s", courseId, System.currentTimeMillis(), getFilename()),
                html.toString()
            );
            // PdfConverter.byteAryToFile(dto.getBinaryData(), dto.getFilename());
        } catch (Exception e) {
            dto = new ReportResponseDTO();
            log.error("Error: " + e.getMessage(), e);
        }

        return dto;
    }

    @Override
    public String getFilename() throws Exception {
        return "curr_map.pdf";
    }

    @Override
    public CurriculumMappingReportDetailDto getCurMapDetails(Long courseId) {
        return courseService
            .findOne(courseId)
            .map(courseDTO -> new CurriculumMappingReportDetailDto().courseDTO(courseDTO))
            .map(details -> details.setCurriculumMapDTOS(this.curriculumMapService.findByCourse(details.getCourseDTO().getId())))
            .map(details -> details.learningCompetencyDTOS(this.learningCompetencyService.findAllByCourse(details.getCourseDTO().getId())))
            .map(details -> details.strategiesDTOS(strategiesService.findAllByCourse(details.getCourseDTO().getId())))
            .map(details -> details.assessmentDTOS(assessmentService.findAllByCourse(details.getCourseDTO().getId())))
            .orElseThrow();
    }
}
