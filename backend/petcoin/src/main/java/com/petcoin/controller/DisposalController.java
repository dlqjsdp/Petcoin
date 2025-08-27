package com.petcoin.controller;

import com.petcoin.dto.DisposalDetailDto;
import com.petcoin.dto.DisposalListFilter;
import com.petcoin.dto.DisposalListRowDto;
import com.petcoin.service.DisposalService;
import com.petcoin.web.ApiResponse;
import com.petcoin.web.LoginMember;
import com.petcoin.web.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mypage/disposals")
public class DisposalController {

    private final DisposalService disposalService;

    // 리스트: 필터/페이징
    @GetMapping
    public ApiResponse<PageResponse<DisposalListRowDto>> list(
            @LoginMember Long memberId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) String region1,
            @RequestParam(required = false) String region2,
            @RequestParam(required = false) String itemName,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        var filter = DisposalListFilter.builder()
                .from(from).to(to)
                .region1(region1).region2(region2)
                .itemName(itemName).status(status)
                .page(page).size(size)
                .build();

        var bundle = disposalService.list(memberId, filter);

        var res = PageResponse.<DisposalListRowDto>builder()
                .content(bundle.getContent())
                .totalElements(bundle.getTotal())
                .page(bundle.getPage())
                .size(bundle.getSize())
                .build();

        return ApiResponse.ok(res);
    }

    // 상세
    @GetMapping("/{disposalId}")
    public ApiResponse<DisposalDetailDto> detail(@LoginMember Long memberId,
                                                 @PathVariable long disposalId) {
        return ApiResponse.ok(disposalService.detail(memberId, disposalId));
    }
}
