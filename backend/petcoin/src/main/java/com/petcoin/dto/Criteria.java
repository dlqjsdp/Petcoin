package com.petcoin.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/*
 * 페이징 + 검색 처리 Criteria
 * @author : sehui
 * @fileName : Criteria
 * @since : 250827
 * @history
 *  - 250827 | sehui | 페이징 처리 및 검색을 위한 Criteria 생성
 *  - 250827 | sehui | 전체 회원 조회의 검색 조건 추가
 */

@Getter
@Setter
@ToString
public class Criteria {

    private int pageNum;        //조회할 페이지 번호
    private int amount;         //페이지당 데이터 개수

    //전체 회원 조회의 검색 조건
    private String phone;       //휴대폰 번호
    private Integer minPoint;   //최소 포인트
    private Integer maxPoint;   //최대 포인트

    //pageNum과 amount 지정하지 않으면 기본값: 1페이지, 10개씩 조회
    public Criteria() {
        this(1, 10);
    }

    //pageNum과 amount 지정
    public Criteria(int pageNum, int amount) {
        this.pageNum = pageNum;
        this.amount = amount;
    }

    //페이징 처리를 위한 MySQL용 offset
    public int getOffset() {
        return (pageNum - 1) * amount;
    }
}
