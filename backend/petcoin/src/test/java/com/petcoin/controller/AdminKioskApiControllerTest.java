package com.petcoin.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.petcoin.constant.Role;
import com.petcoin.domain.MemberVO;
import com.petcoin.dto.Criteria;
import com.petcoin.dto.KioskCriteria;
import com.petcoin.dto.KioskResponse;
import com.petcoin.security.CustomUserDetails;
import com.petcoin.service.KioskService;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/*
 * AdminKioskApiController 테스트
 * 관리자 페이지 : 키오스크 관련 Controller Test
 * @author : sehui
 * @fileName : AdminKioskApiControllerTest
 * @since : 250905
 * @history
 *  - 250905 | sehui | 키오스크 장치 전체/단건 조회 요청 Test
 *  - 250905 | sehui | 키오스크 장치 등록/수정/삭제 요청 Test
 *  - 250905 | sehui | 키오스크 실행 세션 목록/단건 조회 요청 Test
 */

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@Slf4j
class AdminKioskApiControllerTest {

    @Autowired
    private MockMvc mvc;

    //LocalDateTime 직렬화 문제 해결하기 위해 사용 (수정 요청)
    @Autowired
    private ObjectMapper objectMapper;

    //키오스크 장치 기본 정보 요청하기 위해 사용 (수정 요청)
    @Autowired
    private KioskService kioskService;

    @Test
    @DisplayName("키오스크 장치 전체 조회")
    void testKioskList() throws Exception {

        //given : 테스트용 CustomUserDetails 생성
        MemberVO testMember = new MemberVO();
        testMember.setPhone("010-2222-3333");
        testMember.setRole(Role.ADMIN);
        testMember.setPassword("$2a$10$qjH49PuTf1e3yPPKqC0WZe4NTnP9vTz8az1iDdHZvdtABclp1dU9W");

        CustomUserDetails userDetails = new CustomUserDetails(testMember);

        //SecurityContext에 Authentication 설정
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        //when : MockMvc 호출
        String responseContent = mvc.perform(MockMvcRequestBuilders.get("/api/admin/kiosk/list"))
                .andExpect(status().isOk())     //HTTP 상태 코드 200 OK
                .andDo(print())
                .andReturn()        //응답 결과 반환
                .getResponse()      //응답 객체
                .getContentAsString();          //응답 본문을 문자열로 반환

        //then : 응답 내용 출력
        log.info("Kiosk List >> {}", responseContent);
    }

    @Test
    @DisplayName("키오스크 전체 조회 요청 - 주소 검색")
    void testKioskListWithAddress() throws Exception {

        //given : 테스트용 CustomUserDetails 생성
        MemberVO testMember = new MemberVO();
        testMember.setPhone("010-2222-3333");
        testMember.setRole(Role.ADMIN);
        testMember.setPassword("$2a$10$qjH49PuTf1e3yPPKqC0WZe4NTnP9vTz8az1iDdHZvdtABclp1dU9W");

        CustomUserDetails userDetails = new CustomUserDetails(testMember);

        //SecurityContext에 Authentication 설정
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        //검색 조건 생성 (Criteria)
        KioskCriteria kcri = new KioskCriteria();
        kcri.setKeyword("마포구");

        //when : MockMvc 호출
        String responseContent = mvc.perform(MockMvcRequestBuilders.get("/api/admin/kiosk/list")
                        .param("keyword", kcri.getKeyword()))
                .andExpect(status().isOk())     //HTTP 상태 코드 200 OK
                .andDo(print())
                .andReturn()        //응답 결과 반환
                .getResponse()      //응답 객체
                .getContentAsString();          //응답 본문을 문자열로 반환

        //then : 응답 내용 출력
        log.info("Kiosk List >> {}", responseContent);
    }

    @Test
    @DisplayName("키오스크 장치 단건 조회")
    void testKioskDetail() throws Exception {

        //given : 테스트용 CustomUserDetails 생성
        MemberVO testMember = new MemberVO();
        testMember.setPhone("010-2222-3333");
        testMember.setRole(Role.ADMIN);
        testMember.setPassword("$2a$10$qjH49PuTf1e3yPPKqC0WZe4NTnP9vTz8az1iDdHZvdtABclp1dU9W");

        CustomUserDetails userDetails = new CustomUserDetails(testMember);

        //SecurityContext에 Authentication 설정
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        //when : MockMvc 호출
        String responseContent = mvc.perform(MockMvcRequestBuilders.get("/api/admin/kiosk/1"))
                .andExpect(status().isOk())     //HTTP 상태 코드 200 OK
                .andDo(print())
                .andReturn()        //응답 결과 반환
                .getResponse()      //응답 객체
                .getContentAsString();          //응답 본문을 문자열로 반환

        //then : 결과 검증
        log.info("Kiosk 1 >> {}", responseContent);
    }

    @Test
    @DisplayName("키오스크 장치 등록 요청")
    @Rollback(false)    //DB 반영
    void testRegisterKiosk() throws Exception {

        //given : 테스트용 CustomUserDetails 생성
        MemberVO testMember = new MemberVO();
        testMember.setPhone("010-2222-3333");
        testMember.setRole(Role.ADMIN);
        testMember.setPassword("$2a$10$qjH49PuTf1e3yPPKqC0WZe4NTnP9vTz8az1iDdHZvdtABclp1dU9W");

        CustomUserDetails userDetails = new CustomUserDetails(testMember);

        //SecurityContext에 Authentication 설정
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        //등록할 키오스크 정보 DTO
        KioskResponse kioskDto = new KioskResponse();
        kioskDto.setRecycleId(1L);
        kioskDto.setName("test 키오스크");
        kioskDto.setLocation("서울 강남구");
        kioskDto.setLat(37.123456);
        kioskDto.setLng(127.123456);
        kioskDto.setSwVersion("v1.0.0");

        //when : MockMvc POST 요청
        mvc.perform(MockMvcRequestBuilders.post("/api/admin/kiosk/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(new ObjectMapper().writeValueAsString(kioskDto)))
                .andExpect(status().isCreated())    //HTTP 201 CREATED
                .andDo(print());
    }

    @Test
    @DisplayName("키오스크 장치 수정 요청")
    @Rollback(false)    //DB 반영
    void testUpdateKiosk() throws Exception {

        //given : 테스트용 CustomUserDetails 생성
        MemberVO testMember = new MemberVO();
        testMember.setPhone("010-2222-3333");
        testMember.setRole(Role.ADMIN);
        testMember.setPassword("$2a$10$qjH49PuTf1e3yPPKqC0WZe4NTnP9vTz8az1iDdHZvdtABclp1dU9W");

        CustomUserDetails userDetails = new CustomUserDetails(testMember);

        //SecurityContext에 Authentication 설정
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        //수정할 키오스크 정보 DTO (기존 데이터 조회하여 Name만 수정)
        KioskResponse kioskDto = kioskService.read(8L);
        kioskDto.setName("update 키오스크");

        //when : MockMvc PUT 요청
        mvc.perform(MockMvcRequestBuilders.put("/api/admin/kiosk/8")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(kioskDto)))
                .andExpect(status().isOk()) 
                .andDo(print());    
    }

    @Test
    @DisplayName("키오스크 장치 삭제 요청")
    @Rollback(false)        //DB 반영
    void testDeleteKiosk() throws Exception {

        //given : 테스트용 CustomUserDetails 생성
        MemberVO testMember = new MemberVO();
        testMember.setPhone("010-2222-3333");
        testMember.setRole(Role.ADMIN);
        testMember.setPassword("$2a$10$qjH49PuTf1e3yPPKqC0WZe4NTnP9vTz8az1iDdHZvdtABclp1dU9W");

        CustomUserDetails userDetails = new CustomUserDetails(testMember);

        //SecurityContext에 Authentication 설정
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        //when : MockMvc DELETE 요청
        mvc.perform(MockMvcRequestBuilders.delete("/api/admin/kiosk/{kioskId}", 8L))
                .andExpect(status().isNoContent())      //HTTP 204 상태코드
                .andDo(print()); 
    }

    @Test
    @DisplayName("키오스크 실행 세션 전체 조회")
    void testKioskRunList() throws Exception {

        //given : 테스트용 CustomUserDetails 생성
        MemberVO testMember = new MemberVO();
        testMember.setPhone("010-2222-3333");
        testMember.setRole(Role.ADMIN);
        testMember.setPassword("$2a$10$qjH49PuTf1e3yPPKqC0WZe4NTnP9vTz8az1iDdHZvdtABclp1dU9W");

        CustomUserDetails userDetails = new CustomUserDetails(testMember);

        //SecurityContext에 Authentication 설정
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        //when : MockMvc GET 요청
        String responseContent = mvc.perform(MockMvcRequestBuilders.get("/api/admin/kiosk/log/list"))
                .andExpect(status().isOk())     //HTTP 상태 코드 200 OK
                .andDo(print())
                .andReturn()        //응답 결과 반환
                .getResponse()      //응답 객체
                .getContentAsString();          //응답 본문을 문자열로 반환

        //then : 응답 내용 출력
        log.info("Kiosk Run List >> {}", responseContent);
    }

    @Test
    @DisplayName("키오스크 실행 세션 단건 조회")
    void testKioskRunDetail() throws Exception {

        //given : 테스트용 CustomUserDetails 생성
        MemberVO testMember = new MemberVO();
        testMember.setPhone("010-2222-3333");
        testMember.setRole(Role.ADMIN);
        testMember.setPassword("$2a$10$qjH49PuTf1e3yPPKqC0WZe4NTnP9vTz8az1iDdHZvdtABclp1dU9W");

        CustomUserDetails userDetails = new CustomUserDetails(testMember);

        //SecurityContext에 Authentication 설정
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        //when : MockMvc GET 요청
        String responseContent = mvc.perform(MockMvcRequestBuilders.get("/api/admin/kiosk/log/{runId}", 1L))
                .andExpect(status().isOk())     //HTTP 상태 코드 200 OK
                .andDo(print())
                .andReturn()        //응답 결과 반환
                .getResponse()      //응답 객체
                .getContentAsString();          //응답 본문을 문자열로 반환

        //then : 응답 내용 출력
        log.info("Kiosk Run >> {}", responseContent);
    }
}