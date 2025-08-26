package com.petcoin.constant;

/*
 * 키오스크 가동 상태 Enum
 * DB kiosk_run 테이블의 status 컬럼과 매핑되며, 한 번의 가동 이력(run)의 상태를 표현
 *
 * 사용 목적:
 * - MyBatis Mapper와 DB 연동 시 가동 상태값 관리
 * - 서비스/컨트롤러 단에서 세션(가동 이력) 상태 분기 처리
 *
 * 상태 정의:
 * - RUNNING   : 가동 중
 * - COMPLETED : 정상 완료
 * - CANCELLED : 사용자 중단/타임아웃/오류 등으로 취소 종료
 *
 * @author  : yukyeong
 * @fileName: RunStatus
 * @since   : 250826
 * @history
 *     - 250827 | yukyeong | Enum 최초 생성 (RUNNING, COMPLETED, CANCELLED)
 */

public enum RunStatus {
    RUNNING, COMPLETED, CANCELLED
}
