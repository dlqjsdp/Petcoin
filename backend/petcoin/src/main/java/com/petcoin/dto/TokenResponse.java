package com.petcoin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
 * @fileName : TokenResponse
 * 로그인 진행 시 프론트로 내려줄 액세스 토큰 응답 DTO
 * @author : heekyung
 * @since : 250829
 * @history
 * - 250829 | heekyung | 토큰 전용 DTO 생성
 */

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TokenResponse {

    private String token; //Bearer
    private String accessToken; //JWT 문자열
    private long expiresIn; //유효기간
}
