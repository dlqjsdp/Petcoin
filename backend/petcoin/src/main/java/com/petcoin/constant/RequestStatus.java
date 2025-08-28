package com.petcoin.constant;

/*
 * 포인트 환급 요청 진행 상태 Enum
 * @author : sehui
 * @fileName : RequestStatus
 * @since : 250828
 * @history
 *  - 250828 | sehui | 포인트 환급 요청 진행 상태 Enum 생성
 */

public enum RequestStatus {
    PENDING,        //환급 요청 접수(대기 중)
    APPROVED,       //환급 요청 승인
    COMPLETED,      //환급 실제로 처리 완료
    REJECTED        //환급 요청 거절
}
