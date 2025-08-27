package com.petcoin.mapper;

import com.petcoin.dto.DisposalDetailDto;
import com.petcoin.dto.DisposalListRowDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface DisposalMapper {
    List<DisposalListRowDto> selectList(@Param("memberId") long memberId,
                                        @Param("from") LocalDate from,
                                        @Param("to") LocalDate to,
                                        @Param("region1") String region1,
                                        @Param("region2") String region2,
                                        @Param("itemName") String itemName,
                                        @Param("status") String status,
                                        @Param("offset") int offset,
                                        @Param("limit") int limit);
    long countList(@Param("memberId") long memberId,
                   @Param("from") LocalDate from,
                   @Param("to") LocalDate to,
                   @Param("region1") String region1,
                   @Param("region2") String region2,
                   @Param("itemName") String itemName,
                   @Param("status") String status);
    DisposalDetailDto selectDetail(@Param("memberId") long memberId, @Param("disposalId") long disposalId);
}

