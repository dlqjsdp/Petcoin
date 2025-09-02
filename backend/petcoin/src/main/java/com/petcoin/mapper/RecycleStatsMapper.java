package com.petcoin.mapper;

import com.petcoin.dto.Criteria;
import com.petcoin.dto.RecycleStatsDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/*
 * 무인 회수기의 페트병 수거 내역 VO
 * @author : sehui
 * @fileName : RecycleStatsMapper
 * @since : 250902
 * @history
 *  - 250902 | sehui | 전체 무인 회수기 수거 내역 조회 기능 추가
 *  - 250902 | sehui | 전체 무인 회수기 수 조회 기능 추가
 */


@Mapper
public interface RecycleStatsMapper {

    //전체 무인 회수기 수거 내역 조회
    public List<RecycleStatsDto> findRecycleStatsWithPaging(Criteria cri);

    //전체 무인 회수기 수 조회
    public int getTotalRecycle();

}
