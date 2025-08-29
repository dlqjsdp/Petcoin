package com.petcoin.service;

/*
 * @fileName : MemberService
 * 로그인/회원가입 관련 Service 인터페이스
 * @author : heekyung
 * @since : 250826
 * @history
 * - 250826 | heekyung | MemberService 생성 / 연락처로 회원 조회 코드 작성
 * - 250827 | sehui | 전체 회원 조회 기능 추가
 * - 250827 | sehui | 회원 정보 단건 조회 기능 추가
 * - 250829 | sehui | 페이징 처리를 위한 전체 회원 수 조회 기능 추가
 */

import com.petcoin.domain.MemberVO;
import com.petcoin.dto.Criteria;
import com.petcoin.dto.MemberDetailDto;
import com.petcoin.dto.MemberListDto;

import java.util.List;

public interface MemberService {

    //DB에서 핸드폰 번호 조회(없으면 null)
    public MemberVO getMemberByPhone(String phone);

    //휴대폰 번호로 회원 가입 (이미 존재 시 기존 회원 반환)
    public MemberVO registerMember(String phone);

    //전체 회원 조회
    public List<MemberListDto> getMemberList(Criteria cri);

    //회원 정보 단건 조회
    public MemberDetailDto getMemberById(Long memberId);

    //전체 회원 수 조회
    public int getTotalMember();
}
