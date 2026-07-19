package com.sis.service.util;

import com.lowagie.text.Image;
import java.io.FileInputStream;
import java.io.InputStream;
import java.net.URL;
import org.apache.commons.io.IOUtils;
import org.w3c.dom.Element;
import org.xhtmlrenderer.extend.FSImage;
import org.xhtmlrenderer.extend.ReplacedElement;
import org.xhtmlrenderer.extend.ReplacedElementFactory;
import org.xhtmlrenderer.extend.UserAgentCallback;
import org.xhtmlrenderer.layout.LayoutContext;
import org.xhtmlrenderer.pdf.ITextFSImage;
import org.xhtmlrenderer.pdf.ITextImageElement;
import org.xhtmlrenderer.render.BlockBox;
import org.xhtmlrenderer.simple.extend.FormSubmissionListener;

public class CustomElementFactoryImpl implements ReplacedElementFactory {

    @Override
    public ReplacedElement createReplacedElement(LayoutContext lc, BlockBox box, UserAgentCallback uac, int cssWidth, int cssHeight) {
        Element e = box.getElement();
        String nodeName = e.getNodeName();
        if (nodeName.equals("img")) {
            String imagePath = e.getAttribute("src");
            try {
                InputStream input = new URL("http://localhost:8080/" + imagePath).openStream();
                byte[] bytes = input.readAllBytes();
                Image image = Image.getInstance(bytes);
                FSImage fsImage = new ITextFSImage(image);
                fsImage.scale(cssWidth, cssHeight);
                return new ITextImageElement(fsImage);
            } catch (Exception e1) {
                e1.printStackTrace();
            }
        }
        return null;
    }

    @Override
    public void reset() {}

    @Override
    public void remove(Element e) {}

    @Override
    public void setFormSubmissionListener(FormSubmissionListener listener) {}
}
