package com.petcoin.service;

import com.petcoin.domain.PetLocationVO;
import com.petcoin.mapper.PetLocationMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/*
 * @fileName : PetLocationServiceImpl
 * PetLocationService 인터페이스와 연결된 클래스
 * @author : heekyung
 * @since : 250902
 * @history
 * - 250826 | heekyung | PetLocationServiceImpl 생성 / 지역별 검색 기능, 근처 수거함 조회 기능 작성
 */

@Service
@RequiredArgsConstructor
@Slf4j
public class PetLocationServiceImpl implements PetLocationService {

    private final PetLocationMapper petLocationMapper;
    
    // 시 목록 가져오기
    @Override
    public List<String> listSido() {
        return petLocationMapper.listSido();
    }

    // 구 목록 가져오기
    @Override
    public List<String> listSigungu(String sido) {
        return petLocationMapper.listSigungu(sido);
    }
    
    // 동 목록 가져오기
    @Override
    public List<String> listDong(String sido, String sigungu) {
        return petLocationMapper.listDong(sido, sigungu);
    }

    // 조건 별 검색
    @Override
    public List<PetLocationVO> findByRegion(String sido, String sigungu, String dong) {
        return petLocationMapper.findByRegion(sido, sigungu, dong);
    }
    
    // 단건 조회
    @Override
    public PetLocationVO findById(Long recycleId) {
        return petLocationMapper.findById(recycleId);
    }
}
