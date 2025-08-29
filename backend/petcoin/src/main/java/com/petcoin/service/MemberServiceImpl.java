package com.petcoin.service;

import com.petcoin.constant.Role;
import com.petcoin.domain.MemberVO;
import com.petcoin.dto.Criteria;
import com.petcoin.dto.MemberDetailDto;
import com.petcoin.dto.MemberListDto;
import com.petcoin.dto.PointHistoryDto;
import com.petcoin.mapper.MemberMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;

/*
 * @fileName : MemberServiceImpl
 * MemberService 인터페이스와 연결된 클래스
 * @author : heekyung
 * @since : 250826
 * @history
 * - 250826 | heekyung | MemberServiceImpl 생성 / 연락처로 회원 조회 코드 작성
 * - 250827 | sehui | 전체 회원 조회 기능 추가
 * - 250827 | sehui | 회원 정보 단건 조회 기능 (+포인트 내역 조회) 추가
 * - 250828 | heekyung | 로그인 시 비밀번호 반드시 필요하여 비밀번호 관련 코드 추가 | 암호화 저장
 */

@Service
@RequiredArgsConstructor
@Slf4j
public class MemberServiceImpl implements MemberService {

    private final MemberMapper memberMapper;
//    private final PointService pointService;
    private final PasswordEncoder passwordEncoder;
    private final PointHisService pointHisService;

    //DB에서 핸드폰 번호 조회(없으면 null)
    @Override
    public MemberVO getMemberByPhone(String phone){
        return memberMapper.findByPhone(phone);
    }

    //비밀번호 생성 유틸 메서드 생성(랜덤 문자열 생성 -> 비밀번호, 임시코드 등 발급) | 외부에서 사용하지 않는다면 Service 내부에 기재
    //외부에서 사용하는 경우 : 임시 비밀번호 발급, 초대코드 생성, 임시 토큰 등
    private String generateRandomSecret(int len) {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[len]; //길이 len의 바이트 생성
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }


    //휴대폰 번호로 회원 가입 (이미 존재 시 기존 회원 반환)
    @Override
    @Transactional
    public MemberVO registerMember(String phone) {
        //1. 중복 체크
        MemberVO found = memberMapper.findByPhone(phone);
        if(found != null) return found;

        //2. 서버 내부용 랜덤 비밀번호 생성 -> 해시
        String raw = generateRandomSecret(24); //서버 내부용 랜덤 비밀번호 생성(24 바이트)
        String encoded = passwordEncoder.encode(raw); //랜덤 비밀번호 암호화

        //3. 신규라면 DB에 저장
        MemberVO newMember = MemberVO.builder()
                .phone(phone)
                .role(Role.USER)
                .password(encoded) //해시 저장
                .build();
        memberMapper.insertMember(newMember);
        return newMember;
    }

    //전체 회원 조회
    @Override
    public List<MemberListDto> getMemberList(Criteria cri) {
        List<MemberListDto> memberList = memberMapper.findMemberListWithPaging(cri);

        if(memberList == null || memberList.isEmpty()) {
            throw new IllegalArgumentException("회원을 조회할 수 없습니다.");
        }
        return memberList;
    }

    //회원 정보 단건 조회 (+ 포인트 조회 내역 DTO 반환)
    @Override
    public MemberDetailDto getMemberById(Long memberId) {
        //1. 회원 정보 단건 조회
        MemberVO memberVo = memberMapper.findMemberById(memberId);

        if(memberVo == null) {
            throw new IllegalArgumentException("해당 ID로 회원을 조회할 수 없습니다.");
        }

        //2. VO -> DTO 변환 (회원 정보)
        MemberDetailDto memberDto = MemberDetailDto.builder()
                .memberId(memberId)
                .phone(memberVo.getPhone())
                .role(memberVo.getRole())
                .build();
        
        //3. 포인트 내역 조회
        List<PointHistoryDto> pointHistoryList = pointHisService.getPointHistoryById(memberId);

        //4. DTO에 포인트 내역 추가
        memberDto.setPointHistory(pointHistoryList);

        return memberDto;
    }
}
