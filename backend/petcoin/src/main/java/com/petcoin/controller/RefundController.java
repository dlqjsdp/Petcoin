package com.petcoin.controller;

import com.petcoin.constant.RefundStatus;
import com.petcoin.dto.RefundApplyDto;
import com.petcoin.dto.RefundRowDto;
import com.petcoin.service.RefundService;
import com.petcoin.web.ApiResponse;
import com.petcoin.web.LoginMember;
import com.petcoin.web.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mypage/points/refund")
public class RefundController {

    private final RefundService refundService;

    // 환급 신청 (멱등)
    @PostMapping
    public ApiResponse<Long> apply(@LoginMember Long memberId,
                                   @RequestHeader("Idempotency-Key") String idemKey,
                                   @Valid @RequestBody RefundApplyDto dto) {
        long refundId = refundService.apply(memberId, dto, idemKey);
        return ApiResponse.ok(refundId);
    }

    // 환급 이력 (상태 필터/페이징)
    @GetMapping("/history")
    public ApiResponse<PageResponse<RefundRowDto>> history(
            @LoginMember Long memberId,
            @RequestParam(required = false) RefundStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        var bundle = refundService.list(memberId, status, page, size);

        var res = PageResponse.<RefundRowDto>builder()
                .content(bundle.getContent())
                .totalElements(bundle.getTotal())
                .page(bundle.getPage())
                .size(bundle.getSize())
                .build();

        return ApiResponse.ok(res);
    }
}

