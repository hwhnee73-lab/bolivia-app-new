package com.bolivia.app.exception;

/**
 * 중복된 리소스가 이미 존재할 때 발생하는 예외.
 * GlobalExceptionHandler에서 409 Conflict로 매핑됩니다.
 */
public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String message) {
        super(message);
    }

    public DuplicateResourceException(String resourceName, String identifier) {
        super(resourceName + " 이(가) 이미 존재합니다: " + identifier);
    }
}
