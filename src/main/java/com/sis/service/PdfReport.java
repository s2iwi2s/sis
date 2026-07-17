package com.sis.service;

import com.sis.service.dto.ReportResponseDTO;
import java.io.IOException;
import java.net.URISyntaxException;
import org.thymeleaf.spring6.SpringTemplateEngine;

public interface PdfReport<T, P> {
    SpringTemplateEngine getTemplateEngine();

    String getContextVariable();

    ReportResponseDTO getReport(P param) throws IOException, URISyntaxException;

    T getData(P params);

    AppConfigService getAppConfigService();
    String getAppConfigKey();

    String getHtml(T data) throws IOException, URISyntaxException;

    String setLine(String line, T data);

    String getTemplateFileName();

    String getTemplateName();

    String getOutputFileName();
}
