package com.petcoin.service;

/*
 * @fileName : MemberService
 * 로그인/회원가입 관련 Service 인터페이스
 * @author : heekyung
 * @since : 250826
 * @history
 * - 250826 | heekyung | MemberService 생성 / 연락처로 회원 조회 코드 작성
 */

import com.petcoin.domain.MemberVO;

public interface MemberService {

    //DB에서 핸드폰 번호 조회(없으면 null)
    public MemberVO getMemberByPhone(String phone);

    //휴대폰 번호로 회원 가입 (이미 존재 시 기존 회원 반환)
    public MemberVO registerMember(String phone);

}
