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
 * - 250828 | heekyung | 로그인 시 비밀번호 반드시 필요하여 비밀번호 관련 코드 추가
 * - 250829 | sehui | 페이징 처리를 위한 전체 회원 수 조회 기능 추가
 */

@Mapper
public interface MemberMapper {

    //DB에서 핸드폰 번호 조회(없으면 null) | 전화번호로 회원 정보를 통째로 조회 -> 회원 상세 정보가 필요할 때 사용
    public MemberVO findByPhone(@Param("phone") String phone);

    // DB에서 핸드폰 번호 존재 여부 조회 | 회원가입 시 중복 여부만 체크(성능 효율적)
    public boolean existsByPhone(@Param("phone") String phone);

    //신규 연락처 저장
    public void insertMember(MemberVO member);

    //비밀번호 업데이트
    public int updatePassword(@Param("memberId") Long memberId, @Param("password") String password);

    //전체 회원 조회 (검색 기능 포함)
    public List<MemberListDto> findMemberListWithPaging(Criteria cri);

    //회원 정보 단건 조회
    public MemberVO findMemberById(@Param("memberId") Long memberId);

    //전체 회원 수 조회
    public int getTotalMember();
}

