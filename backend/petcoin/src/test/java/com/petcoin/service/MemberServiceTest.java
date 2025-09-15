package com.petcoin.service;

import com.petcoin.domain.MemberVO;
import com.petcoin.dto.Criteria;
import com.petcoin.dto.MemberDetailDto;
import com.petcoin.dto.MemberListDto;
import com.petcoin.mapper.MemberMapper;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/*
 * @fileName : MemberServiceTest
 * 회원 Service 테스트 class
 * @author : heekyung
 * @since : 250826
 * @history
 * - 250826 | heekyung | 회원가입 테스트 작성
 * - 250827 | sehui | 전체 회원 조회 Test
 * - 250827 | sehui | 회원 정보 단건 조회 Test
 * - 250829 | sehui | 전체 회원 수 조회 Test
 * - 250915 | sehui | 전체 회원 정보 데이터 조회 (페이징 처리 없는 통계용) Test
 */

@SpringBootTest
@Transactional
@Slf4j
class MemberServiceTest {

    @Autowired
    private MemberService memberService;

    //DB에서 조회 후 없으면 등록 -> 등록 후 저장된 연락처 조회
    @Test
    void test(){
        String phone = "01011112222";

        //1. DB 조회
        MemberVO found = memberService.getMemberByPhone(phone);

        //2. 없으면 회원가입
        MemberVO member = memberService.registerMember(phone);
        log.info("실행결과" + member);

        //3. 정상 등록 여부 재조회
        MemberVO recheck = memberService.getMemberByPhone(phone);
        log.info("재조회 결과" + recheck);

    }

    //기존 DB에 있는 정보인지 확인하는 테스트
    @Test
    void test1(){
        String phone = "01011113334";
        
        MemberVO found = memberService.getMemberByPhone(phone);
        log.info("기존회원조회" + found);
    }

    @Test
    @DisplayName("전체 회원 조회 - 검색 조건 없이")
    void testGetListNoSearch() {

        //given : 페이징 조건 설정
        Criteria cri = new Criteria();

        //when : 전체 상품 조회
        List<MemberListDto> memberList = memberService.getMemberListWithPaging(cri);

        //then : 결과 검증
        assertNotNull(memberList, "전체 회원 목록이 null입니다.");
        assertFalse(memberList.isEmpty(), "회원 목록이 비어있습니다.");

        for(MemberListDto ListDto : memberList){
            log.info("Member >> {}", ListDto);
        }
    }

    @Test
    @DisplayName("전체 회원 조회 - 휴대폰 번호 조건 검색")
    void testGetListWithPhone() {

        //given : 페이징 조건 설정
        Criteria cri = new Criteria();
        cri.setPhone("5");

        //when : 전체 상품 조회
        List<MemberListDto> memberList = memberService.getMemberListWithPaging(cri);

        //then : 결과 검증
        assertNotNull(memberList, "전체 회원 목록이 null입니다.");
        assertFalse(memberList.isEmpty(), "회원 목록이 비어있습니다.");

        for(MemberListDto ListDto : memberList){
            log.info("Member >> {}", ListDto);
        }
    }

    @Test
    @DisplayName("회원 정보 단건 조회")
    void testGetMemberById() {

        //given : 회원ID 설정
        Long memberId = 1L;

        //when : 회원 정보 단건 조회
        MemberDetailDto memberDto = memberService.getMemberById(memberId);

        //then : 결과 검증
        assertNotNull(memberDto, "해당ID로 조회되는 회원 정보가 없습니다.");

        log.info("Member >> {}", memberDto);
    }

    @Test
    @DisplayName("전체 회원 수 조회")
    void testTotalMember() {

        //when : 전체 회원 수 조회
        int totalMember = memberService.getTotalMember();

        //then : 결과 검증
        assertNotNull(totalMember, "전체 회원 수가 null입니다.");

        log.info("Total Member >> {}", totalMember);
    }

    @Test
    @DisplayName("전체 회원 정보 데이터 조회 - 단순 조회")
    void testMemberList() {

        //when : 전체 회원 정보 데이터 조회
        List<MemberListDto> memberList = memberService.getMemberList();

        //then : 결과 검증
        assertNotNull(memberList);

        memberList.stream().forEach(memberListDto -> {
            log.info("Member >> {}", memberListDto);
        });
    }
}