package com.petcoin.controller;

import com.petcoin.constant.Role;
import com.petcoin.domain.MemberVO;
import com.petcoin.dto.Criteria;
import com.petcoin.security.CustomUserDetails;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
 */

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
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
}