package com.petcoin.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
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
 * - 250828 | heekyung | 비밀번호 추가
 */

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberVO {

    private Long memberId; //회원 고유번호

    // 자동부여로 인해 응답에는 절대 노출 X, 필요 시 요청으로는 받을 수 있게 적용
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password; // 비밀번호 (암호화)

    private String phone; //연락처
    private Role role; //권한 (USER, ADMIN)

}
