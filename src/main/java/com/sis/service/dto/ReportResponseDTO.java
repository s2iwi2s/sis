package com.sis.service.dto;

public class ReportResponseDTO {

    private String base64Data;
    private byte[] binaryData;
    private String filename;

    public ReportResponseDTO() {}

    public ReportResponseDTO(String base64Data, byte[] binaryData, String filename) {
        this.base64Data = base64Data;
        this.binaryData = binaryData;
        this.filename = filename;
    }

    public String getBase64Data() {
        return base64Data;
    }

    public void setBase64Data(String base64Data) {
        this.base64Data = base64Data;
    }

    public byte[] getBinaryData() {
        return binaryData;
    }

    public void setBinaryData(byte[] binaryData) {
        this.binaryData = binaryData;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    @Override
    public String toString() {
        return "ReportResponseDTO{" + "filename='" + filename + '\'' + '}';
    }
}
