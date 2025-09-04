package com.petcoin.security.jwt;

import com.petcoin.constant.Role;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Date;

/*
 * @fileName : JwtTokenProvider
 * 토큰 생성, 유효성 검사 토큰에서 꺼내기 등의 역할을 수행
 * @author : heekyung
 * @since : 250829
 * @history
 * - 250829 | heekyung | JWT 액세스 토큰 생성, 검증, 추출 코드 작성
 * - 250904 | heekyung | 로그인 후 API에서 특정 회원을 조회(마이페이지 등)하려면 고유 ID 필요로 memberId 추가
 */

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secret; //서명용 비밀키

    @Value("${jwt.access-validity-seconds}")
    private long validitySeconds; //토큰 유효시간

    //토큰 생성
    public String createToken(String phone, String role, Long memberId) {
        Date now = new Date(); //토큰 발급 시간
        Date expiryDate = new Date(now.getTime() + validitySeconds * 1000); //토큰 만료 시간

        return Jwts.builder()
                .setSubject(phone) //로그인 식별
                .claim("role", role) //역할 : user or admin
                .claim("memberId", memberId)
                .setIssuedAt(now) //발급 시간
                .setExpiration(expiryDate) //만료 시간
                .signWith( //서명 설정
                        Keys.hmacShaKeyFor(secret.getBytes()), //서버가 가진 비밀키
                        SignatureAlgorithm.HS256 //해시 알고리즘 지정
                )
                .compact(); //최종적으로 문자열 토큰 생성
    }

    //토큰에서 주체(phone) 꺼내기
    public String getPhone(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secret.getBytes()) //검증, 파싱용 서명키
                .build()
                .parseClaimsJws(token) //서명 검증 + 파싱
                .getBody()
                .getSubject(); //주체 반환
    }
    
    // 토큰에서 memberId 꺼내기
    public Long getMemberId(String token) {
        // 1. 빌더 생성
        Object raw = Jwts.parserBuilder()
                // 2. 비밀키 설정
                .setSigningKey(secret.getBytes())
                .build()
                // 3. 서명/만료 검증
                .parseClaimsJws(token)
                .getBody()
                .get("memberId");
        // claim이 존재하지 않으면 null 반환
        if (raw == null) return null;

        // 숫자 타입이면 공통 Number로 받아 Long로 변환
        if (raw instanceof Number n) return n.longValue();

        // 그 외의 값음 문자열로 변한 후 Long으로 파싱
        return Long.valueOf(raw.toString());
    }
    
    //토큰 유효성 검사(서명, 만료 등)
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(secret.getBytes()).build().parseClaimsJws(token);
            return true; //파싱, 검증 통과
        } catch (Exception e) {
            return false; //토큰 만료, 형식오류 등
        }
    }

    //다른 클래스에서 JwtTokenProvider가 가진 secret을 안전하게 가져다가 쓰도록 도와줌
    public byte[] getSecretBytes() {
        return secret.getBytes(StandardCharsets.UTF_8);
    }

    //만료시간(초) 노출
    public long getValiditySeconds() {
        return validitySeconds;
    }
}
