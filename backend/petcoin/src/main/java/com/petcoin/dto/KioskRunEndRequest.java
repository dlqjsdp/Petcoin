package com.petcoin.dto;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/*
 * 키오스크 실행 종료 요청 DTO
 * - 사용자는 종료 버튼만 누름 → 서버가 사유는 내부 로직으로 판단
 *
 * 필드:
 * - runId   : 종료할 실행 세션 ID - 필수
 *
 * @author  : yukyeong
 * @fileName: KioskRunEndRequest
 * @since   : 250826
 * @history
 *   - 250826 | yukyeong | DTO 최초 생성
 */

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class KioskRunEndRequest {

    @NotNull
    private Long runId;

    private int totalPet;//이지혜 totalPet 추가

}
