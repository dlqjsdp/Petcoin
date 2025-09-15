package com.petcoin.dto;

import lombok.Getter;
import lombok.ToString;

/*
 * 페이징 처리를 위한 DTO
 * @author : sehui
 * @fileName : PageDto
 * @since : 250829
 * @history
 *  - 250829 | sehui | 페이지 버튼을 위한 PageDto 생성
 *  - 250905 | sehui | 키오스크용 KioskCriteria 필드 추가
 *  - 250905 | sehui | 공통 계산 로직 메서드화
 *  - 250905 | sehui | 키오스크 로그용 KioskRunCriteria 필드 추가
 */

@Getter
@ToString
public class PageDto {

    private int startPage;          //시작 페이지 번호
    private int endPage;            //끝 페이지 번호
    private boolean prevBlock, nextBlock;     //이전/다음 페이지 존재 여부
    private boolean prevPage, nextPage;     //이전/다음 블록 존재 여부
    private int total;              //전체 데이터 개수
    private Criteria cri;           //페이징 정보 (pageNum, amount)
    private KioskCriteria kcri;     //키오스크 페이징 정보(pageNum, amount)
    private KioskRunCriteria kRunCri;   //키오스크 로그 페이징 정보(pageNum, amount)

    public PageDto(Criteria cri, int total) {
        this.cri = cri;
        this.total = total;

        calculatePages(cri.getPageNum(), cri.getAmount());
    }

    //키오스크용
    public PageDto(KioskCriteria kcri, int total) {
        this.kcri = kcri;
        this.total = total;
        calculatePages(kcri.getPageNum(), kcri.getAmount());
    }

    //키오스크 로그용
    public PageDto(KioskRunCriteria kRunCri, int total) {
        this.kRunCri = kRunCri;
        this.total = total;
        calculatePages(kRunCri.getPageNum(), kRunCri.getAmount());
    }

    //공통 계산 로직
    private void calculatePages(int pageNum, int amount) {
        //현재 페이지를 기준으로 한 번에 10페이지씩 묶어서 보여줌
        this.endPage = (int)(Math.ceil(pageNum / 10.0)) * 10;
        this.startPage = this.endPage - 9;

        //전체 데이터 수를 사용하여 실제 마지막 페이지 번호 계산
        int realEnd = (int)(Math.ceil((total * 1.0) / amount));

        //블록 끝 페이지가 실제 마지막 페이지보다 클 경우
        if (realEnd  < this.endPage) {
            this.endPage = realEnd;
        }

        //이전/다음 페이지 블록 존재 여부
        this.prevBlock = this.startPage > 1;
        this.nextBlock = this.endPage < realEnd;

        //페이지 단위 prev/next
        this.prevPage = pageNum > 1;
        this.nextPage = pageNum < realEnd;
    }
}
