package com.petcoin.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/*
 * WebConfig.java
 * - Spring Boot 전역 CORS 설정 클래스
 * - 프론트엔드(React)와 백엔드(Spring Boot) 간 통신 시
 *   서로 다른 포트/도메인에서 발생하는 CORS(Cross-Origin Resource Sharing) 문제를 해결
 *
 * 주요 기능:
 *   - "/api/**" 경로로 들어오는 요청에 대해 CORS 허용
 *   - 허용 Origin:
 *       • http://localhost:3000        → 로컬 개발 환경(PC 브라우저)
 *       • http://192.168.10.72:3000    → 동일 네트워크의 아이패드(테스트용)
 *   - 허용 Methods: GET, POST, PUT, DELETE, OPTIONS
 *   - 허용 Headers: 모든 요청 헤더("*")
 *   - allowCredentials(true): 인증 정보(쿠키, 세션 등) 포함한 요청 허용
 *
 * 주의사항:
 *   - allowCredentials(true) 사용 시 allowedOrigins("*") 와일드카드 불가
 *   - 운영 배포 시 실제 프론트엔드 도메인(예: https://petcoin.com)으로 수정 필요
 *
 * @fileName: WebConfig.java
 * @author  : yukyeong
 * @since   : 250902
 * @history
 *   - 250902 | yukyeong | CORS 기본 설정 추가 - 로컬(3000) 및 아이패드 테스트 IP 허용, allowCredentials 활성화
 */

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                        "http://localhost:3000",
                        "http://192.168.10.72:3000" // ← 아이패드가 보는 프론트 주소
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*") // 모든 요청 헤더 허용
                .allowCredentials(true); // 쿠키·세션 등 인증 정보 허용
    }
}
