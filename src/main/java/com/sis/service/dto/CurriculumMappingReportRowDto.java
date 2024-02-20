package com.sis.service.dto;

import java.util.List;

public class CurriculumMappingReportRowDto {

    QuarterDTO quarterDTO;

    private final String timeFrame;
    private final String topic;
    private final String contentStandards;
    private final String performaneStandards;
    private final String learningCompetencies;
    private final String strategies;
    private final String assessment;

    public CurriculumMappingReportRowDto(
        QuarterDTO quarterDTO,
        String timeFrame,
        String topic,
        String contentStandards,
        String performaneStandards,
        String learningCompetencies,
        String strategies,
        String assessment
    ) {
        this.quarterDTO = quarterDTO;
        this.timeFrame = timeFrame;
        this.topic = topic;
        this.contentStandards = contentStandards;
        this.performaneStandards = performaneStandards;
        this.learningCompetencies = learningCompetencies;
        this.strategies = strategies;
        this.assessment = assessment;
    }

    public QuarterDTO getQuarterDTO() {
        return quarterDTO;
    }

    public String getTimeFrame() {
        return timeFrame;
    }

    public String getTopic() {
        return topic;
    }

    public String getContentStandards() {
        return contentStandards;
    }

    public String getPerformaneStandards() {
        return performaneStandards;
    }

    public String getLearningCompetencies() {
        return learningCompetencies;
    }

    public String getStrategies() {
        return strategies;
    }

    public String getAssessment() {
        return assessment;
    }
}
