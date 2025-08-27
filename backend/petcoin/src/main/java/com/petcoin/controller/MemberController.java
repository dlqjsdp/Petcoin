package com.petcoin.controller;

/*
 * @fileName : MemberController
 * 로그인/회원가입 관련 Controller 클래스
 * @author : heekyung
 * @since : 250827
 * @history
 * - 250827 | heekyung | MemberController 생성 / 연락처로 회원 조회 코드 작성
 */

import com.petcoin.domain.MemberVO;
import com.petcoin.dto.ExistsResponse;
import com.petcoin.dto.PhoneRequest;
import com.petcoin.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/member")
@Slf4j
public class MemberController {

    private final MemberService memberService;

    //프론트에서 넘어온 핸드폰 번호 값 숫자만 남기게 수정(010-1111-1111 > 01011111111)
    private String sanitize(String raw) {
        if (raw == null) return "";
        return raw.replaceAll("[^0-9]", "");
    }

    //연락처 DB에 존재 여부 확인(조회)
    //exists 값이 true면 프론트에서 성공 처리
    @PostMapping("/check")
    public ResponseEntity<ExistsResponse> check(@RequestBody PhoneRequest req) {
        String phone = sanitize(req.getPhone()); //숫자만 추출(하이픈 제거)
        boolean exists = (memberService.getMemberByPhone(phone) != null);
        return ResponseEntity.ok(new ExistsResponse(exists));
    }

    //모달에서 연락처 기재 시 없는 번호면 회원가입, 있으면 반환
    @PostMapping("/register")
    public ResponseEntity<MemberVO> register(@RequestBody PhoneRequest req) {
        String phone = sanitize(req.getPhone());
        MemberVO memberVO = memberService.registerMember(phone); //없으면 등록, 있으면 반환
        return ResponseEntity.ok(memberVO);
    }
}

