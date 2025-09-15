package com.petcoin.service;

import com.petcoin.constant.RequestStatus;
import com.petcoin.dto.Criteria;
import com.petcoin.dto.PointRequestDto;
import com.petcoin.dto.PointRequestProcessDto;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
 * - 250829 | sehui | 전체 포인트 환급 요청의 수 조회 Test
 * - 250829 | sehiu | 목록 조회에 검색 조건 없는 페이징 처리로 변경 후 Test
 * - 250829 | sehui | 목록 조회에서 검색 조건(휴대폰 번호, 요청 처리 상태) Test
 * - 250829 | sehui | 포인트 환급 요청 상태 변경의 매개변수 변경 후 Test
 * - 250903 | leejihye | 포인트 확급 요청 및 포인트 차감 test
 * - 250912 | sehui | 포인트 환급 요청 금액 조회 Test
 * - 250915 | sehui | 포인트 환급 요청 전체 데이터 조회 Test
 */

@SpringBootTest
@Transactional
@Slf4j
class PointReqServiceTest {

    @Autowired
    private PointReqService pointReqService;

    @Test
    @DisplayName("포인트 환급 요청 목록 조회 - 검색 조건 없이")
    void testPointReqList() {

        //given : 페이징 처리, 검색 조건 없이 설정
        Criteria cri = new Criteria(1, 10);

        //when : 포인트 환급 요청 목록 조회
        List<PointRequestDto> pointRequestDtoList = pointReqService.getPointRequestsWithPaging(cri);

        //then : 결과 검증
        assertNotNull(pointRequestDtoList);

        for(PointRequestDto dto : pointRequestDtoList) {
            log.info("포인트 환급 요청 목록 >> {}", dto);
        }
    }

    @Test
    @DisplayName("포인트 환급 요청 목록 조회 - 핸드폰 번호 조건 검색")
    void testPointReqListWithPhone() {

        //given : 페이징 처리, 검색 조건 없이 설정
        Criteria cri = new Criteria(1, 10);
        cri.setPhone("1234");

        //when : 포인트 환급 요청 목록 조회
        List<PointRequestDto> pointRequestDtoList = pointReqService.getPointRequestsWithPaging(cri);

        //then : 결과 검증
        assertNotNull(pointRequestDtoList);

        for(PointRequestDto dto : pointRequestDtoList) {
            log.info("포인트 환급 요청 목록 >> {}", dto);
        }
    }

    @Test
    @DisplayName("포인트 환급 요청 목록 조회 - 요청 처리 상태 조건 검색")
    void testPointReqListWithStatus() {

        //given : 페이징 처리, 검색 조건 없이 설정
        Criteria cri = new Criteria(1, 10);
        cri.setRequestStatus(RequestStatus.PENDING.name());

        //when : 포인트 환급 요청 목록 조회
        List<PointRequestDto> pointRequestDtoList = pointReqService.getPointRequestsWithPaging(cri);

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
        PointRequestProcessDto pointRequestDto = PointRequestProcessDto.builder()
                .requestId(1L)
                .requestStatus(RequestStatus.APPROVED)
                .note("환급 요청 정상 승인")
                .build();

        //when : 포인트 환급 요청 상태 변경
        int result = pointReqService.updatePointRequestStatus(pointRequestDto);

        //then : 결과 검증
        assertEquals(result, 1);

        PointRequestDto updateResult = pointReqService.getPointRequestById(pointRequestDto.getRequestId());
        log.info("변경된 포인트 환급 요청 정보 >> {}", updateResult);
    }

    @Test
    @DisplayName("전체 포인트 환급 요청의 수")
    void testTotalPointReq() {

        //when : 전체 포인트 환급 요청의 수
        int TotalPointRequests = pointReqService.getTotalPointRequests();

        //then : 결과 검증
        assertNotNull(TotalPointRequests);

        log.info("TotalPointRequests = {}", TotalPointRequests);
    }

    @Test
    public void requestRefundTest() {
        PointRequestDto dto = new PointRequestDto();
        //dto.setRequestId(4L);
        dto.setMemberId(4L);
        dto.setRequestStatus(RequestStatus.PENDING);;
        dto.setRequestAmount(500);
        dto.setAccountHolder("testUser");
        dto.setAccountNumber("123456");
        dto.setBankName("ptbank");


        pointReqService.requestRefund(dto);
    }

    @Test
    @DisplayName("포인트 환급 요청 금액 조회")
    void testGetPendingAmount() {

        //given : 회원 ID 설정
        Long memberId = 3L;

        //when : 포인트 환급 요청 금액 조회
        int pendingAmount = pointReqService.getPendingRefundAmount(memberId);

        //then : 결과 검증
        //memberId = 3L의 예상 PENDING 상태 합계
        int expectedAmount = 30;
        assertEquals(expectedAmount, pendingAmount);

        log.info("포인트 환급 요청 금액 : {}", pendingAmount);
    }

    @Test
    @DisplayName("포인트 환급 요청 전체 데이터 조회")
    void testRequestsCount(){

        //when : 포인트 환급 요청 상태별 통계 조회
        List<PointRequestDto> pointRequestDtoList = pointReqService.getPointRequestList();

        //then : 결과 검증
        assertNotNull(pointRequestDtoList);
        pointRequestDtoList.stream().forEach(pointRequestDto -> {
            log.info("포인트 환급 요청 전체 조회 : {}", pointRequestDto);
        });
    }

}