package com.sis.service.util;

import com.sis.service.dto.ReportResponseDTO;
import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import org.apache.logging.log4j.util.Base64Util;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.xhtmlrenderer.layout.SharedContext;
import org.xhtmlrenderer.pdf.ITextRenderer;

@Component
public interface PdfConverter {
    public static ReportResponseDTO htmlToPdf(String filename, String html) throws IOException {
        Document document = Jsoup.parse(html, "UTF-8");
        document.outputSettings().syntax(Document.OutputSettings.Syntax.xml);

        String safeHtml = document.html();
        //        safeHtml = "<!DOCTYPE test [" +
        //            "  <!ENTITY nbsp \"&#160;\">" +
        //            "]>" + safeHtml;
        safeHtml =
            "<!DOCTYPE math " + "PUBLIC \"-//W3C//DTD MathML 3.0//EN\" " + "\"http://www.w3.org/Math/DTD/mathml3/mathml3.dtd\">" + safeHtml;

        ITextRenderer renderer = new ITextRenderer();

        SharedContext sharedContext = renderer.getSharedContext();
        sharedContext.setPrint(true);
        sharedContext.setInteractive(false);
        sharedContext.setReplacedElementFactory(new CustomElementFactoryImpl());

        renderer.setDocumentFromString(safeHtml);
        renderer.layout();

        ReportResponseDTO dto = null;
        try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
            renderer.createPDF(os);
            String base64 = Base64Util.encode(os.toString());
            byte[] byteAry = os.toByteArray();
            dto = new ReportResponseDTO(base64, byteAry, filename);
        }
        return dto;
    }

    // FIXME: temporary save to file
    public static void byteAryToFile(byte[] ary, String fileName) throws IOException {
        try (OutputStream os = Files.newOutputStream(Path.of(fileName))) {
            os.write(ary);
        }
    }
}
