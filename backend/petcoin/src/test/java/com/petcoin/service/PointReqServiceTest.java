package com.petcoin.service;

import com.petcoin.constant.RequestStatus;
import com.petcoin.dto.PointRequestDto;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/*
 * 포인트 환급 요청 Service 테스트
 * @author : sehui
 * @fileName : PointReqServiceTest
 * @since : 250828
 * @history
 * - 250828 | sehui | 포인트 환급 요청 목록 조회 Test
 * - 250828 | sehui | 포인트 환급 요청 단건 조회 Test
 * - 250828 | sehui | 포인트 환급 요청 상태 변경 Test
 */

@SpringBootTest
@Transactional
@Slf4j
class PointReqServiceTest {

    @Autowired
    private PointReqService pointReqService;

    @Test
    @DisplayName("포인트 환급 요청 목록 조회")
    void testGetPointReqList() {

        //when : 포인트 환급 요청 목록 조회
        List<PointRequestDto> pointRequestDtoList = pointReqService.getAllPointRequests();

        //then : 결과 검증
        assertNotNull(pointRequestDtoList);

        for(PointRequestDto dto : pointRequestDtoList) {
            log.info("포인트 환급 요청 목록 >> {}", dto);
        }
    }

    @Test
    @DisplayName("포인트 환급 요청 단건 조회")
    void testGetPointReqById() {

        //given : 환급 요청 ID 설정
        Long requestId = 1L;

        //when : 포인트 환급 요청 단건 조회
        PointRequestDto pointRequestDto = pointReqService.getPointRequestById(requestId);

        //then : 결과 검증
        assertNotNull(pointRequestDto);
        log.info("환급 요청 단건 조회 >> {}", pointRequestDto);
    }

    @Test
    @DisplayName("포인트 환급 요청 상태 변경")
    void testUpdatePointReqStatus() {

        //given : 상태 변경을 위한 기본 설정
        Long requestId = 1L;
        RequestStatus requestStatus = RequestStatus.APPROVED;
        String note = "환급 요청 승인 완료";

        //when : 포인트 환급 요청 상태 변경
        int result = pointReqService.updatePointRequestStatus(requestId, requestStatus, note);

        //then : 결과 검증
        assertEquals(result, 1);

        PointRequestDto updateResult = pointReqService.getPointRequestById(requestId);
        log.info("변경된 포인트 환급 요청 정보 >> {}", updateResult);
    }

}