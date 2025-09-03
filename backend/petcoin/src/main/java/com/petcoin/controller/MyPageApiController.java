package com.petcoin.controller;

import com.petcoin.dto.PointHistoryDto;
import com.petcoin.dto.PointRequestDto;
import com.petcoin.security.CustomUserDetails;
import com.petcoin.service.PointHisService;
import com.petcoin.service.PointReqService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/*
 * 회원별 포인트 내역 Controller
 * @author : leejihye
 * @fileName : MyPageApiController
 * @since : 250901
 * @history
 * - 250901 | leejihye | 회원별 포인트 내역 조회 추가
 */
@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
@Slf4j
public class MyPageApiController {

    @Autowired
    private final PointHisService pointHisService;
    private final PointReqService pointReqService;

    @GetMapping("/pointhistory/{memberId}")
    public ResponseEntity<Map<String, Object>> getPointHistory(@PathVariable("memberId") Long memberId) {
        List<PointHistoryDto> pointHistory = pointHisService.getPointHistoryById(memberId);
        int pointBalance = pointHisService.getLatestPointBalance(memberId);

        Map<String, Object> pointList = new HashMap<>();
        pointList.put("pointHistory", pointHistory);
        pointList.put("lastPointBalance", pointBalance);

        log.info("pointList: {}", pointList);

        return ResponseEntity.ok(pointList);
    }

    @PostMapping("/pointrefund/{memberId}")
    public ResponseEntity<?> requestRefund(@PathVariable("memberId") Long memberId,
                                           @RequestBody PointRequestDto pointRequestDto) {
        pointReqService.requestRefund(pointRequestDto);

        log.info(pointRequestDto.toString());

        return ResponseEntity.ok("success");
    }
}
