package com.petcoin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
 * @fileName : PetLocationDto
 * 수거함 위치 찾기 + 거리를 담는 DTO 클래스(API 응답 전용 객체로 사용)
 * @author : heekyung
 * @since : 250829
 * @history
 * - 250829 | heekyung | PetLocationDto 생성
 */

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PetLocationDto {

    private Long recycleId; //회수기 고유번호
    private String recycleName; //회수기 위치 명칭
    private String address; //설치 주소
    private Double latitude; //위도
    private Double longitude; //경도
    private String recycleTel; //설치 장소 연락처
    private String sido; //시
    private String sigungu; //구
    private String dong; //동
    private Double distanceMeters; // 기준 좌표와의 거리(m)
}
