package com.petcoin.service;

import com.petcoin.domain.MemberVO;
import com.petcoin.mapper.MemberMapper;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

/*
 * @fileName : MemberServiceTest
 * 회원 Service 테스트 class
 * @author : heekyung
 * @since : 250826
 * @history
 * - 250826 | heekyung | 회원가입 테스트 작성
 */

@SpringBootTest
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
}