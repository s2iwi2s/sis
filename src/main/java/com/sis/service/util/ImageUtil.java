package com.sis.service.util;

import com.sis.service.dto.ResourcesDTO;
import net.coobird.thumbnailator.Thumbnails;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;

public interface ImageUtil {

    public static byte[] toThumbnail(byte[] document, String formatName, int targetHeight) throws IOException {
        BufferedImage bufferedImage = ImageUtil.base64ToBufferedImage(document);
        bufferedImage = ImageUtil.resizeImage(bufferedImage, formatName,targetHeight);
        ByteArrayOutputStream os = new ByteArrayOutputStream();

        ImageIO.write(bufferedImage, formatName, os);
//        String result = Base64.getEncoder().encodeToString(os.toByteArray());
//        byte[] result = Base64.getEncoder().encodeToString(os.toByteArray()).getBytes();
        return os.toByteArray();
    }

    static BufferedImage base64ToBufferedImage(byte[] imageData) throws IOException {
        InputStream inputStream = new ByteArrayInputStream(imageData);
        return ImageIO.read(inputStream);
    }

    static BufferedImage resizeImage(BufferedImage originalImage, String outputFormat, int targetHeight) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Thumbnails.of(originalImage)
//            .size(targetWidth, targetHeight)
            .height(targetHeight)
            .outputFormat(outputFormat) // JPEG
            .outputQuality(0.90)
            .toOutputStream(outputStream);
        byte[] data = outputStream.toByteArray();
        ByteArrayInputStream inputStream = new ByteArrayInputStream(data);
        return ImageIO.read(inputStream);
    }
}
