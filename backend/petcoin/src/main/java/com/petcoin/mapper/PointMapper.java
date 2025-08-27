package com.petcoin.mapper;

import com.petcoin.domain.PointHistoryVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/*
 * 포인트 Mapper 인터페이스
 * @author : sehui
 * @fileName : PointMapper
 * @since : 250827
 * @history
 * - 250827 | sehui | 회원별 포인트 내역 조회 기능 추가
 */

@Mapper
public interface PointMapper {

    //회원별 포인트 내역 조회 기능
    public List<PointHistoryVO> findPointHistoryById(Long memberId);
}
