package com.petcoin.dto;

import com.petcoin.constant.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/*
 * 회원 상세 정보 DTO
 * 회원 정보와 포인트 내역 담음
 * @author : sehui
 * @fileName : MemberDetailDto
 * @since : 250827
 */

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberDetailDto {

    //회원 정보
    private Long memberId;
    private String phone;
    private Role role;

    //포인트 전체 내역
    private List<PointHistoryDto> pointHistory;
}
