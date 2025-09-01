package com.petcoin.controller;

import com.petcoin.domain.PointHistoryVO;
import com.petcoin.security.CustomUserDetails;
import com.petcoin.service.PointHisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
/*
 * 포인트 내역 Controller
 * @author : leejihye
 * @fileName : PointHisApiController
 * @since : 250901
 * @history
 * - 250901 | leejihye | 포인트 적립 기능 추가
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class PointHisApiController {

    private final PointHisService pointHisService;

    @PostMapping("point/add")
    public ResponseEntity<?> addPoint(@RequestBody PointHistoryVO pointHistoryVO,
     @AuthenticationPrincipal CustomUserDetails user) { // JWT에서 꺼낸 사용자 정보

        Long memberId = user.getMemberId(); // 🔑 여기서 안전하게 가져옴
        pointHistoryVO.setMemberId(memberId);

        pointHisService.plusPoint(pointHistoryVO);

        log.info("plusPoint 컨트롤러 진입: {}", pointHistoryVO);

        return ResponseEntity.ok().build();

    }
}
