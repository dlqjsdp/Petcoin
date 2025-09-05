package com.petcoin.controller;

import com.petcoin.constant.Role;
import com.petcoin.dto.*;
import com.petcoin.security.CustomUserDetails;
import com.petcoin.service.KioskRunService;
import com.petcoin.service.KioskService;
import com.petcoin.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/*
 * 관리자 페이지의 키오스크 관련 요청을 처리하는 Api Controller
 * 관리자 페이지 : 키오스크
 * @author : sehui
 * @fileName : AdminKioskApiController
 * @since : 250905
 * @history
 *  - 250905 | sehui | 키오스크 장치 전체/단건 조회 요청 메서드 생성
 *  - 250905 | sehui | 키오스크 장치 등록/수정/삭제 요청 메서드 생성
 *  - 250905 | sehui | 키오스크 실행 세션 전체/단건 조회 요청 메서드 생성
 */

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/kiosk")
@Slf4j
public class AdminKioskApiController {

    private final KioskService kioskService;
    private final MemberService memberService;
    private final KioskRunService kioskRunService;

    //관리자 권한 확인
    private boolean isAdmin(Authentication auth) {
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        String userPhone = userDetails.getPhone();
        Role role = memberService.getMemberByPhone(userPhone).getRole();
        return role == Role.ADMIN;
    }

    //키오스크 장치 전체 조회 요청
    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> kioskList(Authentication auth, KioskCriteria cri) {

        //관리자 권한 확인
        if(!isAdmin(auth)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Map<String, Object> response = new HashMap<>();

        try{
            //전체 키오스크 장치 목록 조회
            List<KioskResponse> kioskList = kioskService.getListWithPaging(cri);

            //전체 키오스크 장치 수 조회
            int totalKiosk = kioskService.getTotalCount(cri);
            PageDto pageInfo = new PageDto(cri, totalKiosk);

            response.put("kioskList", kioskList);
            response.put("pageInfo", pageInfo);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e) {
            response.put("errorMessage", e.getMessage());

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
    
    //키오스크 장치 단건 조회 요청
    @GetMapping("/{kioskId}")
    public ResponseEntity<Map<String, Object>> kioskDetail(Authentication auth,
                                                           @PathVariable("kioskId") Long kioskId) {
        //관리자 권한 확인
        if(!isAdmin(auth)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        Map<String, Object> response = new HashMap<>();
        
        try{
            //키오스크 장치 단건 조회
            KioskResponse kioskDetail = kioskService.read(kioskId);

            response.put("kiosk", kioskDetail);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e) {
            response.put("errorMessage", e.getMessage());

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    //키오스크 장치 등록 요청
    @PostMapping("/register")
    public ResponseEntity<?> registerKiosk(Authentication auth,
                                                             @RequestBody KioskResponse kioskDto) {

        //관리자 권한 확인
        if(!isAdmin(auth)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try{
            //키오스크 장치 등록
            kioskService.insert(kioskDto);

            return ResponseEntity.status(HttpStatus.CREATED).body(null);
        }catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    //키오스크 장치 수정 요청
    @PutMapping("/{kioskId}")
    public ResponseEntity<?> updateKiosk(Authentication auth,
                                              @PathVariable("kioskId") Long kioskId,
                                              @RequestBody KioskResponse kioskDto) {
        //관리자 권한 확인
        if(!isAdmin(auth)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            //키오스크 장치 정보 수정
            kioskService.update(kioskDto);

            return ResponseEntity.status(HttpStatus.OK).body(null);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    //키오스크 장치 삭제
    @DeleteMapping("/{kioskId}")
    public ResponseEntity<?> deleteKiosk(Authentication auth, @PathVariable("kioskId") Long kioskId) {

        //관리자 권한 확인
        if(!isAdmin(auth)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try{
            //키오스크 장치 삭제
            kioskService.softDelete(kioskId);

            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    //키오스크 실행 세션 목록 조회
    @GetMapping("/log/list")
    public ResponseEntity<Map<String, Object>> kioskRunList(Authentication auth, KioskRunCriteria kRunCri) {

        //관리자 권한 확인
        if(!isAdmin(auth)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Map<String, Object> response = new HashMap<>();

        try{
            //전체 실행 세션 목록 조회
            List<KioskRunResponse> kioskRunList = kioskRunService.getRunListWithPaging(kRunCri);

            //전체 실행 세션 수 조회
            int totalRunCount = kioskRunService.getTotalRunCount(kRunCri);
            PageDto pageInfo = new PageDto(kRunCri, totalRunCount);

            response.put("kioskRunList", kioskRunList);
            response.put("pageInfo", pageInfo);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e) {
            response.put("errorMessage", e.getMessage());

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    //키오스크 실행 세션 단건 조회
    @GetMapping("/log/{runId}")
    public ResponseEntity<Map<String, Object>> kioskRunDetail(Authentication auth, @PathVariable("runId") Long runId) {

        //관리자 권한 확인
        if(!isAdmin(auth)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Map<String, Object> response = new HashMap<>();

        try{
            //키오스크 실행 세션 단건 조회
            KioskRunResponse kioskRunDetail = kioskRunService.readRun(runId);

            response.put("kioskRun", kioskRunDetail);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e) {
            response.put("errorMessage", e.getMessage());

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}
