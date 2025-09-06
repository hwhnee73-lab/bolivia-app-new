package com.example.bolivia.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.crypto.SecretKey;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {

    private final SecretKey key;
    private final long accessTokenValidityInMilliseconds;
    private final long refreshTokenValidityInMilliseconds;
    private final String issuer;
    private final JwtParser parser;

    public JwtTokenProvider(@Value("${jwt.secret}") String secretKey,
                            @Value("${jwt.access-token-validity-in-seconds}") long accessTokenValidityInSeconds,
                            @Value("${jwt.refresh-token-validity-in-seconds}") long refreshTokenValidityInSeconds,
                            @Value("${jwt.issuer}") String issuer) {

        // 1) 시크릿이 Base64로 저장된 경우(권장)
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);

        // 2) 파서 필드 선언 및 초기화
        this.parser = Jwts.parserBuilder()
                .setSigningKey(this.key)
                .setAllowedClockSkewSeconds(90)
                .build();

        this.accessTokenValidityInMilliseconds = accessTokenValidityInSeconds * 1000;
        this.refreshTokenValidityInMilliseconds = refreshTokenValidityInSeconds * 1000;
        this.issuer = issuer;
    }

    public String generateAccessToken(UserDetails userDetails) {
        String authorities = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        Date now = new Date();
        Date validity = new Date(now.getTime() + this.accessTokenValidityInMilliseconds);

        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuer(issuer)
                .setIssuedAt(now)
                .claim("auth", authorities)
                .setExpiration(validity)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(UserDetails userDetails) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + this.refreshTokenValidityInMilliseconds);

        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuer(issuer)
                .setIssuedAt(now)
                // refresh에는 보통 권한 클레임을 넣지 않음
                .setExpiration(validity)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Authentication getAuthentication(String token) {
        Claims claims = parser.parseClaimsJws(token).getBody();

        String authClaim = claims.get("auth", String.class);
        Collection<? extends GrantedAuthority> authorities =
                (authClaim == null || authClaim.isBlank())
                        ? Collections.emptyList()
                        : Arrays.stream(authClaim.split(","))
                                .map(SimpleGrantedAuthority::new)
                                .collect(Collectors.toList());

        UserDetails principal = new User(claims.getSubject(), "", authorities);
        return new UsernamePasswordAuthenticationToken(principal, "", authorities);
    }

    public boolean validateToken(String token) {
        try {
            parser.parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            // 만료됨
            return false;
        } catch (JwtException | IllegalArgumentException e) {
            // 서명 불일치/변조/형식 오류 등
            return false;
        }
    }

    public String getSubject(String token) {
        return parser.parseClaimsJws(token).getBody().getSubject();
    }

    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
