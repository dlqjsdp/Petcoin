package com.petcoin.domain;

import com.petcoin.constant.RequestStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/*
 * 포인트 환급 요청 VO
 * @author : sehui
 * @fileName : PointReqVO
 * @since : 250828
 * @history
 *  - 250828 | sehui | 포인트 환급 요청 VO 생성
 */

@Data
@Builder
public class PointReqVO {

    private Long requestId;         //포인트 환급 요청 ID
    private Long memberId;      //회원 ID
    private int requestAmount;      //환급 요청 금액
    private String bankName;        //은행명
    private String accountNumber;       //계좌번호
    private String accountHolder;       //예금주명
    private RequestStatus requestStatus;        //요청 진행 상태
    private LocalDateTime requestAt;            //요청 시각
    private LocalDateTime processedAt;          //요청 처리 완료 시각
    private String note;            //요청 처리 사유
}
