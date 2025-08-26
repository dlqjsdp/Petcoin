package com.petcoin.service;

import com.petcoin.constant.Role;
import com.petcoin.domain.MemberVO;
import com.petcoin.mapper.MemberMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/*
 * @fileName : MemberServiceImpl
 * MemberService 인터페이스와 연결된 클래스
 * @author : heekyung
 * @since : 250826
 * @history
 * - 250826 | heekyung | MemberServiceImpl 생성 / 연락처로 회원 조회 코드 작성
 */

@Service
@RequiredArgsConstructor
@Slf4j
public class MemberServiceImpl implements MemberService {

    private final MemberMapper memberMapper;

    //DB에서 핸드폰 번호 조회(없으면 null)
    @Override
    public MemberVO getMemberByPhone(String phone){
        return memberMapper.findByPhone(phone);
    }

    //휴대폰 번호로 회원 가입 (이미 존재 시 기존 회원 반환)
    @Override
    public MemberVO registerMember(String phone){
        // 1. DB에 저장되어 있는지 확인
        MemberVO foundMember = memberMapper.findByPhone(phone);

        if(foundMember != null)
            return foundMember;

            //2. 없으면 신규가입
            MemberVO newMember = MemberVO.builder()
                    .phone(phone)
                    .role(Role.USER)
                    .build();
            memberMapper.insertMember(newMember);

            return newMember;
    }
}
