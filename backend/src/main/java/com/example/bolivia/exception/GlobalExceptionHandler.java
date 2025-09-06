package com.example.bolivia.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ErrorResponse> handleCustomException(CustomException e, HttpServletRequest req) {
        ErrorCode code = e.getErrorCode();
        ErrorResponse body = new ErrorResponse(code.getStatus().value(), code.getStatus().getReasonPhrase(), code.getMessage(), req.getRequestURI());
        return new ResponseEntity<>(body, code.getStatus());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException e, HttpServletRequest req) {
        HttpStatus status = HttpStatus.UNAUTHORIZED;
        ErrorResponse body = new ErrorResponse(status.value(), status.getReasonPhrase(), "Invalid credentials", req.getRequestURI());
        return new ResponseEntity<>(body, status);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException e, HttpServletRequest req) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        String msg = e.getBindingResult().getAllErrors().stream().findFirst().map(err -> err.getDefaultMessage()).orElse("Validation failed");
        ErrorResponse body = new ErrorResponse(status.value(), status.getReasonPhrase(), msg, req.getRequestURI());
        return new ResponseEntity<>(body, status);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException e, HttpServletRequest req) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        ErrorResponse body = new ErrorResponse(status.value(), status.getReasonPhrase(), e.getMessage(), req.getRequestURI());
        return new ResponseEntity<>(body, status);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception e, HttpServletRequest req) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        ErrorResponse body = new ErrorResponse(status.value(), status.getReasonPhrase(), "Internal server error", req.getRequestURI());
        return new ResponseEntity<>(body, status);
    }
}
