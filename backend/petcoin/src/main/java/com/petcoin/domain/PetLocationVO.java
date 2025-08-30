package com.petcoin.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
 * @fileName : PetLocationVO
 * 페트병 무인 수거함 위치 정보를 담은 VO 클래스
 * @author : heekyung
 * @since : 250830
 * @history
 * - 250830 | heekyung | PetLocationVO 생성
 */

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PetLocationVO {

    private Long recycleId; //회수기 고유번호
    private String recycleName; //회수기 위치 명칭
    private String address; //설치 주소
    private Double latitude; //위도
    private Double longitude; //경도
    private String recycleTel; //설치 장소 연락처
    private String sido; //시
    private String sigungu; //구
    private String dong; //동
}
