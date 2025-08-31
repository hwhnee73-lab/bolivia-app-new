package com.example.bolivia.exception;

// 클라이언트에게 반환될 표준 에러 응답 형식 DTO
public class ErrorResponse {
    private int status;
    private String message;

    public ErrorResponse(int status, String message) {
        this.status = status;
        this.message = message;
    }

    // Getter
    public int getStatus() { return status; }
    public String getMessage() { return message; }
}
