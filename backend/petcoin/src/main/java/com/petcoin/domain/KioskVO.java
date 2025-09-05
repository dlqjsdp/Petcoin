package com.petcoin.domain;

import com.petcoin.constant.KioskStatus;
import lombok.*;

import java.time.LocalDateTime;

/*
 * 키오스크 장치 VO
 * DB kiosk 테이블과 매핑
 *
 * 필드 설명:
 * - kioskId : 키오스크 PK
 * - name : 표시명
 * - location : 설치 매장/주소
 * - lat/lng : 좌표 (DECIMAL(10,7))
 * - status : 장치 상태(ONLINE/OFFLINE/MAINT) - Enum 매핑
 * - swVersion : 소프트웨어 버전
 * - createdAt : 등록일시
 * - updatedAt : 수정일시
 * - isDeleted : 소프트 삭제 여부 (0=정상, 1=삭제)
 *
 * @author  : yukyeong
 * @fileName: KioskVO
 * @since   : 250826
 * @history
 *     - 250826 | yukyeong | VO 최초 생성
 *     - 250826 | yukyeong | updatedAt, isDeleted 필드 추가
 *     - 250905 | sehui | recycleId (연결된 무인 회수기 ID) 필드 추가
 */

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class KioskVO {

    private Long kioskId;
    private Long recycleId;
    private String name;
    private String location;
    private Double lat;
    private Double lng;
    private KioskStatus status;
    private String swVersion;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isDeleted;
}
