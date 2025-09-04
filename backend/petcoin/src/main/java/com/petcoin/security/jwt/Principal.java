package com.petcoin.security.jwt;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/*
 * @fileName : MemberPrincipal
 *  SecurityContext에 저장되는 로그인 사용자 최소 정보(memberId, phone, role)를 담는 전용 클래스
 * @author : heekyung
 * @since : 250904
 * @history
 * - 250904 | heekyung | Principal 전용 클래스 생성 (memberId, phone, role 필드 포함)
 */

@RequiredArgsConstructor
public class Principal {

    public record MemberPrincipal(Long memberId, String phone, String role) { }
}
