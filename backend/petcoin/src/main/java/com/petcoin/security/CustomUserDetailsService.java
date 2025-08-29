package com.petcoin.security;

import com.petcoin.domain.MemberVO;
import com.petcoin.mapper.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/*
 * @fileName : CustomUserDetailsService
 * Spring Security가 인증 시 호출되는 사용자 조회 서비스 객체
 * @author : heekyung
 * @since : 250828
 * @history
 * - 250827 | heekyung | phone 기반 사용자 로딩 구현
 */

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final MemberMapper memberMapper;

    @Override
    public UserDetails loadUserByUsername(String phone) throws UsernameNotFoundException {
        MemberVO member = memberMapper.findByPhone(phone);
        if (member == null) {
            throw new UsernameNotFoundException("No such phone: " + phone);
        }
        return new CustomUserDetails(member); // Security가 인식할 수 있는 객체로 반환
    }
}
