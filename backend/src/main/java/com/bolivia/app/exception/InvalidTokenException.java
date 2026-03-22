package com.bolivia.app.exception;

/**
 * JWT 토큰이 유효하지 않거나 만료되었을 때 발생하는 예외.
 * GlobalExceptionHandler에서 401 Unauthorized로 매핑됩니다.
 */
public class InvalidTokenException extends RuntimeException {

    public InvalidTokenException(String message) {
        super(message);
    }

    public InvalidTokenException(String message, Throwable cause) {
        super(message, cause);
    }
}
