package com.petcoin.mapper;

import com.petcoin.dto.RefundRowDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface RefundMapper {
    boolean existsPending(Long memberId);
    int insertIdempotency(Map<String,Object> param);
    int linkIdemToRefund(Map<String,Object> param);
    int insertRefund(Map<String,Object> param);
    List<RefundRowDto> selectRefunds(Map<String,Object> param);
    long countRefunds(Map<String,Object> param);

    // 방금 insert된 refund_id 조회
    long selectLastInsertId();
}
