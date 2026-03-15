package com.bolivia.app.exception;

/**
 * 요청한 리소스를 찾을 수 없을 때 발생하는 예외.
 * GlobalExceptionHandler에서 404 Not Found로 매핑됩니다.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resourceName, Long id) {
        super(resourceName + "을(를) 찾을 수 없습니다: " + id);
    }
}
