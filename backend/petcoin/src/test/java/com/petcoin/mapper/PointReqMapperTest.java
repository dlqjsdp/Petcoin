package com.petcoin.mapper;

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
 * 포인트 환급 요청 Mapper 테스트
 * @author : sehui
 * @fileName : PointReqMapperTest
 * @since : 250828
 * @history
 * - 250828 | sehui | 포인트 환급 요청 목록 조회 기능 Test
 * - 250828 | sehui | 포인트 환급 요청 단건 조회 기능 Test
 * - 250828 | sehui | 포인트 환급 요청 상태 변경 기능 Test
 */

@SpringBootTest
@Transactional
@Slf4j
class PointReqMapperTest {

    @Autowired
    private PointReqMapper pointReqMapper;

    @Test
    @DisplayName("포인트 환급 요청 목록 조회")
    void testAllPointReq() {

        //when : 포인트 환급 요청 목록 조회
        List<PointRequestDto> requestList = pointReqMapper.findAllPointRequests();

        //then : 결과 검증
        assertNotNull(requestList, "포인트 환급 요청 목록이 null입니다.");
        log.info("환급 요청 건수: {}", requestList.size());

        for(PointRequestDto dto : requestList) {
            log.info("요청 ID : {}, 회원 연락처 : {}, 금액 : {}, 상태 : {}",
                    dto.getRequestId(),
                    dto.getPhone(),
                    dto.getRequestAmount(),
                    dto.getRequestStatus()
            );

            assertNotNull(dto.getMemberId(), "회원 ID가 null입니다.");
            assertNotNull(dto.getRequestStatus(), "요청 진행 상태가 null입니다.");
        }
    }

    @Test
    @DisplayName("포인트 환급 요청 단건 조회")
    void testFindPointReqById() {

        //given : 환급 요청 ID 설정
        Long requestId = 1L;

        //when : 포인트 환급 요청 단건 조회
        PointRequestDto requestDto = pointReqMapper.findPointRequestById(requestId);

        //then : 결과 검증
        assertNotNull(requestDto, "한급 요청ID로 조회한 결과가 null입니다.");

        log.info("환급 요청 >> {}", requestDto);
    }

    @Test
    @DisplayName("포인트 환급 요청 상태 변경")
    void testUpdatePointReqStatus() {

        //given : 요청 ID, 요청 상태, 요청 처리 사유 설정
        Long requestId = 1L;
        RequestStatus requestStatus = RequestStatus.APPROVED;
        String note = "환급 요청 정상 승인";

        //when : 포인트 환급 요청 상태 변경
        int result = pointReqMapper.updatePointRequestStatus(requestId, requestStatus, note);

        //then : 결과 검증
        assertEquals(result, 1, "1개의 환급 요청만 처리되어야 합니다.");

        PointRequestDto requestDto = pointReqMapper.findPointRequestById(requestId);
        log.info("상태 변경된 요청 정보 >> {}", requestDto);
    }

}