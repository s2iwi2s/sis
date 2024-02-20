package com.sis.service.dto;

import java.util.List;

public class QuarterDTO {

    public QuarterDTO(Integer quarter, List<String> topics) {
        this.quarter = quarter;
        this.topics = topics;
    }

    private Integer quarter;
    private List<String> topics;

    public Integer getQuarter() {
        return quarter;
    }

    public List<String> getTopics() {
        return topics;
    }
}
