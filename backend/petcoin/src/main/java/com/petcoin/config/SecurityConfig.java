package com.petcoin.config;

/*
 * @fileName : SecurityConfig
 * Spring Security 메인 설정
 * @author : heekyung
 * @since : 250828
 * @history
 * - 250828 | heekyung | phone 기반 폼 로그인 + BCrypt + 권한정책 적용
 */

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@Slf4j
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 프론트(다른 포트) 연동을 고려해 CORS 기본 허용
                .cors(Customizer.withDefaults())
                // SPA/JSON 기반이면 보통 CSRF 비활성
                .csrf(csrf -> csrf.disable())
                // URL 접근 권한 매핑
                .authorizeHttpRequests(auth -> auth
                        // 회원 관리 중 공개 API
                        .requestMatchers(
                                "/api/member/check", "/api/member/register", "/api/auth/**", "/login", "/logout",
                                "/css/**", "/js/**", "/images/**", "/favicon.ico", "/public/**"
                        ).permitAll()
                        // 관리자 전용
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        // 나머지는 인증 필요
                        .anyRequest().authenticated()
                )
                // 폼 로그인 (임시) 설정: username=phone, password=password 로 받음
                .formLogin(form -> form
                        .loginPage("/login")                // 커스텀 로그인 페이지 이동
                        .usernameParameter("phone")         // 기본 username -> phone으로
                        .passwordParameter("password")
                        .defaultSuccessUrl("/", true)       // 성공 후 이동 경로
                        .permitAll()

                )
                // 로그아웃
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login?logout")
                )
                // HTTP Basic은 사용 안 함 선언 -> 폼 로그인이나 JWT를 쓰기 때문에 기본 Basic은 꺼버림
                .httpBasic(b -> b.disable());

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
