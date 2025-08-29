package com.petcoin.config;

/*
 * @fileName : SecurityConfig
 * Spring Security 메인 설정
 * @author : heekyung
 * @since : 250828
 * @history
 * - 250828 | heekyung | phone 기반 폼 로그인 + BCrypt + 권한정책 적용
 * - 250828 | heekyung | 세션 끄고, 관리자 URL 보호 & JWT 필터 등록
 */

import com.petcoin.security.jwt.JwtFilter;
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
                                "/css/**", "/js/**", "/images/**", "/favicon.ico", "/public/**"
                        ).permitAll()
                        // 관리자 전용
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        // 나머지는 인증 필요
                        .anyRequest().authenticated()
                )
                // 폼 로그인/로그아웃/HTTP Basic 전부 비활성화 (JWT만 사용)
                .formLogin(f -> f.disable())
                .logout(l -> l.disable())
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
}
