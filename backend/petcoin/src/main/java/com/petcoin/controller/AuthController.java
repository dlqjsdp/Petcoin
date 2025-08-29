package com.petcoin.controller;

import com.petcoin.constant.Role;
import com.petcoin.domain.MemberVO;
import com.petcoin.dto.PhoneRequest;
import com.petcoin.mapper.MemberMapper;
import com.petcoin.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Map;

/*
 * @fileName : AuthController
 * JWT 토큰 관련 Controller 클래스
 * @author : heekyung
 * @since : 250829
 * @history
 * - 250827 | heekyung | AuthController 생성 / JWT토큰으로 로그인 가능
 */

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/auth")
@Slf4j
public class AuthController {
    
    private final JwtTokenProvider jwtTokenProvider; //토큰 발급 유틸
    private final MemberMapper memberMapper; //회원 조회, 저장
    private final PasswordEncoder passwordEncoder; //비밀번호 암호화

    //프론트에서 넘어온 핸드폰 번호 값 숫자만 남기게 수정(010-1111-1111 > 01011111111)
    private String sanitize(String raw) {
        if (raw == null) return "";
        return raw == null ? "" : raw.replaceAll("[^0-9]", "");
    }

    //자동 가입 시 내부용 랜덤 비밀번호 생성
    private String generateSecret(int len) {
        var r = new SecureRandom();
        byte[] bytes = new byte[len];
        r.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    // 로그인 + 자동가입
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody PhoneRequest req,
                                   @RequestParam(defaultValue = "true") boolean allowAutoRegister) {
        //1. 전화번호 정규화(숫자만)
        String phone = sanitize(req.getPhone());
        if (phone.length() < 10 || phone.length() > 11) {
            return ResponseEntity.badRequest().body("전화번호 형식 오류");
    }
        //2. 회원 조회
        MemberVO member = memberMapper.findByPhone(phone);
        
        //3. 회원이 없으면 자동 가입
        if (member == null) {
            if (!allowAutoRegister) {
                return ResponseEntity.badRequest().body("회원 없음");
            }
            //자동가입(랜덤 비밀번호 생성 + 기본 권한 user로 저장
            String enc = passwordEncoder.encode(generateSecret(24));
            MemberVO newMember = MemberVO.builder()
                    .phone(phone)
                    .role(Role.USER)
                    .password(enc)
                    .build();
            memberMapper.insertMember(newMember);
            member = newMember;
        }
        //4. 토큰 생성
        String token = jwtTokenProvider.createToken(member.getPhone(), member.getRole().name());

        //5. JSON 응답
        return ResponseEntity.ok(Map.of("token", token));
    }

}
