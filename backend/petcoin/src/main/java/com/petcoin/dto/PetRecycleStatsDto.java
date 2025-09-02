package com.petcoin.dto;

import lombok.Data;

/*
 * 무인 회수기의 수거 내역과 위치 정보를 담은 DTO
 * @author : sehui
 * @fileName : PetRecycleStatsDto
 * @since : 250902
 */

@Data
public class PetRecycleStatsDto {

    private Long recycleId;
    private String address;             //위치
    private int totalCount;             //총 수거량 (정상)
    private int defectCount;            //불량 수거량
    private int remainCapacity;         //잔여 수용량
}
