package com.petcoin.service;

import com.petcoin.constant.KioskStatus;
import com.petcoin.domain.KioskVO;
import com.petcoin.dto.KioskCriteria;
import com.petcoin.dto.KioskResponse;
import com.petcoin.mapper.KioskMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

/*
 * 키오스크 장치 Service 구현체
 * 관리자 페이지 : 키오스크 등록/수정/삭제/조회 기능
 * @author : sehui
 * @fileName : KioskServiceImpl
 * @since : 250905
 * @history
 * - 250905 | sehui | 키오스크 장치 단건/전체 조회 기능 추가
 * - 250905 | sehui | 키오스크 등록, 수정, 삭제 기능 추가
 * - 250911 | yukyeong | updateStatus 메서드 추가 (관리자 전용 상태 변경: ONLINE/MAINT/OFFLINE)
 */

@Service
@RequiredArgsConstructor
@Slf4j
public class KioskServiceImpl implements KioskService {

    private final KioskMapper kioskMapper;

    //DTO -> VO 변환
    private KioskVO convertDtoToVo(KioskResponse dto) {
        KioskVO vo = new KioskVO();
        vo.setKioskId(dto.getKioskId());
        vo.setRecycleId(dto.getRecycleId());
        vo.setName(dto.getName());
        vo.setLocation(dto.getLocation());
        vo.setLat(dto.getLat());
        vo.setLng(dto.getLng());
        vo.setStatus(dto.getStatus());
        vo.setSwVersion(dto.getSwVersion());
        vo.setCreatedAt(dto.getCreatedAt());
        vo.setUpdatedAt(dto.getUpdatedAt());
        return vo;
    }

    //VO -> DTO 변환
    public KioskResponse convertVoToDto(KioskVO vo) {
        KioskResponse dto = new KioskResponse();
        dto.setKioskId(vo.getKioskId());
        dto.setRecycleId(vo.getRecycleId());
        dto.setName(vo.getName());
        dto.setLocation(vo.getLocation());
        dto.setLat(vo.getLat());
        dto.setLng(vo.getLng());
        dto.setStatus(vo.getStatus());
        dto.setSwVersion(vo.getSwVersion());
        dto.setCreatedAt(vo.getCreatedAt());
        dto.setUpdatedAt(vo.getUpdatedAt());
        return dto;
    }

    //키오스크 장치 단건 조회
    @Override
    public KioskResponse read(Long kioskId) {

        KioskVO readKiosk = kioskMapper.read(kioskId);

        if(readKiosk == null) {
            throw new NoSuchElementException("키오스크 장치 단건 조회 오류 발생");
        }

        KioskResponse resultDto = convertVoToDto(readKiosk);

        return resultDto;
    }
    
    //키오스크 장치 전체 조회
    @Override
    public List<KioskResponse> getListWithPaging(KioskCriteria cri) {

        List<KioskVO> kioskVOList = kioskMapper.getListWithPaging(cri);

        List<KioskResponse> resultDtoList = new ArrayList<>();

        for(KioskVO vo : kioskVOList) {
            KioskResponse resultDto = convertVoToDto(vo);
            resultDtoList.add(resultDto);
        }

        return resultDtoList;
    }

    //키오스크 총 개수 조회
    @Override
    public int getTotalCount(KioskCriteria cri) {

        int totalCount = kioskMapper.getTotalCount(cri);

        return totalCount;
    }

    //키오스크 등록
    @Override
    public int insert(KioskResponse kiosk) {

        KioskVO insertVo = convertDtoToVo(kiosk);

        int insertResult = kioskMapper.insert(insertVo);

        if(insertResult != 1) {
            throw new IllegalStateException("키오스크 DB에 등록 실패");
        }

        return insertResult;
    }
    
    //키오스크 정보 수정
    @Override
    public int update(KioskResponse kiosk) {
        
        KioskVO updateVo = convertDtoToVo(kiosk);
        
        int updateResult = kioskMapper.update(updateVo);    
        
        if(updateResult != 1) {
            throw new IllegalStateException("키오스크 수정된 정보 DB에 저장 실패");
        }
        
        return updateResult;
    }

    //키오스크 소프트삭제
    @Override
    public int softDelete(Long kioskId) {

        int deleteResult = kioskMapper.softDelete(kioskId);

        if(deleteResult != 1) {
            throw new IllegalStateException("키오스크 정보 DB에서 삭제 실패");
        }

        return deleteResult;
    }

    // 관리자 페이지-키오스크탭: 키오스크 상태 변경 (ONLINE/MAINT/OFFLINE)
    @Override
    public int updateStatus(Long kioskId, KioskStatus status) {
        int result = kioskMapper.updateStatus(kioskId, status);

        if (result != 1) {
            throw new IllegalStateException("키오스크 상태 변경 실패: kioskId=" + kioskId + ", status=" + status);
        }

        log.info("키오스크 상태 변경 성공: kioskId={}, status={}", kioskId, status);
        return result;
    }
}
