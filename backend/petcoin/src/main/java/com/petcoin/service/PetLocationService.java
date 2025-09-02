package com.petcoin.service;

import com.petcoin.domain.PetLocationVO;
import java.util.List;

/*
 * @fileName : PetLocationService
 * 수거함 위치 / 검색 기능 관련 Service 인터페이스
 * @author : heekyung
 * @since : 250902
 * @history
 * - 250902 | heekyung | PetLocationService 생성 / 지역별 검색 기능, 근처 수거함 조회 기능 작성
 */

public interface PetLocationService {

    // "시" 목록 검색
    public List<String> listSido();

    // "구" 목록 검색
    public List<String> listSigungu(String sido);

    // "동" 목록 검색
    public List<String> listDong(String sido, String sigungu);

    // 조건 별 검색
    public List<PetLocationVO> findByRegion(String sido, String sigungu, String dong);

    // 단건 조회
    public PetLocationVO findById(Long recycleId);
}

