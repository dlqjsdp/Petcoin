package com.petcoin.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.petcoin.dto.KioskRunStartRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/*
 * KioskRunApiController 통합 테스트
 * - MockMvc 기반으로 API 엔드포인트 동작 검증
 * - 실행 세션의 시작/종료/취소 API가 정상 동작하는지 확인
 *
 * 주요 검증 시나리오:
 *  - start_success_201   : ONLINE 키오스크 + 유효한 회원 → 201 Created
 *  - end_success_200     : RUNNING 세션 정상 종료 → 200 OK + status=COMPLETED
 *  - cancel_success_200  : RUNNING 세션 정상 취소 → 200 OK + status=CANCELLED
 *
 * @author  : yukyeong
 * @fileName: KioskRunApiControllerTest.java
 * @since   : 250830
 * @history
 *   - 250830 | yukyeong | 최초 생성
 *                       - 실행 세션 시작(start_success_201) 성공 케이스 추가
 *                       - 실행 세션 종료(end_success_200) 성공 케이스 추가
 *                       - 실행 세션 취소(cancel_success_200) 성공 케이스 추가
 */

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class KioskRunApiControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    // DTO → JSON 문자열 직렬화 유틸
    private String toJson(Object dto) throws Exception {
        return objectMapper.writeValueAsString(dto);
    }

    // 응답 바디(JSON)에서 runId만 뽑아오는 유틸
    private long extractRunId(String body) throws Exception {
        JsonNode node = objectMapper.readTree(body);
        return node.path("runId").asLong();
    }

    @Test
    @WithMockUser(username = "testUser", roles = {"USER"}) // 필요시 ADMIN 등 맞춰 변경
    @DisplayName("성공: kioskId=1(ONLINE) + memberId=1 → 201 Created + Location")
    public void start_success_201() throws Exception {
        // Given: 요청 DTO 구성
        KioskRunStartRequest req = new KioskRunStartRequest();
        req.setKioskId(1L); // 현재 DB: kiosk_id=1은 ONLINE
        req.setMemberId(1L); // 현재 DB: member_id=1 존재

        // when & then: 실행 시작 호출 후 응답 검증
        mockMvc.perform(post("/api/kiosk-runs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(toJson(req)))
                .andExpect(status().isCreated()) // 201 Created 기대
                // Location 헤더는 정확한 runId를 가정하지 않고 prefix만 확인
                .andExpect(header().string("Location", containsString("/api/kiosk-runs/")))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON)) // 응답 Content-Type이 application/json인지 확인
                // 바디 필드 검증
                .andExpect(jsonPath("$.runId", notNullValue()))
                .andExpect(jsonPath("$.kioskId").value(1L))
                .andExpect(jsonPath("$.memberId").value(1L));
    }

    @Test
    @WithMockUser(username = "testUser", roles = {"USER"})
    @DisplayName("성공: RUNNING 세션 종료 → 200 OK + status=COMPLETED")
    public void end_success_200() throws Exception {
        // 1) Given : RUNNING 시작
        KioskRunStartRequest req = new KioskRunStartRequest();
        req.setKioskId(1L); // ONLINE
        req.setMemberId(1L); // 존재하는 회원

        String startBody = mockMvc.perform(post("/api/kiosk-runs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(toJson(req)))
                .andExpect(status().isCreated()) // 실행 시작 성공 → 201
                .andReturn()
                .getResponse()
                .getContentAsString();

        long runId = extractRunId(startBody); // 이후 종료/취소 호출에 사용할 runId 추출

        // 2) When : 종료 API 호출 & Then : 200 OK + COMPLETED 상태
        mockMvc.perform(post("/api/kiosk-runs/{runId}/end", runId))
                .andExpect(status().isOk()) // HTTP 200 OK
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.runId").value(runId))
                .andExpect(jsonPath("$.status").value("COMPLETED")); // 서비스가 COMPLETED로 세팅한다고 가정
    }


    @Test
    @WithMockUser(username = "testUser", roles = {"USER"})
    @DisplayName("성공: RUNNING 세션 취소 → 200 OK + status=CANCELLED")
    public void cancel_success_200() throws Exception {
        // Given: RUNNING 세션 시작
        KioskRunStartRequest req = new KioskRunStartRequest();
        req.setKioskId(1L);
        req.setMemberId(1L);

        String startBody = mockMvc.perform(post("/api/kiosk-runs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(toJson(req)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        long runId = extractRunId(startBody);

        // When: 취소 호출 & Then: 200 OK + CANCELLED 상태
        mockMvc.perform(post("/api/kiosk-runs/{runId}/cancel", runId))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.runId").value(runId))
                .andExpect(jsonPath("$.status").value("CANCELLED")); // 서비스가 CANCELLED로 세팅한다고 가정
    }

    //이하 이지혜 포인트 적립 테스트용 테스트
    @Test
    @WithMockUser(username = "testUser", roles = {"USER"}) // 필요시 ADMIN 등 맞춰 변경
    @DisplayName("성공: kioskId=1(ONLINE) + memberId=1 → 201 Created + Location")
    public void start_success() throws Exception {
        // Given: 요청 DTO 구성
        KioskRunStartRequest req = new KioskRunStartRequest();
        req.setKioskId(1L); // 현재 DB: kiosk_id=1은 ONLINE
        req.setMemberId(4L); // 현재 DB: member_id=1 존재

        // when & then: 실행 시작 호출 후 응답 검증
        mockMvc.perform(post("/api/kiosk-runs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(toJson(req)))
                .andExpect(status().isCreated()) // 201 Created 기대
                // Location 헤더는 정확한 runId를 가정하지 않고 prefix만 확인
                .andExpect(header().string("Location", containsString("/api/kiosk-runs/")))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON)) // 응답 Content-Type이 application/json인지 확인
                // 바디 필드 검증
                .andExpect(jsonPath("$.runId", notNullValue()))
                .andExpect(jsonPath("$.kioskId").value(1L))
                .andExpect(jsonPath("$.memberId").value(4L));
    }

    @Test
    @WithMockUser(username = "testUser", roles = {"USER"})
    @DisplayName("성공: RUNNING 세션 종료 → 200 OK + status=COMPLETED")
    public void end_success() throws Exception {
        // 1) Given : RUNNING 시작
        KioskRunStartRequest req = new KioskRunStartRequest();
        req.setKioskId(1L); // ONLINE
        req.setMemberId(4L); // 존재하는 회원

        String startBody = mockMvc.perform(post("/api/kiosk-runs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(toJson(req)))
                .andExpect(status().isCreated()) // 실행 시작 성공 → 201
                .andReturn()
                .getResponse()
                .getContentAsString();

        long runId = extractRunId(startBody); // 이후 종료/취소 호출에 사용할 runId 추출

        // 2) When : 종료 API 호출 & Then : 200 OK + COMPLETED 상태
        mockMvc.perform(post("/api/kiosk-runs/{runId}/end", runId))
                .andExpect(status().isOk()) // HTTP 200 OK
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.runId").value(runId))
                .andExpect(jsonPath("$.status").value("COMPLETED")); // 서비스가 COMPLETED로 세팅한다고 가정
    }


    @Test
    @WithMockUser(username = "testUser", roles = {"USER"})
    @DisplayName("성공: RUNNING 세션 취소 → 200 OK + status=CANCELLED")
    public void cancel_success() throws Exception {
        // Given: RUNNING 세션 시작
        KioskRunStartRequest req = new KioskRunStartRequest();
        req.setKioskId(1L);
        req.setMemberId(1L);

        String startBody = mockMvc.perform(post("/api/kiosk-runs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(toJson(req)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        long runId = extractRunId(startBody);

        // When: 취소 호출 & Then: 200 OK + CANCELLED 상태
        mockMvc.perform(post("/api/kiosk-runs/{runId}/cancel", runId))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.runId").value(runId))
                .andExpect(jsonPath("$.status").value("CANCELLED")); // 서비스가 CANCELLED로 세팅한다고 가정
    }

}