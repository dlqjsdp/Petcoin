package com.petcoin.dto;

import com.petcoin.constant.KioskStatus;
import lombok.Data;
import lombok.ToString;

import java.time.LocalDateTime;

/*
 * 무인 회수기의 수거 내역과 위치 정보를 담은 DTO
 * @author : sehui
 * @fileName : RecycleStatsDto
 * @since : 250902
 */

@Data
@ToString
public class RecycleStatsDto {

    private Long recycleId;             //무인 회수기 id
    private String recycleName;         //무인 회수기 이름
    private String address;            //위치
    private KioskStatus status;        //상태
    private int totalCount;             //총 수거량
    private LocalDateTime lastCollection;       //마지막 수거 시간
}
