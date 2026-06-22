package com.sis.service.dto;

import java.util.List;
import java.util.stream.Collectors;

public class CurriculumMappingReportDetailDto {

    private CourseDTO courseDTO;

    private List<CurriculumMapDTO> curriculumMapDTOS;

    public CourseDTO getCourseDTO() {
        return courseDTO;
    }

    public CurriculumMappingReportDetailDto courseDTO(Long courseId) {
        this.courseDTO = new CourseDTO().id(courseId);
        return this;
    }

    public CurriculumMappingReportDetailDto courseDTO(CourseDTO courseDTO) {
        this.courseDTO = courseDTO;
        return this;
    }

    public List<CurriculumMapDTO> getCurriculumMapDTOS() {
        return curriculumMapDTOS;
    }

    public CurriculumMappingReportDetailDto setCurriculumMapDTOS(List<CurriculumMapDTO> curriculumMapDTOS) {
        this.curriculumMapDTOS = curriculumMapDTOS;
        return this;
    }

    public CurriculumMappingReportDetailDto learningCompetencyDTOS(List<LearningCompetencyDTO> learningCompetencyDTOS) {
        curriculumMapDTOS.forEach(dto -> {
            dto.setLearningCompetencyDTOS(
                learningCompetencyDTOS
                    .stream()
                    .filter(l -> l.getCurriculumMap().getId().longValue() == dto.getId().longValue())
                    .collect(Collectors.toList())
            );
        });
        return this;
    }

    public CurriculumMappingReportDetailDto strategiesDTOS(List<StrategiesDTO> strategiesDTOS) {
        curriculumMapDTOS.forEach(cm -> {
            cm
                .getLearningCompetencyDTOS()
                .forEach(l ->
                    l.setStrategiesDTOS(
                        strategiesDTOS
                            .stream()
                            .filter(s -> s.getLearningCompetency().getId().longValue() == l.getId().longValue())
                            .collect(Collectors.toList())
                    )
                );
        });
        return this;
    }

    public CurriculumMappingReportDetailDto assessmentDTOS(List<AssessmentDTO> assessmentDTOS) {
        curriculumMapDTOS.forEach(cm -> {
            cm
                .getLearningCompetencyDTOS()
                .forEach(l ->
                    l.setAssessmentDTOS(
                        assessmentDTOS
                            .stream()
                            .filter(a -> a.getLearningCompetency().getId().longValue() == l.getId().longValue())
                            .collect(Collectors.toList())
                    )
                );
        });
        return this;
    }
}
