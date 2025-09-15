package com.petcoin.mapper;

import com.petcoin.constant.Role;
import com.petcoin.domain.MemberVO;
import com.petcoin.dto.Criteria;
import com.petcoin.dto.MemberListDto;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.List;

/*
 * @fileName : MemberMapperTest
 * 회원 Mapper 테스트 class
 * @author : heekyung
 * @since : 250826
 * @history
 * - 250826 | heekyung | 회원가입 테스트 작성
 * - 250827 | sehui | 전체 회원 목록 조회 Test
 * - 250827 | sehui | 회원 정보 단건 조희 Test
 * - 250829 | sehui | 전체 회원 수 조회 Test
 * - 250915 | sehui | 전체 회원 정보 데이터 조회(페이징 기능 없는 통계용) Test
 */

@SpringBootTest
@Transactional
@Slf4j
class MemberMapperTest {

    @Autowired
    private MemberMapper memberMapper;

    //DB에서 조회 후 없으면 등록 -> 등록 후 저장된 연락처 조회
    @Test
    void testFindByPhone() {
        String phone ="01011113333";

        //DB에서 조회하기
        MemberVO findByPhone = memberMapper.findByPhone(phone);

        //없으면 DB에 등록하기
        if (findByPhone == null) {
            log.info("미등록 연락처", phone);

            MemberVO newMember = MemberVO.builder()
                    .phone(phone)
                    .role(Role.USER)
                    .build();

            memberMapper.insertMember(newMember);
            log.info("신규 등록 완료", newMember.getMemberId());

            //정상 등록 여부 재조회
            findByPhone = memberMapper.findByPhone(phone);
        }
    }
    
    //기존 DB에 있는 정보인지 확인하는 테스트
    @Test
    void testFindPhone(){
        String phone ="01011113333";
        
        MemberVO findByPhone = memberMapper.findByPhone(phone);
        log.info("기존 등록 회원", findByPhone.getMemberId());
    }

    @Test
    @DisplayName("전체 회원 조회 - 검색 조건 없이")
    void testMemberListNoSearch() {

        //given : 페이징 처리, 검색 조건 없이 설정
        Criteria cri = new Criteria(1, 10);

        //when : 전체 상품 조회
        List<MemberListDto> memberList = memberMapper.findMemberListWithPaging(cri);

        //then : 결과 검증
        assertNotNull(memberList, "조회된 회원 목록이 null입니다.");
        assertFalse(memberList.isEmpty(), "조회된 상품 목록이 비어있습니다.");

        for(MemberListDto ListDto : memberList){
            log.info("MemberList >> {}", ListDto);
        }
    }

    @Test
    @DisplayName("전체 회원 조회 - 핸드폰 번호 조건 검색")
    void testMemberListWithPhone() {

        //given : 페이징 처리, 검색 조건(핸드폰 번호) 설정
        Criteria cri = new Criteria(1, 10);
        cri.setPhone("010-1");

        //when : 검색 조건 포함된 회원 목록 조회
        List<MemberListDto> memberList = memberMapper.findMemberListWithPaging(cri);

        //then : 결과 검증
        assertNotNull(memberList, "조회된 회원 목록이 null입니다.");
        assertFalse(memberList.isEmpty(), "조회된 상품 목록이 비어있습니다.");

        for(MemberListDto ListDto : memberList){
            log.info("MemberList >> {}", ListDto);
        }
    }

    @Test
    @DisplayName("전체 회원 조회 - 포인트 조건 검색")
    void testMemberListWithPointRange() {

        //given : 페이징 처리, 검색 조건(포인트 최소/최대) 설정
        Criteria cri = new Criteria(1, 10);
        cri.setMinPoint(50);
        cri.setMaxPoint(150);

        //when : 검색 조건 포함된 회원 목록 조회
        List<MemberListDto> memberList = memberMapper.findMemberListWithPaging(cri);

        //then : 결과 검증
        assertNotNull(memberList, "조회된 회원 목록이 null입니다.");
        assertFalse(memberList.isEmpty(), "조회된 상품 목록이 비어있습니다.");

        for(MemberListDto ListDto : memberList){
            log.info("MemberList >> {}", ListDto);
        }
    }

    @Test
    @DisplayName("회원 정보 단건 조회")
    void testMemberById() {

        //given : 회원Id 설정
        Long memberId = 1L;

        //when : 회원 정보 단건 조회
        MemberVO member = memberMapper.findMemberById(memberId);

        //then : 결과 검증
        assertNotNull(member, "해당 ID로 조회된 회원이 null입니다.");
        assertEquals(memberId, member.getMemberId());

        log.info("Member >> {}", member);
    }

    @Test
    @DisplayName("전체 회원 수 조회")
    void testTotalMember() {

        //when : 전체 회원 수 조회
        int totalMember = memberMapper.getTotalMember();

        //then : 결과 검증
        assertNotNull(totalMember, "조회된 전체 회원의 수가 null입니다.");
        assertFalse(totalMember == 0, "조회된 전체 회원의 수가 0입니다.");

        log.info("Total Member >> {}", totalMember);
    }

    @Test
    @DisplayName("전체 회원 정보 데이터 조회 - 단순 조회")
    void testMemberList() {

        //when : 전체 회원 정보 데이터 조회
        List<MemberListDto> memberList = memberMapper.findMemberList();

        //then : 결과 검증
        assertNotNull(memberList);
        memberList.stream().forEach(memberListDto -> {
            log.info("MemberList >> {}", memberListDto);
        });
    }

}