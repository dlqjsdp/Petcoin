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
import org.springframework.stereotype.Service;

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
 */

@Service
@RequiredArgsConstructor
@Slf4j
public class MemberServiceImpl implements MemberService {

    private final MemberMapper memberMapper;
    private final PointService pointService;

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
        List<PointHistoryDto> pointHistoryList = pointService.getPointHistoryById(memberId);

        //4. DTO에 포인트 내역 추가
        memberDto.setPointHistory(pointHistoryList);

        return memberDto;
    }
}
