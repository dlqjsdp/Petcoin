package com.petcoin.mapper;

import com.petcoin.dto.Criteria;
import com.petcoin.dto.PetRecycleStatsDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/*
 * 페트병 수거 내역 VO
 * @author : sehui
 * @fileName : PetRecycleRecordMapper
 * @since : 250902
 * @history
 *  - 250902 | sehui | 전체 무인 회수기의 수거 내역 조회 기능 추가
 *  - 250902 | sehui | 무인 회수기 단건 조회 기능 추가
 */


@Mapper
public interface PetRecycleRecordMapper {

    //전체 무인 회수기의 수거 내역 조회
    public List<PetRecycleStatsDto> findRecycleStatsWithPaging(Criteria cri);

    //무인 회수기 단건 조회
    PetRecycleStatsDto findRecycleStatsByRecycleId(Long recycleId);
}
