package com.petcoin.service;

import com.petcoin.dto.Criteria;
import com.petcoin.dto.RecycleStatsDto;
import com.petcoin.mapper.RecycleStatsMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/*
 * 무인 회수기의 페트병 수거 내역 Service
 * @author : sehui
 * @fileName : RecycleStatsServiceImpl
 * @since : 250902
 * @history
 * - 250902 | sehui | 전체 무인 회수기 수거 내역 조회 기능 추가
 * - 250902 | sehui | 전체 무인 회수기 수 조회 기능 추가
 */

@Service
@RequiredArgsConstructor
@Slf4j
public class RecycleStatsServiceImpl implements RecycleStatsService {

    private final RecycleStatsMapper statsMapper;

    //전체 무인 회수기 수거 내역 조회
    @Override
    public List<RecycleStatsDto> getRecycleStatsWithPaging(Criteria cri) {

        List<RecycleStatsDto> statsDtoList = statsMapper.findRecycleStatsWithPaging(cri);

        if(statsDtoList.isEmpty()) {
            throw new IllegalArgumentException("전체 무인 회수기 수거 내역 조회 오류 발생");
        }

        return statsDtoList;
    }
    
    //전체 무인 회수기 수 조회
    @Override
    public int getTotalRecycle() {
        
        int totalRecycle = statsMapper.getTotalRecycle();
        
        if(totalRecycle == 0) {
            throw new IllegalArgumentException("전체 무인 회수기 수 조회 오류 발생");
        }
        
        return totalRecycle;
    }
}
