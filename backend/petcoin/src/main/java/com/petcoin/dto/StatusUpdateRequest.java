package com.petcoin.dto;

import com.petcoin.constant.KioskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * 키오스크 상태 변경 요청 DTO
 * 프론트엔드에서 보낸 status 값을 매핑
 *
 * 예시 JSON:
 * {
 *   "status": "ONLINE" | "MAINT" | "OFFLINE"
 * }
 *
 * @author : yukyeong
 * @fileName : StatusUpdateRequest
 * @since  : 250911
 * @history
 *  - 250911 | yukyeong | 최초 생성 - 키오스크 상태 변경 요청 DTO 정의
 */

@Getter @Setter
public class StatusUpdateRequest {

    @NotNull(message = "상태값은 필수입니다.")
    private KioskStatus status; // ONLINE | MAINT | OFFLINE

}
