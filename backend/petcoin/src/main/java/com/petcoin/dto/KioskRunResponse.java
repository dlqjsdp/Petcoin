package com.petcoin.dto;

import com.petcoin.constant.RunStatus;
import lombok.*;

import java.time.LocalDateTime;

/*
 * 키오스크 가동 이력 응답 DTO
 * - 시작/종료 직후 키오스크에 내려주거나
 * - 관리자 페이지에서 로그 목록/상세 조회 시 사용
 *
 * 필드:
 * - runId : 실행 세션 PK
 * - kioskId : 키오스크 FK
 * - memberId : 사용자 FK(null 가능)
 * - phone : 회원 연락처 (비회원일 경우 null)
 * - status : RUNNING / COMPLETED / CANCELLED
 * - startedAt : 시작 시각
 * - endedAt : 종료 시각(null 가능)
 *
 * @author  : yukyeong
 * @fileName: KioskRunResponse
 * @since   : 250826
 * @history
 *   - 250826 | yukyeong | DTO 최초 생성
 *   - 250827 | yukyeong | 단건조회에서 핸드폰번호 조회를 위해 phone 추가
 */

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class KioskRunResponse {

    private Long runId;
    private Long kioskId;
    private Long memberId;
    private String phone;
    private RunStatus status;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;
    private int totalPet;   //이지혜 totalPet 추가

}
