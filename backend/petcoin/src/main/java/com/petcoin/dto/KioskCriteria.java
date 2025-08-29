package com.petcoin.dto;

import com.petcoin.constant.KioskStatus;
import com.petcoin.constant.RunStatus;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

/*
 * 키오스크 조회 Criteria
 * 관리자 페이지에서 키오스크 목록을 페이징/검색 조건으로 조회하기 위한 DTO
 *
 * 주요 기능:
 * - 이름/주소(keyword) 기반 검색
 * - 상태(ONLINE / OFFLINE / MAINT) 필터링
 * - 삭제 여부(includeDeleted) 조건 처리
 * - 변경일자(updatedFrom ~ updatedTo) 범위 조회
 * - 페이징(pageNum, amount, offset) 지원
 *
 * @author  : yukyeong
 * @fileName: KioskCriteria
 * @since   : 250828
 * @history
 *   - 250828 | yukyeong | 최초 생성 (검색 조건, 삭제여부, 날짜범위, 페이징 필드 정의 및 getOffset() 추가)
 */

@Getter @Setter
@ToString
public class KioskCriteria {

    // 필드
    private String keyword; // 이름,주소 검색
    private KioskStatus status; // ONLINE,OFFLINE,MAINT 필터링
    private Boolean includeDeleted = false; // 삭제된 키오스크 포함 여부
    private LocalDateTime updatedFrom; // 변경일자 범위 조회 updated_at >= from
    private LocalDateTime updatedTo; // 변경일자 범위 조회 updated_at <= to

    // 페이징
    private int pageNum; // 페이지 번호
    private int amount; // 한 페이지에 보여줄 개수

    public KioskCriteria(){
        this(1,10);
    }

    // 원하는 페이지, 게시글 수 직접 설정
    public KioskCriteria(int pageNum, int amount){
        this.pageNum = pageNum;
        this.amount = amount;
    }

    // MySQL용 offset
    public int getOffset() {
        return (pageNum - 1) * amount;
    }

}
