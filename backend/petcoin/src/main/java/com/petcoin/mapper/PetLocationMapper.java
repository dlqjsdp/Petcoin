package com.petcoin.mapper;

import com.petcoin.domain.PetLocationVO;
import com.petcoin.dto.PetLocationDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/*
 * @fileName : PetLocationMapper
 * 수거함 위치 / 검색 기능 Mapper 인터페이스
 * @author : heekyung
 * @since : 250902
 * @history
 * - 250902 | heekyung | PetLocationMapper 생성 / 지역별 검색 기능, 근처 수거함 조회 기능 작성
 */

@Mapper
public interface PetLocationMapper {

    // 전체 "시" 목록 조회(중복 제거)
    public List<String> listSido();

    // 특정 시에 해당하는 "구" 목록 조회
    public List<String> listSigungu(@Param("sido") String sido);

    // 특정 구에 해당하는 "동" 목록 조회
    public List<String> listDong(@Param("sido") String sido, @Param("sigungu") String sigungu);

    // 시, 구, 동 검색 조건
    public List<PetLocationVO> findByRegion(
            @Param("sido") String sido,
            @Param("sigungu") String sigungu,
            @Param("dong") String dong
    );

    // 회수기 고유번호(PK)로 단건 조회
    public PetLocationVO findById(@Param("recycleId") Long recycleId);



}
