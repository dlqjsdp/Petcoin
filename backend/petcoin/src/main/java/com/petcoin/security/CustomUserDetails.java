package com.petcoin.security;

import com.petcoin.constant.Role;
import com.petcoin.domain.MemberVO;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/*
 * Spring Security에서 사용하는 사용자 정보 객체
 * @author : sehui
 * @fileName : CustomUserDetails
 * @since : 250827
 * @history
 *  - 250827 | sehui | getPhone() 메서드 생성
 */

@Getter
@Setter
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetails implements UserDetails {

    private final MemberVO memberVO;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    //휴대폰 번호 꺼내서 사용
    public String getPhone() {
        return memberVO.getPhone();
    }

    //사용하지 않는 메서드
    @Override
    public String getPassword() {
        return "";
    }

    //ControllerTest에서 사용하는 메서드
    @Override
    public String getUsername() {
        return memberVO.getPhone();
    }
}
