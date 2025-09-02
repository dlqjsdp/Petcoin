package com.petcoin.service;

import com.petcoin.dto.Criteria;
import com.petcoin.dto.RecycleStatsDto;

import java.util.List;

/*
 * 무인 회수기의 페트병 수거 내역 Service 인터페이스
 * @author : sehui
 * @fileName : RecycleStatsService
 * @since : 250902
 * @history
 * - 250902 | sehui | 전체 무인 회수기 수거 내역 조회 기능 추가
 * - 250902 | sehui | 전체 무인 회수기 수 조회 기능 추가
 */

public interface RecycleStatsService {

    //전체 무인 회수기 수거 내역 조회
    public List<RecycleStatsDto> getRecycleStatsWithPaging(Criteria cri);

    //전체 무인 회수기 수 조회
    public int getTotalRecycle();
}
