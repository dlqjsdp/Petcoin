package com.petcoin.dto;

import com.petcoin.constant.RunStatus;
import lombok.*;

import java.time.LocalDateTime;

/*
 * 키오스크 실행 이력 조회 Criteria
 * 실행 로그를 페이징/검색 조건으로 조회하기 위한 DTO
 *
 * 주요 기능:
 * - 특정 키오스크별 실행 이력 조회
 * - 실행 상태(RUNNING/COMPLETED/CANCELLED)별 필터링
 * - 회원 ID 기반 실행 이력 조회
 * - 시작 시각 기간 조건 (startedFrom ~ startedTo)
 * - 페이징(pageNum, amount, offset) 지원
 *
 * @author  : yukyeong
 * @fileName: KioskRunCriteria
 * @since   : 250827
 * @history
 *   - 250827 | yukyeong | 최초 생성 (필터 조건 및 페이징 처리 필드 정의, getOffset() 추가)
 */

@Getter @Setter
@ToString
public class KioskRunCriteria {

    // 필드
    private Long kioskId; // 특정 키오스크 조회
    private RunStatus status; // 세션 상태 필터
    private Long memberId; // 특정 사용자 세션 필터
    private LocalDateTime startedFrom; // started_at >= from
    private LocalDateTime startedTo; // started_at <= to

    // 페이징
    private int pageNum; // 페이지 번호
    private int amount; // 한 페이지에 보여줄 개수

    public KioskRunCriteria(){
        this(1,10);
    }

    // 원하는 페이지, 게시글 수 직접 설정
    public KioskRunCriteria(int pageNum, int amount){
        this.pageNum = pageNum;
        this.amount = amount;
    }

    // MySQL용 offset
    public int getOffset() {
        return (pageNum - 1) * amount;
    }

}
