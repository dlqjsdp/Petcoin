package com.petcoin.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.petcoin.constant.RequestStatus;
import com.petcoin.constant.Role;
import com.petcoin.domain.MemberVO;
import com.petcoin.dto.Criteria;
import com.petcoin.dto.PointRequestProcessDto;
import com.petcoin.security.CustomUserDetails;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

/*
 * AdminApiController 테스트
 * @author : sehui
 * @fileName : AdminApiControllerTest
 * @since : 250827
 * @history
 *  - 250827 | sehui | 전체 회원 조회 API Test
 *  - 250827 | sehui | 회원 정보 단건 조회 API Test
 *  - 250829 | sehui | 회원 조회 API Test에 암호화된 비밀번호 추가
 *  - 250829 | sehui | 포인트 환급 목록 조회 (검색 조건 없이) API Test
 *  - 250829 | sehui | 포인트 환급 목록 조회 (처리 상태 조건 검색) API Test
 *  - 250829 | sehui | 포인트 환급 단건 조회 API Test
 *  - 250829 | sehui | 포인트 환급 요청 처리 API Test
 *  - 250902 | sehui | 전체 무인 회수기 수거 내역 조회 API Test
 */

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
//@Rollback(false)
@Slf4j
class AdminApiControllerTest {

    @Autowired
    private MockMvc mvc;

    @Test
    @DisplayName("전체 회원 조회 요청")
    void testMemberList() throws Exception {

        //when : 테스트용 CustomUserDetails 생성
        MemberVO testMember = new MemberVO();
        testMember.setPhone("010-2222-3333");
        testMember.setRole(Role.ADMIN);
        testMember.setPassword("$2a$10$qjH49PuTf1e3yPPKqC0WZe4NTnP9vTz8az1iDdHZvdtABclp1dU9W");

        CustomUserDetails userDetails = new CustomUserDetails(testMember);

        //SecurityContext에 Authentication 설정
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);
        
        //when : MockMvc 호출
        String responseContent = mvc.perform(MockMvcRequestBuilders.get("/api/admin/member/list"))
                .andExpect(status().isOk())     //HTTP 상태 코드 200 OK
                .andDo(print())
                .andReturn()        //응답 결과 반환
                .getResponse()      //응답 객체
                .getContentAsString();          //응답 본문을 문자열로 반환

        //then : 응답 내용 출력
        log.info("MemberList >> {}", responseContent);
    }

    @Test
    @DisplayName("전체 회원 조회 요청 - 핸드폰 번호 검색 조건")
    void testMemberListWithCriteria() throws Exception {

        //when : 테스트용 CustomUserDetails 생성
        MemberVO testMember = new MemberVO();
        testMember.setPhone("010-2222-3333");
        testMember.setRole(Role.ADMIN);
        testMember.setPassword("$2a$10$qjH49PuTf1e3yPPKqC0WZe4NTnP9vTz8az1iDdHZvdtABclp1dU9W");

        CustomUserDetails userDetails = new CustomUserDetails(testMember);

        //SecurityContext에 Authentication 설정
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        //검색 조건 생성 (Criteria)
        Criteria cri = new Criteria();
        cri.setPhone("2222");

        //when : MockMvc 호출
        String responseContent = mvc.perform(MockMvcRequestBuilders.get("/api/admin/member/list")
                        .param("phone", cri.getPhone()))
                .andExpect(status().isOk())     //HTTP 상태 코드 200 OK
                .andDo(print())
                .andReturn()        //응답 결과 반환
                .getResponse()      //응답 객체
                .getContentAsString();          //응답 본문을 문자열로 반환

        //then : 응답 내용 출력
        log.info("MemberList >> {}", responseContent);
    }

    @Test
    @DisplayName("회원 정보 단건 조회 요청")
    void testMemberDetails() throws Exception {

        //when : 테스트용 CustomUserDetails 생성
        MemberVO testMember = new MemberVO();
        testMember.setPhone("010-2222-3333");
        testMember.setRole(Role.ADMIN);
        testMember.setPassword("$2a$10$qjH49PuTf1e3yPPKqC0WZe4NTnP9vTz8az1iDdHZvdtABclp1dU9W");

        CustomUserDetails userDetails = new CustomUserDetails(testMember);

        //SecurityContext에 Authentication 설정
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        //when : MockMvc 호출
        String responseContent = mvc.perform(MockMvcRequestBuilders.get("/api/admin/member/1"))
                .andExpect(status().isOk())     //HTTP 상태 코드 200 OK
                .andDo(print())
                .andReturn()        //응답 결과 반환
                .getResponse()      //응답 객체
                .getContentAsString();          //응답 본문을 문자열로 반환

        //then : 결과 검증
        log.info("MemberDetails >> {}", responseContent);
    }

    @Test
    @DisplayName("전체 포인트 환급 조회")
    void testPointReqList() throws Exception {

        //when : 테스트용 CustomUserDetails 생성
        MemberVO testMember = new MemberVO();
        testMember.setPhone("010-2222-3333");
        testMember.setRole(Role.ADMIN);
        testMember.setPassword("$2a$10$qjH49PuTf1e3yPPKqC0WZe4NTnP9vTz8az1iDdHZvdtABclp1dU9W");

        CustomUserDetails userDetails = new CustomUserDetails(testMember);

        //SecurityContext에 Authentication 설정
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        //when : MockMvc 호출
        String responseContent = mvc.perform(MockMvcRequestBuilders.get("/api/admin/point/list"))
                .andExpect(status().isOk())     //HTTP 상태 코드 200 OK
                .andDo(print())
                .andReturn()        //응답 결과 반환
                .getResponse()      //응답 객체
                .getContentAsString();          //응답 본문을 문자열로 반환

        //then : 응답 내용 출력
        log.info("Point Request List >> {}", responseContent);
    }

    @Test
    @DisplayName("전체 포인트 환급 요청 조회 - 처리 상태 검색 조건")
    void testPointReqListWithCriteria() throws Exception {

        //when : 테스트용 CustomUserDetails 생성
        MemberVO testMember = new MemberVO();
        testMember.setPhone("010-2222-3333");
        testMember.setRole(Role.ADMIN);
        testMember.setPassword("$2a$10$qjH49PuTf1e3yPPKqC0WZe4NTnP9vTz8az1iDdHZvdtABclp1dU9W");

        CustomUserDetails userDetails = new CustomUserDetails(testMember);

        //SecurityContext에 Authentication 설정
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        //검색 조건 생성 (Criteria)
        Criteria cri = new Criteria();
        cri.setRequestStatus(RequestStatus.PENDING.name());

        //when : MockMvc 호출
        String responseContent = mvc.perform(MockMvcRequestBuilders.get("/api/admin/point/list")
                        .param("requestStatus", cri.getRequestStatus()))
                .andExpect(status().isOk())     //HTTP 상태 코드 200 OK
                .andDo(print())
                .andReturn()        //응답 결과 반환
                .getResponse()      //응답 객체
                .getContentAsString();          //응답 본문을 문자열로 반환

        //then : 응답 내용 출력
        log.info("Point Request List >> {}", responseContent);
    }

    @Test
    @DisplayName("포인트 환급 단건 조회 요청")
    void testPointReqDetails() throws Exception {

        //when : 테스트용 CustomUserDetails 생성
        MemberVO testMember = new MemberVO();
        testMember.setPhone("010-2222-3333");
        testMember.setRole(Role.ADMIN);
        testMember.setPassword("$2a$10$qjH49PuTf1e3yPPKqC0WZe4NTnP9vTz8az1iDdHZvdtABclp1dU9W");

        CustomUserDetails userDetails = new CustomUserDetails(testMember);

        //SecurityContext에 Authentication 설정
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        //when : MockMvc 호출
        String responseContent = mvc.perform(MockMvcRequestBuilders.get("/api/admin/point/1"))
                .andExpect(status().isOk())     //HTTP 상태 코드 200 OK
                .andDo(print())
                .andReturn()        //응답 결과 반환
                .getResponse()      //응답 객체
                .getContentAsString();          //응답 본문을 문자열로 반환

        //then : 결과 검증
        log.info("Point Request Details >> {}", responseContent);
    }

    @Test
    @DisplayName("포인트 환급 처리 성공")
    void testPointReqSuccess() throws Exception {

        //given : 테스트용 CustomUserDetails 생성
        MemberVO testMember = new MemberVO();
        testMember.setPhone("010-2222-3333");
        testMember.setRole(Role.ADMIN);
        testMember.setPassword("$2a$10$qjH49PuTf1e3yPPKqC0WZe4NTnP9vTz8az1iDdHZvdtABclp1dU9W");

        CustomUserDetails userDetails = new CustomUserDetails(testMember);

        //SecurityContext에 Authentication 설정
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        //환급 요청 처리할 PointRequestProcessDto 생성
        PointRequestProcessDto requestDto = PointRequestProcessDto.builder()
                .requestId(1L)
                .requestStatus(RequestStatus.COMPLETED)
                .note("환급 처리 완료")
                .build();

        //when & then : MockMvc 호출하여 GET 요청 수행 후 검증
        mvc.perform(MockMvcRequestBuilders.put("/api/admin/point/process/{requestId}", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(requestDto))) // JSON 형태로 body 전달
                .andExpect(status().isOk()); // HTTP 상태 코드 200 OK만 검증
    }

    @Test
    @DisplayName("전체 무인 회수기 수거 내역 조회")
    void testGetAllRecycleStats() throws Exception {

        //given : 테스트용 CustomUserDetails 생성
        MemberVO testMember = new MemberVO();
        testMember.setPhone("010-2222-3333");
        testMember.setRole(Role.ADMIN);
        testMember.setPassword("$2a$10$qjH49PuTf1e3yPPKqC0WZe4NTnP9vTz8az1iDdHZvdtABclp1dU9W");

        CustomUserDetails userDetails = new CustomUserDetails(testMember);

        //SecurityContext에 Authentication 설정
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        //when & then : GET 요청 수행 후 검증
        String responseContent = mvc.perform(MockMvcRequestBuilders.get("/api/admin/recycle/stats"))
                .andExpect(status().isOk())     //HTTP 상태 코드 200 OK
                .andDo(print())
                .andReturn()        //응답 결과 반환
                .getResponse()      //응답 객체
                .getContentAsString();          //응답 본문을 문자열로 반환

        //then : 응답 내용 출력
        log.info("Recycle Stats List >> {}", responseContent);
    }
}