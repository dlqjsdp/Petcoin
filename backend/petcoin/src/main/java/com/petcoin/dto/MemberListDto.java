package com.petcoin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.petcoin.constant.Role;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

/*
 * 회원 정보 + 포인트 내역 목록 DTO
 * @author : sehui
 * @fileName : MemberListDto
 * @since : 250827
 * @history
 *  - 250827 | sehui | 회원 정보 + 포인트 내역 목록 DTO 생성
 *  - 250909 | sehui | 누적 포인트, 가입일, 총 수거량 필드 추가
 */

@Getter
@Setter
@ToString
public class MemberListDto {

    private Long memberId;      //회원 ID
    private String phone;       //휴대폰 번호
    private Role role;          //회원 권한
    private int currentPoint;   //현재 포인트 잔액(보유 포인트)
    private int totalPoints;    //누적 포인트
    private LocalDateTime createdAt;    //가입일
    private int totalCollections;       //회원별 총 수거량
}
