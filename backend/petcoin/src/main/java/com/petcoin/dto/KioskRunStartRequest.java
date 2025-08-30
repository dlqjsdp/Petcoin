package com.petcoin.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

/*
 * 키오스크 실행 시작 요청 DTO
 * - 키오스크 화면에서 "시작하기" 눌렀을 때 서버로 전송
 * - 서버는 kiosk_run 테이블에 RUNNING 세션 생성
 *
 * 필드:
 * - kioskId  : 키오스크 식별자(PK) - 필수
 * - memberId : 사용자 식별자(로그인 사용 시), 게스트면 null 허용
 *
 * @author  : yukyeong
 * @fileName: KioskRunStartRequest
 * @since   : 250826
 * @history
 *   - 250826 | yukyeong | DTO 최초 생성
 */

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class KioskRunStartRequest {

    @NotNull(message = "kioskId는 필수입니다.")
    private Long kioskId;

    // 비회원 허용
    private Long memberId;

}
