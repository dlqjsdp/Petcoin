package com.petcoin.config;

/*
 * @fileName : SecurityConfig
 * Spring Security 메인 설정
 * @author : heekyung
 * @since : 250828
 * @history
 * - 250828 | heekyung | phone 기반 폼 로그인 + BCrypt + 권한정책 적용
 * - 250828 | heekyung | 세션 끄고, 관리자 URL 보호 & JWT 필터 등록
 * - 250910 | heekyung | 위치 검색 기능 권한 추가
 */

import com.petcoin.security.jwt.JwtFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Slf4j
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 프론트(다른 포트) 연동을 고려해 CORS 기본 허용
                .cors(Customizer.withDefaults())
                // REST API에서는 보통 CSRF 비활성화
                .csrf(csrf -> csrf.disable())
                // 서버 세션을 전혀 사용하지 않음(JWT로만 인증 유지)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // URL 접근 권한 매핑
                .authorizeHttpRequests(auth -> auth
                        // 공개 API (로그인/토큰 발급/회원확인 등)
                        .requestMatchers(
                                "/api/member/check", "/api/member/register", "/api/auth/**", "/login", "/logout",
                                "/css/**", "/js/**", "/images/**", "/favicon.ico", "/public/**",
                                "/api/locations/**"
                        ).permitAll()
                        //키오스크 종료시 플라스크에서 end api 호출
                        .requestMatchers("/api/kiosk-runs/**").permitAll()
                        // 관리자 전용
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/prediction/save").permitAll()
                        // 나머지는 인증 필요
                        .anyRequest().authenticated()
                )
                // 인증/인가 실패 시 “리다이렉트 대신 JSON으로 에러 노출
                .exceptionHandling(e -> e
                        .authenticationEntryPoint((req, res, ex) -> {
                            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            res.setContentType("application/json;charset=UTF-8");
                            res.getWriter().write("{\"message\":\"Unauthorized\"}");
                        })
                        .accessDeniedHandler((req, res, ex) -> {
                            res.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            res.setContentType("application/json;charset=UTF-8");
                            res.getWriter().write("{\"message\":\"Forbidden\"}");
                        })
                )
                // 폼 로그인/로그아웃/HTTP Basic 전부 비활성화 (JWT만 사용)
                .formLogin(f -> f.disable())
                .logout(logout -> logout
                        .logoutUrl("/logout")                  // 로그아웃 요청 URL
                        .logoutSuccessHandler((req, res, auth) -> {
                            res.setContentType("application/json;charset=UTF-8");
                            res.getWriter().write("{\"message\":\"Logged out\"}");
                        })
                        .invalidateHttpSession(false)          // 세션은 사용하지 않으므로 false
                )
                .httpBasic(b -> b.disable());


        // JwtFilter가 먼저 실행되도록 등록
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    //AuthenticationManager 주입이 필요할 때 사용
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration conf) throws Exception {
        return conf.getAuthenticationManager();
    }

    // 비밀번호 암호화
    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    // CORS 설정 명시적으로 열어두기 -> 전역 CORS 소스가 없을 때 동작하지 않을 수 있음
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration c = new CorsConfiguration();
        c.setAllowedOrigins(List.of("http://localhost:3000", // VSCode React dev 서버
                                    "http://192.168.10.72:3000"  )); // 아이패드에서 접근하는 주소 추가
        c.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
        c.setAllowedHeaders(List.of("*"));
        c.setExposedHeaders(List.of("Authorization", "Content-Type"));
        c.setAllowCredentials(true); // 필요 시
        UrlBasedCorsConfigurationSource s = new UrlBasedCorsConfigurationSource();
        s.registerCorsConfiguration("/**", c);
        return s;
    }
}
