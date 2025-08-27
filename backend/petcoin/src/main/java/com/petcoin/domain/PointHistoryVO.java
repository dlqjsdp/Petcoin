package com.petcoin.domain;

import com.petcoin.constant.ActionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/*
 * 포인트 내역 VO
 * @author : sehui
 * @fileName : PointHistoryVO
 * @since : 250827
 * @history
 *  - 250827 | sehui | 포인트 내역 VO 생성
 */

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PointHistoryVO {

    private Long historyId;         //포인트 내역 ID
    private Long memberId;          //회원 ID
    private int pointChange;        //포인트 변화량
    private int pointBalance;       //포인트 잔액
    private ActionType actionType;      //거래 유형
    private String description;         //거래 상세 설명
    private LocalDateTime createdAt;     //거래 일자
}
