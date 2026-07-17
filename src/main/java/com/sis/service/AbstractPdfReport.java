package com.sis.service;

import com.itextpdf.html2pdf.HtmlConverter;
import com.sis.service.dto.AppConfigDTO;
import com.sis.service.dto.ReportResponseDTO;
import java.io.*;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

public abstract class AbstractPdfReport<T, P> implements PdfReport<T, P> {

    private static final Logger LOG = LoggerFactory.getLogger(AbstractPdfReport.class);

    public ReportResponseDTO getReport(P param) throws IOException, URISyntaxException {
        T data = getData(param);
        return this.createPdf(data);
    }

    public String getHtmlFromClasspath(T data) throws IOException, URISyntaxException {
        LOG.info("Class={}, PackageName={}", this.getClass(), this.getClass().getPackageName());
        LOG.info("TemplateFileName={}", this.getTemplateFileName());
        InputStream is = this.getClass().getClassLoader().getResourceAsStream(getTemplateFileName());
        Path filePath = Paths.get(this.getClass().getClassLoader().getResource(getTemplateFileName()).toURI());
        LOG.info("FilePath={}", filePath.toString());
        List<String> lines = Files.readAllLines(filePath);

        StringBuilder html = new StringBuilder();
        lines.forEach(val -> {
            String line = setLine(val, data);
            html.append(line);
        });
        return html.toString();
    }

    public String getHtmlFromTemplate(T data) throws IOException, URISyntaxException {
        TemplateEngine templateEngine = this.getTemplateEngine();
        Locale locale = Locale.forLanguageTag("en");
        Context context = new Context(locale);
        context.setVariable(getContextVariable(), data);

        String content = templateEngine.process(this.getTemplateName(), context);
        return content;
    }

    public String getHtmlFromAppConfig(T data, List<AppConfigDTO> list) {
        LOG.info("getHtmlFromAppConfig data={}", data);
        LOG.info("getHtmlFromAppConfig list={}", list);

        String templateHtml = list
            .stream()
            .map(dto -> dto.getJson())
            .collect(Collectors.joining());
        LOG.info("getHtmlFromAppConfig templateHtml={}", templateHtml);

        TemplateEngine templateEngine = this.getTemplateEngine();
        Locale locale = Locale.forLanguageTag("en");
        Context context = new Context(locale);
        context.setVariable("student", data);

        String renderedString = templateEngine.process(templateHtml, context);
        return renderedString;
    }

    public String getHtml(T data) throws IOException, URISyntaxException {
        AppConfigService appConfigService = getAppConfigService();
        List<AppConfigDTO> list = new ArrayList<>();
        if (getAppConfigKey() != null && !getAppConfigKey().isEmpty()) {
            list = appConfigService.findAll(new AppConfigDTO().code(getAppConfigKey()));
        }

        if (list.size() != 0) {
            return getHtmlFromAppConfig(data, list);
        } else if (getTemplateFileName() != null) {
            return getHtmlFromClasspath(data);
        } else if (getTemplateName() != null) {
            return getHtmlFromTemplate(data);
        }

        return "<html/>";
    }

    ReportResponseDTO createPdf(T data) throws IOException, URISyntaxException {
        ReportResponseDTO dto = null;
        try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
            HtmlConverter.convertToPdf(getHtml(data), os);
            String base64 = Base64.getEncoder().encodeToString(os.toByteArray());
            byte[] byteAry = os.toByteArray();
            dto = new ReportResponseDTO(base64, byteAry, getOutputFileName());

            //byteAryToFile(byteAry, getTemplateFileName() + "-" + getOutputFileName());
        }
        return dto;
    }

    // FIXME: temporary save to file
    public static void byteAryToFile(byte[] ary, String fileName) throws IOException {
        try (OutputStream os = new FileOutputStream(fileName)) {
            os.write(ary);
        }
    }
}
