package com.petcoin.security;

import com.petcoin.constant.Role;
import com.petcoin.domain.MemberVO;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/*
 * Spring Security에서 사용하는 사용자 정보 객체
 * @author : sehui
 * @fileName : CustomUserDetails
 * @since : 250827
 * @history
 * - 250827 | sehui | getPhone() 메서드 생성
 * - 250828 | heekyung | 비밀번호/권한 매핑 로직 추가 (getPassword, getAuthorities)
 */

@Getter
@Setter
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetails implements UserDetails {

    private final MemberVO memberVO;

    //권한 목록 반환(인가에 사용) -> 사용자의 권한을 시큐리티가 읽을 수 있는 형태로 변환
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Role role = memberVO.getRole();
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    //휴대폰 번호 꺼내서 사용
    public String getPhone() {
        return memberVO.getPhone();
    }

    //DB 에 저장된 BCrypt 해시 비밀번호 제공(인증 시 사용) -> DB에 저장된 비밀번호를 시큐리티에 전달
    @Override
    public String getPassword() {
        return memberVO.getPassword();
    }

    //시큐리티에서 계정 식별자로 쓰일 phone 제공
    @Override
    public String getUsername() {
        return memberVO.getPhone();
    }

    //MemberVO 의 PK 접근이 필요할 수 있을 때 사용
    public Long getMemberId() {
        return memberVO.getMemberId();
    }

    //계정 상태 체크용
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    @Override
    public boolean isEnabled() {
        return true;
    }
}
