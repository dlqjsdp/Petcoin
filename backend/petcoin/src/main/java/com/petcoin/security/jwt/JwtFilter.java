package com.petcoin.security.jwt;

/*
 * @fileName : JwtFilter
 * 모든 HTTP 요청마다 실행되는 시큐리티 필터
 * @author : heekyung
 * @since : 250829
 * @history
 * - 250829 | heekyung | JWT 필터 코드 작성
 * - 250904 | heekyung | memberId/phone/role을 Principal로 저장되도록 개선
 */

import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component //빈 등록
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider; //토큰 유틸

    @Override
    protected void doFilterInternal(HttpServletRequest request, //들어온 요청
                                    HttpServletResponse response, //나가는 응답
                                    FilterChain filterChain)  //다음에 실행된 필터들을 이어주는 연결 고리
            throws SecurityException, IOException, ServletException {

        //1. Authorization 헤더 추출
        String authHeader = request.getHeader("Authorization");

        //2. Bearer <token> 형식인지 확인
             if (authHeader != null && authHeader.startsWith("Bearer ")) {

                 String token = authHeader.substring(7); //Bearer 이후 토큰만 추출

                 //3. 토큰 유효성 검사
                 if (jwtTokenProvider.validateToken(token)) {
                     //4. 주체(phone) 꺼내기
                     String phone = jwtTokenProvider.getPhone(token);
                     //5. 권한 클레임 꺼내기
                     String role = Jwts.parserBuilder()
                             .setSigningKey(jwtTokenProvider.getSecretBytes()) //서명키
                             .build()
                             .parseClaimsJws(token)
                             .getBody()
                             .get("role", String.class); //user or admin 같은 문자열

                     //6. 토큰에서 memberId 호출
                     Long memberId = jwtTokenProvider.getMemberId(token);

                     //7. ROLE_ 붙이기
                     var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));

                     //8. Principal(현재 로그인 사용자 최소 정보) 구성
                     Principal.MemberPrincipal principal = new Principal.MemberPrincipal(memberId, phone, role);

                     //9. 인증 객체 생성 (principal + 권한, 자격증명은 null)
                     Authentication auth =
                             new UsernamePasswordAuthenticationToken(principal, null, authorities);

                     //10. 현재 스레드의 SecurityContext 에 인증 저장
                     SecurityContextHolder.getContext().setAuthentication(auth);
                 }
             }
             //9. 다음 필터로 연결
             filterChain.doFilter(request, response);
    }

}
