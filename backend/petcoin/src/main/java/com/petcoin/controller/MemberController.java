package com.petcoin.controller;

/*
 * @fileName : MemberController
 * 로그인/회원가입 관련 Controller 클래스
 * @author : heekyung
 * @since : 250827
 * @history
 * - 250827 | heekyung | MemberController 생성 / 연락처로 회원 조회 코드 작성
 * - 250828 | heekyung | 로그인 시 비밀번호 반드시 필요하여 비밀번호 관련 코드 추가
 * - 250829 | heekyung | 비밀번호 없이 전화번호로만 로그인 가능하게 하는 세션 코드 추가
 */

import com.petcoin.domain.MemberVO;
import com.petcoin.dto.ExistsResponse;
import com.petcoin.dto.PhoneRequest;
import com.petcoin.service.MemberService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
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
    public ResponseEntity<ExistsResponse> check(@Valid @RequestBody PhoneRequest req) {
        String phone = sanitize(req.getPhone()); //숫자만 추출(하이픈 제거)
        boolean exists = (memberService.getMemberByPhone(phone) != null);
        return ResponseEntity.ok(new ExistsResponse(exists));
    }

    //모달에서 연락처 기재 시 없는 번호면 회원가입, 있으면 반환
    @PostMapping("/register")
    public ResponseEntity<MemberVO> register(@Valid @RequestBody PhoneRequest req, HttpServletResponse response, HttpServletRequest request) { //JSON 바디를 PhoneRequest로 매핑
        String phone = sanitize(req.getPhone()); //핸드폰 번호에서 숫자만 남게 정규화
        if (phone.length() < 10 || phone.length() > 11) { //핸드폰 번호가 10~11자 아니면
            return ResponseEntity.badRequest().build(); //실패 응답
        }
        //1. 신규면 내부에서 랜덤 비번을 해시로 저장
        MemberVO memberVO = memberService.registerMember(phone);

        //2. 인증 성공 처리 -> 세션에 로그인 심기
        loginAs(memberVO, request, response);

        return ResponseEntity.ok(memberVO);
    }

    //컨트롤러 내부 로그인 도우미
    private void loginAs(MemberVO member, HttpServletRequest request, HttpServletResponse response) {
        var principal = new com.petcoin.security.CustomUserDetails(member); //시큐리티가 이해할 수 있는 사용자 정보 객체로 래핑
        //Authentication : “인증 정보”를 담는 핵심 인터페이스
        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        SecurityContext context = SecurityContextHolder.getContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);

        //세션에도 저장(다음 요청부터 인증 유지)
        new HttpSessionSecurityContextRepository().saveContext(context, request, response);
    }
}

