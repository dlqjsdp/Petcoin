package com.petcoin.service;

import com.petcoin.constant.KioskStatus;
import com.petcoin.dto.KioskCriteria;
import com.petcoin.dto.KioskResponse;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/*
 * 키오스크 장치 Service Test
 * 관리자 페이지 : 키오스크 등록/수정/삭제/조회 기능
 * @author : sehui
 * @fileName : KioskServiceTest
 * @since : 250905
 * @history
 * - 250905 | sehui | 키오스크 장치 단건/전체 조회 Test
 * - 250905 | sehui | 키오스크 등록, 수정, 삭제 Test
 */

@SpringBootTest
@Transactional
@Slf4j
class KioskServiceTest {

    @Autowired
    private KioskService kioskService;

    @Test
    @DisplayName("키오스크 장치 단건 조회")
    public void testRead() {

        //given : 키오스크 ID 설정
        Long kioskId = 1L;

        //when : 키오스크 장치 단건 조회
        KioskResponse resultKiosk = kioskService.read(kioskId);

        //then : 결과 검증
        assertNotNull(resultKiosk);
        log.info("Kiosk >> {}", resultKiosk);
    }

    @Test
    @DisplayName("키오스크 장치 전체 조회 - 검색 조건 없이")
    public void testListWithPaging() {

        //given : 페이징 설정
        KioskCriteria cri = new KioskCriteria();

        //when : 키오스크 장치 전체 조회
        List<KioskResponse> kioskList = kioskService.getListWithPaging(cri);

        //then : 결과 검증
        assertNotNull(kioskList);

        for(KioskResponse kiosk : kioskList) {
            log.info("Kiosk >> {}", kiosk);
        }
    }

    @Test
    @DisplayName("키오스크 장치 전체 조회 - 검색 조건 설정")
    public void testListWithSearch() {

        //given : 페이징 + 검색 조건 설정
        KioskCriteria cri = new KioskCriteria();
        cri.setKeyword("상암");

        //when : 키오스크 장치 전체 조회
        List<KioskResponse> kioskList = kioskService.getListWithPaging(cri);

        //then : 결과 검증
        assertNotNull(kioskList);

        for(KioskResponse kiosk : kioskList) {
            log.info("Kiosk >> {}", kiosk);
        }
    }

    @Test
    @DisplayName("키오스크 총 개수 조회")
    public void testTotalCount() {

        //given : 조건 설정
        KioskCriteria cri = new KioskCriteria();

        //when : 키오스크 총 개수 조회
        int totalCount = kioskService.getTotalCount(cri);

        //then : 결과 검증
        assertNotNull(totalCount);
        log.info("Kiosk >> {}", totalCount);
    }

    @Test
    @DisplayName("키오스크 등록")
    @Rollback(false)        //DB 반영하여 확인
    public void testInsert() {

        //given : DTO 설정
        KioskResponse kioskDto = new KioskResponse();
        kioskDto.setRecycleId(2L);
        kioskDto.setName("test 키오스크");
        kioskDto.setLocation("서울 00구");
        kioskDto.setLat(37.1324567);
        kioskDto.setLng(123.4567890);
        kioskDto.setSwVersion("v1.0.0");

        //when : 키오스크 등록
        int insertResult = kioskService.insert(kioskDto);

        //then : 결과 검증
        assertNotNull(insertResult);
        assertEquals(1, insertResult, "등록된 행 수는 1이어야 합니다.");
    }

    @Test
    @DisplayName("키오스크 수정")
    public void testUpdate() {

        //given : 기존 데이터 조회하여 name 컬럼만 수정
        KioskResponse updateKioskDto = kioskService.read(4L);
        updateKioskDto.setName("update 키오스크");

        //then : 키오스크 수정
        int updateResult = kioskService.update(updateKioskDto);

        //then : 결과 검증
        assertNotNull(updateResult);
        assertEquals(1, updateResult, "수정된 행 수는 1이어야 합니다.");
        log.info("Kiosk >> {}", updateKioskDto);
    }

    @Test
    @DisplayName("키오스크 소프트삭제")
    @Rollback(false)    //DB 반영
    public void testSoftDelete() {

        //given : 키오스크 id 설정
        Long kioskId = 4L;

        //when : 키오스크 소프트삭제
        int deleteResult = kioskService.softDelete(kioskId);

        //then : 결과 검증
        assertNotNull(deleteResult);
        assertEquals(1, deleteResult, "삭제된 행 수는 1이어야 합니다.");
    }
}