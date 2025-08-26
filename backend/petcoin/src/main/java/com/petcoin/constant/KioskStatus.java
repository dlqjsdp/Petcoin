package com.petcoin.constant;

/*
 * 키오스크 상태 Enum
 * DB kiosk 테이블의 status 컬럼과 매핑되며, 키오스크 장치의 현재 동작 상태를 표현
 *
 * 사용 목적:
 * - MyBatis Mapper와 DB 연동 시 상태값 관리
 * - 서비스/컨트롤러 단에서 키오스크 온라인/오프라인/점검 상태 분기 처리
 *
 * 상태 정의:
 * - ONLINE  : 정상 동작 중
 * - OFFLINE : 네트워크 연결 해제 또는 비가동 상태
 * - MAINT   : 점검/업데이트 등 유지보수 상태
 *
 * @author  : yukyeong
 * @fileName: KioskStatus
 * @since   : 250826
 * @history
 *     - 250826 | yukyeong | Enum 최초 생성 (ONLINE, OFFLINE, MAINT)
 */

public enum KioskStatus {
    ONLINE, OFFLINE, MAINT
}
