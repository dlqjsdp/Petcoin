package com.petcoin.dto;

import com.petcoin.constant.RequestStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/*
 * 포인트 환급 처리 요청용 DTO
 * 관리자 포인트 환급을 처리할 때 입력한 값을 담은 DTO
 * @author : sehui
 * @fileName : PointRequestProcessDto
 * @since : 250829
 */

@Getter
@Setter
@Builder
public class PointRequestProcessDto {

    private Long requestId;
    private RequestStatus requestStatus;
    private String note;
}
