package com.petcoin.dto;

import com.petcoin.constant.Role;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/*
 * 회원 정보 + 포인트 내역 목록 DTO
 * @author : sehui
 * @fileName : MemberListDto
 * @since : 250827
 */

@Getter
@Setter
@ToString
public class MemberListDto {

    private Long memberId;      //회원 ID
    private String phone;       //휴대폰 번호
    private Role role;          //회원 권한
    private int currentPoint;   //현재 포인트 잔액
}
