package com.example.bolivia.security;

import com.example.bolivia.model.User;
import com.example.bolivia.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    public OAuth2SuccessHandler(JwtTokenProvider jwtTokenProvider, UserRepository userRepository) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
        // Frontend route to land after OAuth2
        setDefaultTargetUrl("/oauth2/success");
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2AuthenticationToken oauthToken = (authentication instanceof OAuth2AuthenticationToken)
                ? (OAuth2AuthenticationToken) authentication : null;
        if (oauthToken == null) {
            super.onAuthenticationSuccess(request, response, authentication);
            return;
        }

        OAuth2User oauthUser = oauthToken.getPrincipal();
        Map<String, Object> attrs = oauthUser.getAttributes();
        String email = attrs.get("email") != null ? String.valueOf(attrs.get("email")) : null;
        String name = attrs.get("name") != null ? String.valueOf(attrs.get("name")) : null;

        if (email == null) {
            // If email is unavailable, just continue without issuing tokens
            super.onAuthenticationSuccess(request, response, authentication);
            return;
        }

        // Provision or load existing user by email
        User user = userRepository.findByUsernameOrEmail(email, email).orElseGet(() -> {
            User u = new User();
            u.setEmail(email);
            u.setUsername(email);
            u.setDisplayName(name != null ? name : email);
            u.setRole(User.Role.RESIDENT);
            // Policy: newly provisioned OAuth2 users are PENDING by default
            u.setStatus(User.Status.PENDING);
            return userRepository.save(u);
        });

        // Issue refresh token cookie only (SPA will call /api/auth/refresh)
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/api/auth")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // Redirect to SPA success page
        super.onAuthenticationSuccess(request, response, authentication);
    }
}

