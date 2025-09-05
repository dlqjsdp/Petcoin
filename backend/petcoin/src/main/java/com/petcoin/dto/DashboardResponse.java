package com.petcoin.dto;

import lombok.Getter;
import lombok.ToString;

import java.util.List;

/*
 * 대시보드 화면 출력용 DTO
 * @author : sehui
 * @fileName : DashboardResponse
 * @since : 250905
 * @history
 * - 250905 | sehui | 대시보드 화면 출력용 DTO 생성
 */

@Getter
@ToString
public class DashboardResponse {

    private int totalRecycle;   //총 수거량
    private int memberCount;    //전체 회원 수
    private int totalPoint;     //총 포인트
    private int onlineCount;    //운영중인 수거함 수
    private int offlineCount;   //미운영중인 수거함 수
    private int maintCount;     //점검중인 수거함 수
    private int totalCount;     //총 수거함 수
    private List<KioskResponse> kioskResponses;     //수거함 상태
}
