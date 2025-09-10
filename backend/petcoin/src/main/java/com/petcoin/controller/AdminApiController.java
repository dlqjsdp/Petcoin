package com.petcoin.controller;

import com.petcoin.constant.RequestStatus;
import com.petcoin.constant.Role;
import com.petcoin.dto.*;
import com.petcoin.security.CustomUserDetails;
import com.petcoin.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/*
 * 관리자 페이지의 요청을 처리하는 Api Controller
 * 관리자 페이지 : 회원 관리, 포인트 관리, 수거내역, 대시보드
 * @author : sehui
 * @fileName : AdminApiController
 * @since : 250827
 * @history
 *  - 250827 | sehui | 전체 회원 조회 요청 메서드 생성
 *  - 250827 | sehui | 회원 정보 단건 조회 요청 메서드 생성
 *  - 250829 | sehui | 전체 회원 조회 요청에 페이징 처리를 위한 전체 회원 수 조회 추가
 *  - 250829 | sehui | 포인트 환급 목록 조회 요청 메서드 생성
 *  - 250829 | sehui | 포인트 환급 단건 조회 요청 메서드 생성
 *  - 250829 | sehui | 포인트 환급 처리 요청 메서드 생성
 *  - 250902 | sehui | 전체 무인 회수기 수거 내역 조회 요청 메서드 생성
 *  - 250905 | sehui | 관리자 권한 메서드 생성하여 코드 중복 방지
 *  - 250909 | sehui | 대시보드 조회 요청 메서드 생성
 *  - 250910 | sehui | 포인트 환급 처리 요청 메서드 잔액 차감과 관계없이 상태 변경되도록 수정
 */

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
@Slf4j
public class AdminApiController {

    private final MemberService memberService;
    private final PointHisService pointHisService;
    private final PointReqService pointReqService;
    private final RecycleStatsService recycleStatsService;
    private final DashboardService dashboardService;

    //관리자 권한 확인
    private boolean isAdmin(Authentication auth) {
        return auth != null && auth.isAuthenticated() &&
                auth.getAuthorities().stream()
                        .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
    }

    //전체 회원 조회 요청
    @GetMapping("/member/list")
    public ResponseEntity<Map<String, Object>> memberList(Authentication auth, Criteria cri) {

        //관리자 권한 확인
        if(!isAdmin(auth)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Map<String, Object> response = new HashMap<>();

        try{
            //전체 회원 목록 조회
            List<MemberListDto> memberListDto = memberService.getMemberList(cri);

            int totalMember = memberService.getTotalMember();   //전체 회원 수 조회
            PageDto pageInfo = new PageDto(cri, totalMember);     //페이지 정보 생성

            response.put("memberList", memberListDto);
            response.put("pageInfo", pageInfo);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e) {
            response.put("errorMessage", "회원을 조회할 수 없습니다.");

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    //회원 정보 단건 조회 요청
    @GetMapping("/member/{memberId}")
    public ResponseEntity<Map<String, Object>> memberDetail(@PathVariable("memberId") Long memberId, Authentication auth) {

        //관리자 권한 확인
        if(!isAdmin(auth)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Map<String, Object> response = new HashMap<>();

        try{
            //회원 정보 + 포인트 내역 조회
            MemberDetailDto memberDto = memberService.getMemberById(memberId);

            response.put("member", memberDto);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e) {
            response.put("errorMessage", "해당 ID로 회원 정보와 포인트 내역을 조회할 수 없습니다.");

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    //포인트 환급 목록 조회 요청
    @GetMapping("/point/list")
    public ResponseEntity<Map<String, Object>> pointList(Authentication auth, Criteria cri) {

        //관리자 권한 확인
        if(!isAdmin(auth)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Map<String, Object> response = new HashMap<>();

        try{
            //전체 포인트 환급 목록 조회
            List<PointRequestDto> pointReqList = pointReqService.getPointRequestsWithPaging(cri);

            response.put("pointReqList", pointReqList);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (DataAccessException dae) {
            response.put("errorMessage", "데이터베이스 오류로 인해 조회할 수 없습니다.");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }catch (Exception e) {
            response.put("errorMessage", "알 수 없는 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    //포인트 환급 단건 조회 요청
    @GetMapping("/point/{requestId}")
    public ResponseEntity<Map<String, Object>> pointDetail(@PathVariable("requestId") Long requestId, Authentication auth) {

        //관리자 권한 확인
        if(!isAdmin(auth)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Map<String, Object> response = new HashMap<>();

        try{
            //포인트 환급 단건 조회
            PointRequestDto pointReqDetail = pointReqService.getPointRequestById(requestId);

            response.put("pointReqDetail", pointReqDetail);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e) {
            response.put("errorMessage", "해당 ID로 포인트 환급 요청을 조회할 수 없습니다.");

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    //포인트 환급 처리 요청
    @PutMapping("/point/process/{requestId}")
    public ResponseEntity<Map<String, Object>> processPoint(@PathVariable Long requestId,
                                               @RequestBody PointRequestProcessDto pointRequestDto,
                                               Authentication auth) {

        //관리자 권한 확인
        if(!isAdmin(auth)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Map<String, Object> response = new HashMap<>();

        try{
            //1. 환급 요청 정보 DB에서 조회
            PointRequestDto pointReqDto = pointReqService.getPointRequestById(requestId);

            boolean pointDeducted = false;

            //2. 포인트 잔액 조회 후 포인트 차감 시도
            if(RequestStatus.APPROVED.equals(pointRequestDto.getRequestStatus())) {
                pointDeducted = pointHisService.addPointHistory(pointReqDto);

                if(!pointDeducted) {
                    response.put("errorMessage", "포인트 잔액 부족으로 차감 실패, 상태만 변경됨");
                }
            }

            //3. 환급 요청 상태 변경
            int updateStatusResult = pointReqService.updatePointRequestStatus(pointRequestDto);

            if(updateStatusResult != 1) {
                response.put("errorMessage", "환급 요청 상태 변경에 실패");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }

            response.put("message", "환급 요청 처리 완료");
            response.put("pointDeducted", pointDeducted);   //프론트에서 포인트 차감 여부 확인용

            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e) {
            e.printStackTrace();
            response.put("errorMessage", "서버 오류 발생: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    //전체 무인 회수기 수거 내역 조회 요청
    @GetMapping("/recycle/stats")
    public ResponseEntity<Map<String, Object>> getAllRecycleStats(Authentication auth, Criteria cri) {

        //관리자 권한 확인
        if(!isAdmin(auth)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Map<String, Object> response = new HashMap<>();

        try{
            //전체 무인 회수기 수거 내역 조회
            List<RecycleStatsDto> statsList = recycleStatsService.getRecycleStatsWithPaging(cri);

            int totalRecycle = recycleStatsService.getTotalRecycle();        //전체 무인 회수기 수 조회
            PageDto pageInfo = new PageDto(cri, totalRecycle);              //페이지 정보 생성

            response.put("statsList", statsList);
            response.put("pageInfo", pageInfo);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e) {
            response.put("errorMessage", "전체 무인 회수기를 조회할 수 없습니다.");

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    //대시보드 조회 요청
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> dashboard(Authentication auth) {

        //관리자 권한 확인
        if(!isAdmin(auth)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        //대시보드 조회 요청
        DashboardResponse dashboard = dashboardService.getDashboardData();

        //데이터 없을 경우 204 No Content 응답 처리
        if(dashboard == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        return ResponseEntity.status(HttpStatus.OK).body(dashboard);
    }
}
