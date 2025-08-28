package com.petcoin.dto;

import com.petcoin.constant.RequestStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/*
 * 포인트 환급 요청 정보 DTO
 * 사용자가 입력한 값과 관리자 페이지에서 정보를 보여주기 위한 용도
 * @author : sehui
 * @fileName : PointRequestDto
 * @since : 250828
 */

@Data
@Builder
public class PointRequestDto {

    private Long requestId;         //포인트 환급 요청 ID
    private Long memberId;          //회원 ID
    private String phone;           //연락처
    private int requestAmount;      //환급 요청 금액
    private String bankName;        //은행명
    private String accountNumber;       //계좌번호
    private String accountHolder;       //예금주명
    private RequestStatus requestStatus;        //요청 진행 상태
    private LocalDateTime requestAt;            //요청 시각
    private LocalDateTime processedAt;          //요청 처리 완료 시각
    private String note;            //요청 처리 사유
}
