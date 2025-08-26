package com.petcoin.dto;

import com.petcoin.constant.KioskStatus;
import lombok.*;

import java.time.LocalDateTime;

/*
 * 키오스크 조회 응답 DTO
 * 관리자 페이지에서 키오스크 장치 정보를 내려줄 때 사용
 *
 * 필드:
 * - kioskId : 키오스크 PK
 * - name : 표시명
 * - location : 설치 위치(주소/매장)
 * - lat/lng : 좌표 (DB DECIMAL(10,7) ↔ VO Double)
 * - status : ONLINE / OFFLINE / MAINT
 * - swVersion : SW 버전
 * - createdAt : 등록일시
 *
 * @author  : yukyeong
 * @fileName: KioskResponse
 * @since   : 250826
 * @history
 *   - 250826 | yukyeong | DTO 최초 생성
 */

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KioskResponse {

    private Long kioskId;
    private String name;
    private String location;
    private Double lat;
    private Double lng;
    private KioskStatus status;
    private String swVersion;
    private LocalDateTime createdAt;
}
