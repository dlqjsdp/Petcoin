package com.petcoin.mapper;

import com.petcoin.constant.RequestStatus;
import com.petcoin.dto.Criteria;
import com.petcoin.dto.PointRequestDto;
import com.petcoin.dto.PointRequestProcessDto;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestTemplate;
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
 * - 250829 | sehui | 전체 포인트 환급 요청의 수 조회 Test
 * - 250829 | sehiu | 목록 조회에 검색 조건 없는 페이징 처리로 변경 후 Test
 * - 250829 | sehui | 목록 조회에서 검색 조건(휴대폰 번호, 요청 처리 상태) Test
 * - 250829 | sehui | 포인트 환급 요청 상태 변경 기능의 매개변수 변경 후 Test
 * - 250903 | leejihye | 포인트 환급 요청 Test
 * - 250912 | sehui | 포인트 환급 요청 금액 조회 Test
 */

@SpringBootTest
@Transactional
@Slf4j
class PointReqMapperTest {

    @Autowired
    private PointReqMapper pointReqMapper;

    @Test
    @DisplayName("포인트 환급 요청 목록 조회 - 검색 조건 없이")
    void testpointReqList() {

        //given : 페이징 처리, 검색 조건 없이 설정
        Criteria cri = new Criteria(1, 10);

        //when : 포인트 환급 요청 목록 조회
        List<PointRequestDto> requestList = pointReqMapper.findPointRequestsWithPaging(cri);

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
    @DisplayName("포인트 환급 요청 목록 조회 - 핸드폰 번호 조건 검색")
    void testpointReqListWithPhone() {

        //given : 페이징 처리, 검색 조건 없이 설정
        Criteria cri = new Criteria(1, 10);
        cri.setPhone("2222");

        //when : 포인트 환급 요청 목록 조회
        List<PointRequestDto> requestList = pointReqMapper.findPointRequestsWithPaging(cri);

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
    @DisplayName("포인트 환급 요청 목록 조회 - 요청 처리 상태 조건 검색")
    void testpointReqListWithStatus() {

        //given : 페이징 처리, 검색 조건 없이 설정
        Criteria cri = new Criteria(1, 10);
        cri.setRequestStatus(RequestStatus.PENDING.name());

        //when : 포인트 환급 요청 목록 조회
        List<PointRequestDto> requestList = pointReqMapper.findPointRequestsWithPaging(cri);

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
        PointRequestProcessDto pointRequestDto = PointRequestProcessDto.builder()
                .requestId(1L)
                .requestStatus(RequestStatus.APPROVED)
                .note("환급 요청 정상 승인")
                .build();

        //when : 포인트 환급 요청 상태 변경
        int result = pointReqMapper.updatePointRequestStatus(pointRequestDto);

        //then : 결과 검증
        assertEquals(result, 1, "1개의 환급 요청만 처리되어야 합니다.");

        PointRequestDto requestDto = pointReqMapper.findPointRequestById(pointRequestDto.getRequestId());
        log.info("상태 변경된 요청 정보 >> {}", requestDto);
    }

    @Test
    @DisplayName("전체 포인트 환급 요청의 수")
    void testTotalPointReq() {

        //when : 전체 포인트 환급 요청의 수
        int TotalPointRequests = pointReqMapper.getTotalPointRequests();

        //then : 결과 검증
        assertNotNull(TotalPointRequests, "전체 포인트 환급 요청의 수가 null입니다.");

        log.info("Total Point Requests: {}", TotalPointRequests);
    }

    //포인트 환급 요청 test
    @Test
    public void requestRefundTest() {
        PointRequestDto pointRequestDto = PointRequestDto.builder()
                .memberId(3L)
                .requestAmount(50)
                .bankName("ptbank")
                .accountNumber("111222333444555")
                .accountHolder("testUser")
                .requestStatus(RequestStatus.PENDING)
                .build();

        pointReqMapper.requestRefund(pointRequestDto);

        log.info("<UNK> <UNK> <UNK>: {}", pointRequestDto);
    }

    @Test
    @DisplayName("포인트 환급 금액 조회")
    public void testPendingAmount() {

        //given : 회원 ID 설정
        Long memberId = 3L;

        //when : 포인트 환급 금액 조회
        int pendingRefundAmount = pointReqMapper.getPendingRefundAmount(memberId);

        //then : 결과 검증
        //memberId = 3L의 PENDING 상태 합계가 30p일 것으로 예상
        int expectedAmount = 30;
        assertEquals(expectedAmount, pendingRefundAmount, "PENDING 상태 포인트 환급 금액이 올바르게 조회되어야 한다.");

        System.out.println("회원 ID " + memberId + "의 환급 요청 중 포인트: " + pendingRefundAmount + "p");

    }
}