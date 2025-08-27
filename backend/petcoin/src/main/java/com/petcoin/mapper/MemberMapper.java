package com.petcoin.mapper;

import com.petcoin.domain.MemberVO;
import com.petcoin.dto.Criteria;
import com.petcoin.dto.MemberListDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/*
 * @fileName : MemberMapper
 * 로그인/회원가입 관련 Mapper 인터페이스
 * @author : heekyung
 * @since : 250826
 * @history
 * - 250826 | heekyung | MemberMapper 생성 / 연락처로 회원 조회 코드 작성
 * - 250827 | sehui | 전체 회원 조회 기능 추가
 * - 250827 | sehui | 회원 정보 단건 조회 기능 추가
 */

@Mapper
public interface MemberMapper {

    //DB에서 핸드폰 번호 조회(없으면 null)
    public MemberVO findByPhone(@Param("phone") String phone);

    //신규 연락처 저장
    public void insertMember(MemberVO member);

    //전체 회원 조회 (검색 기능 포함)
    public List<MemberListDto> findMemberListWithPaging(Criteria cri);

    //회원 정보 단건 조회
    public MemberVO findMemberById(@Param("memberId") Long memberId);
}

