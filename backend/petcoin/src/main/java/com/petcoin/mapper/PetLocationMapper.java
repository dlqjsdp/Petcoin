package com.petcoin.mapper;

import com.petcoin.domain.PetLocationVO;
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

    // 시, 구, 동 검색 조건(출력값으로 DTO에 기재된 항목이여야 함)
    public List<PetLocationVO> findByRegion(
            @Param("sido") String sido,
            @Param("sigungu") String sigungu,
            @Param("dong") String dong
    );

    // 검색 시 참고하는 입력값(출력 불필요로 DTO 불필요)
    public List<PetLocationVO> findNearby(
            @Param("lat") double lat,       // 기준 위도
            @Param("lng") double lng,       // 기준 경도
            @Param("latMin") double latMin, // 위도 최소값
            @Param("latMax") double latMax, // 위도 최대값
            @Param("lngMin") double lngMin, // 경도 최소값
            @Param("lngMax") double lngMax, // 경도 최대값
            @Param("limit") int limit     // 최대 결과 개수
    );

    // 회수기 고유번호(PK)로 단건 조회
    public PetLocationVO findById(@Param("id") int id);



}
