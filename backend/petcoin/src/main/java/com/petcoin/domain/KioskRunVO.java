package com.petcoin.domain;

import com.petcoin.constant.RunStatus;
import lombok.*;

import java.time.LocalDateTime;

/*
 * 키오스크 가동 이력 VO
 * DB kiosk_run 테이블과 매핑
 *
 * 필드 설명:
 * - runId : 세션 PK
 * - kioskId : 키오스크 FK
 * - memberId : 사용자 FK
 * - status : 동작 상태(RUNNING/COMPLETED/CANCELLED) - Enum 매핑
 * - startedAt : 시작 일시
 * - endedAt : 종료 일시(null 가능)
 *
 * @author  : yukyeong
 * @fileName: KioskRunVO
 * @since   : 250826
 * @history
 *     - 250826 | yukyeong | VO 최초 생성
 *     - 250827 | yukyeong | startedAt, endedAt 필드명 수정
 */

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class KioskRunVO {

    private Long runId;
    private Long kioskId;
    private Long memberId;
    private RunStatus status;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;

}
