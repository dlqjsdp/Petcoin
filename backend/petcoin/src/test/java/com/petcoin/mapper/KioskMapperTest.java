package com.petcoin.mapper;

import com.petcoin.constant.KioskStatus;
import com.petcoin.domain.KioskVO;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

/*
 * KioskMapperTest
 * kiosk 테이블과 연동된 KioskMapper의 단위 테스트 클래스
 *
 * 주요 목적:
 *  - 키오스크 상태 전이(transitionStatus) 로직이 올바르게 동작하는지 검증
 *  - 전이 성공/실패/소프트삭제 케이스까지 포함해 예외 상황을 확인
 *
 * @author  : yukyeong
 * @fileName: KioskMapperTest.java
 * @since   : 250828
 * @history
 *   - 250828 | yukyeong | transitionStatus_success 작성
 *                        - 신규 키오스크 등록 후 ONLINE → OFFLINE 정상 전이 확인
 *                        - updated=1, 상태 변경 확인
 *   - 250828 | yukyeong | transitionStatus_fail 작성
 *                        - 잘못된 from 상태를 넣고 전이 시도
 *                        - updated=0, 실제 상태 유지 확인
 *   - 250828 | yukyeong | transitionStatus_fail2 작성
 *                        - 소프트삭제된 키오스크에 대해 전이 시도
 *                        - updated=0, read 결과 null 확인
 *   - 250829 | yukyeong | findStatusByIdTest 작성
 *                        - 사전 등록된 kioskId로 현재 상태 조회
 *                        - enum 매핑 정상 확인 및 ONLINE 여부 검증
 *   - 250905 | sehui | 운영중인 키오스크 개수 조회 Test
 */

@SpringBootTest
@Slf4j
class KioskMapperTest {

    @Autowired
    private KioskMapper kioskMapper;

    @Test
    @DisplayName("키오스크 상태 조회 테스트 - ONLINE 여부 확인")
    public void findStatusByIdTest() {
        // Given
        Long kioskId = 1L; // 테스트용 PK (사전에 DB에 데이터 있어야 함)

        // When
        KioskStatus status = kioskMapper.findStatusById(kioskId);

        // Then
        assertNotNull(status, "조회 결과는 null이면 안 됨");
        log.info("kioskId={} 의 상태 = {}", kioskId, status);

        // ONLINE 여부 확인
        assertEquals(KioskStatus.ONLINE, status);
    }

    @Test
    @Transactional
    @DisplayName("상태전이 성공 테스트 - ONLINE -> OFFLINE")
    public void transitionStatus_success() {
        // Given : 신규 키오스크 등록
        KioskVO kiosk = KioskVO.builder()
                .name("테스트1")
                .location("서울 강동구")
                .lat(37.5)
                .lng(127.1)
                .swVersion("v1.0")
                .build();
        kioskMapper.insert(kiosk);

        // When : OFFLINE → ONLINE 전이 시도
        int updated = kioskMapper.transitionStatus(kiosk.getKioskId(),
                KioskStatus.ONLINE, KioskStatus.OFFLINE);

        // Then : 성공 (updated=1) + 상태가 ONLINE으로 변경됨 확인
        assertEquals(1, updated);
        KioskVO result = kioskMapper.read(kiosk.getKioskId());
        assertEquals(KioskStatus.OFFLINE, result.getStatus());
        log.info("전이 성공: {} -> {}", KioskStatus.ONLINE, result.getStatus());
    }

    @Test
    @Transactional
    @DisplayName("상태 전이 실패 테스트 - 잘못된 from을 넣고 전이시도")
    public void transitionStatus_fail() {
        // Given : 신규 키오스크 등록
        KioskVO kiosk = KioskVO.builder()
                .name("테스트2")
                .location("서울 강동구")
                .lat(37.5)
                .lng(127.1)
                .swVersion("v1.0")
                .build();
        kioskMapper.insert(kiosk);

        // When : ONLINE인데, from을 OFFLINE으로 가정하고 MAINT로 전이 시도
        int updated = kioskMapper.transitionStatus(
                kiosk.getKioskId(),
                KioskStatus.OFFLINE, // 잘못된 from(현재 상태와 불일치)
                KioskStatus.MAINT // 목표 상태
        );

        // Then: 전이 실패(updated=0) + 실제 상태는 그대로 ONLINE
        assertEquals(0, updated);
        KioskVO result = kioskMapper.read(kiosk.getKioskId());
        assertEquals(KioskStatus.ONLINE, result.getStatus());
        log.info("전이 실패: updated={} 현재 상태={}", updated, result.getStatus());
    }

    @Test
    @Transactional
    @DisplayName("상태전이 실패 테스트2 - 소프트삭제된 키오스크 전이 불가")
    public void transitionStatus_fail2() {
        // Given : 신규 키오스크 등록후 소프트삭제
        KioskVO kiosk = KioskVO.builder()
                .name("테스트3")
                .location("서울시 강서구")
                .lat(37.5)
                .lng(127.1)
                .swVersion("v1.0")
                .build();
        kioskMapper.insert(kiosk);
        kioskMapper.softDelete(kiosk.getKioskId()); // is_deleted=1

        // When: ONLINE -> OFFLINE 전이 시도
        int updated = kioskMapper.transitionStatus(
                kiosk.getKioskId(),
                KioskStatus.ONLINE,
                KioskStatus.OFFLINE
        );

        // Then: 전이 실패(updated=0). (read는 is_deleted=0 조건이 있어 null일 수도 있음)
        assertEquals(0, updated);
        KioskVO result = kioskMapper.read(kiosk.getKioskId()); // 단건조회에서는 null값이 나와야함
        assertNull(result);
        log.info("전이 실패: updated={} 조회 결과={}", updated, result);

    }

    @Test
    @DisplayName("운영중인 키오스크 개수")
    public void testOnlineCount() {

        //when : 운영중인 키오스크 개수
        int onlineCount = kioskMapper.onlineCount();

        //then : 결과 검증
        assertNotNull(onlineCount);
        log.info("onlineCount >> {}", onlineCount);
    }
}