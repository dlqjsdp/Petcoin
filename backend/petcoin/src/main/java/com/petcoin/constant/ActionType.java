package com.petcoin.constant;

/*
 * 포인트 거래 유형 Enum
 * @author : sehui
 * @fileName : ActionType
 * @since : 250827
 * @history
 *  - 250827 | sehui | 포인트 거래 유형 Enum 생성
 */

public enum ActionType {
    EARN,   //포인트 지급
    USE,    //포인트 사용(환급 처리)
    ADJUST  //오류나 포인트 조정
}
