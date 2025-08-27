package com.petcoin.service;

import com.petcoin.constant.RefundStatus;
import com.petcoin.dto.RefundApplyDto;
import com.petcoin.dto.RefundRowDto;
import com.petcoin.web.PageBundle;

public interface RefundService {
    long apply(Long memberId, com.petcoin.dto.RefundApplyDto dto, String idemKey);
    PageBundle<RefundRowDto> list(Long memberId, RefundStatus status, int page, int size);
}
