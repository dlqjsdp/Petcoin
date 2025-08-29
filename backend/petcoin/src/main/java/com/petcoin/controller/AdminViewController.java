package com.petcoin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/*
 * 관리자 페이지 View Controller
 * @author : sehui
 * @fileName : AdminViewController
 * @since : 250827
 * @history
 *  - 250827 | sehui | 전체 회원 목록 페이지 요청
 *  - 250829 | sehui | 전체 포인트 환급 목록 페이지 요청
 */

@Controller
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminViewController {

    //전체 회원 목록 페이지
    @GetMapping("/member/list")
    public String memberListPage(){
        return "admin/memberlist";
    }

    //전체 포인트 환급 요청 목록 페이지
    @GetMapping("/point/list")
    public String pointListPage(){
        return "admin/pointList";
    }
}
