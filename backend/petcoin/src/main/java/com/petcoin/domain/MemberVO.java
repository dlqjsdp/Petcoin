package com.petcoin.domain;

import com.petcoin.constant.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
 * @fileName : MemberVO
 * 회원가입/로그인한 사용자의 정보를 담는 vo 클래스
 * @author : heekyung
 * @since : 250826
 * @history
 * - 250826 | heekyung | MemberVO 생성
 */

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberVO {

    private Long memberId; //회원 고유번호
    private String phone; //연락처
    private Role role; //권한 (USER, ADMIN)

}
