package com.petcoin.mapper;

import com.petcoin.constant.Role;
import com.petcoin.domain.MemberVO;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

/*
 * @fileName : MemberMapperTest
 * 회원 Mapper 테스트 class
 * @author : heekyung
 * @since : 250826
 * @history
 * - 250826 | heekyung | 회원가입 테스트 작성
 */

@SpringBootTest
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

}