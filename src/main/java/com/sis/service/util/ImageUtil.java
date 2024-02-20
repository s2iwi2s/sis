package com.sis.service.util;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import javax.imageio.ImageIO;
import net.coobird.thumbnailator.Thumbnails;

public interface ImageUtil {
    static byte[] toThumbnail(byte[] document, String formatName, int targetHeight) throws IOException {
        BufferedImage bufferedImage = base64ToBufferedImage(document);
        bufferedImage = resizeImage(bufferedImage, formatName, targetHeight);
        return bufferedImageToByteArray(bufferedImage, formatName);
    }

    static BufferedImage base64ToBufferedImage(byte[] imageData) throws IOException {
        try (InputStream inputStream = new ByteArrayInputStream(imageData)) {
            return ImageIO.read(inputStream);
        }
    }

    static BufferedImage resizeImage(BufferedImage originalImage, String outputFormat, int targetHeight) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Thumbnails.of(originalImage).height(targetHeight).outputFormat(outputFormat).outputQuality(0.90).toOutputStream(outputStream);
        byte[] data = outputStream.toByteArray();
        try (ByteArrayInputStream inputStream = new ByteArrayInputStream(data)) {
            return ImageIO.read(inputStream);
        }
    }

    static byte[] bufferedImageToByteArray(BufferedImage bufferedImage, String formatName) throws IOException {
        try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
            ImageIO.write(bufferedImage, formatName, os);
            return os.toByteArray();
        }
    }
}
