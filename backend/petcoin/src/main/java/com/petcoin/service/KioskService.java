package com.petcoin.service;

import com.petcoin.dto.KioskCriteria;
import com.petcoin.dto.KioskResponse;

import java.util.List;

/*
 * 키오스크 장치 Service 인터페이스
 * 관리자 페이지 : 키오스크 등록/수정/삭제/조회 기능
 * @author : sehui
 * @fileName : KioskService
 * @since : 250905
 * @history
 * - 250905 | sehui | 키오스크 장치 단건/전체 조회 기능 추가
 * - 250905 | sehui | 키오스크 등록, 수정, 삭제 기능 추가
 */

public interface KioskService {

    //키오스크 장치 단건 조회
    public KioskResponse read(Long kioskId);

    //키오스크 장치 전체 조회 (검색 + 페이징 포함)
    public List<KioskResponse> getListWithPaging(KioskCriteria cri);

    //키오스크 총 개수 조회
    public int getTotalCount(KioskCriteria cri);

    //키오스크 등록
    public int insert(KioskResponse kiosk);

    //키오스크 정보 수정
    public int update(KioskResponse kiosk);

    //키오스크 소프트삭제
    public int softDelete(Long kioskId);
}
