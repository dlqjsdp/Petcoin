package com.petcoin.controller;

import com.petcoin.constant.Role;
import com.petcoin.dto.Criteria;
import com.petcoin.dto.MemberDetailDto;
import com.petcoin.dto.MemberListDto;
import com.petcoin.security.CustomUserDetails;
import com.petcoin.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/*
 * 관리자 페이지의 요청을 처리하는 Api Controller
 * @author : sehui
 * @fileName : AdminApiController
 * @since : 250827
 * @history
 *  - 250827 | sehui | 전체 회원 조회 요청 메서드 생성
 *  - 250827 | sehui | 회원 정보 단건 조회 요청 메서드 생성
 */

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
@Slf4j
public class AdminApiController {

    private final MemberService memberService;

    //전체 회원 조회 요청
    @GetMapping("/member/list")
    public ResponseEntity<Map<String, Object>> memberList(Authentication auth, Criteria cri) {

        //로그인한 사용자의 연락처 가져오기
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        String userPhone = userDetails.getPhone();

        //관리자 권한 확인
        Role role = memberService.getMemberByPhone(userPhone).getRole();

        if(role != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Map<String, Object> response = new HashMap<>();

        try{
            //전체 회원 목록 조회
            List<MemberListDto> memberListDto = memberService.getMemberList(cri);
            response.put("memberList", memberListDto);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e) {
            response.put("errorMessage", "회원을 조회할 수 없습니다.");

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    //회원 정보 단건 조회 요청
    @GetMapping("/member/{memberId}")
    public ResponseEntity<Map<String, Object>> memberDetail(@PathVariable("memberId") Long memberId, Authentication auth) {

        //로그인한 사용자의 연락처 가져오기
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        String userPhone = userDetails.getPhone();

        //관리자 권한 확인
        Role role = memberService.getMemberByPhone(userPhone).getRole();

        if(role != Role.ADMIN) {
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
}
