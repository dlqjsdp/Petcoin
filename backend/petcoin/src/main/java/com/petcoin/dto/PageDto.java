package com.petcoin.dto;

import lombok.Getter;
import lombok.ToString;

/*
 * 페이징 처리를 위한 DTO
 * @author : sehui
 * @fileName : PageDto
 * @since : 250829
 */

@Getter
@ToString
public class PageDto {

    private int startPage;          //시작 페이지 번호
    private int endPage;            //끝 페이지 번호
    private boolean prev, next;     //이전/다음 페이지 블록 존재 여부
    private int total;              //전체 데이터 개수
    private Criteria cri;           //페이징 정보 (pageNum, amount)

    public PageDto(Criteria cri, int total) {
        this.cri = cri;
        this.total = total;

        //현재 페이지를 기준으로 한 번에 10페이지씩 묶어서 보여줌
        this.endPage = (int)(Math.ceil(cri.getPageNum()/10.0))*10;
        this.startPage = this.endPage - 9;

        //전체 데이터 수를 사용하여 실제 마지막 페이지 번호 계산
        int realEnd = (int)(Math.ceil((total*1.0)/cri.getAmount()));

        if(realEnd  < this.endPage) {
            this.endPage = realEnd;
        }
        
        //이전/다음 페이지 블록 존재 여부
        this.prev = this.startPage > 1;
        this.next = this.endPage < realEnd;
    }
}
