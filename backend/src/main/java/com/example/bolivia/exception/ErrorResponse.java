package com.example.bolivia.exception;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

// 표준 에러 응답 DTO
public class ErrorResponse {
    private final String timestamp; // ISO-8601 UTC
    private final int status;
    private final String error;
    private final String message;
    private final String path;

    public ErrorResponse(int status, String error, String message, String path) {
        this.timestamp = OffsetDateTime.now(ZoneOffset.UTC).toString();
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }

    public String getTimestamp() { return timestamp; }
    public int getStatus() { return status; }
    public String getError() { return error; }
    public String getMessage() { return message; }
    public String getPath() { return path; }
}

