package com.petcoin.service.impl;

import com.petcoin.constant.RefundStatus;
import com.petcoin.dto.RefundApplyDto;
import com.petcoin.dto.RefundRowDto;
import com.petcoin.mapper.RefundMapper;
import com.petcoin.service.RefundService;
import com.petcoin.web.PageBundle;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.*;

@Service
@RequiredArgsConstructor
public class RefundServiceImpl implements RefundService {

    private final RefundMapper refundMapper;

    @Override
    @Transactional
    public long apply(Long memberId, RefundApplyDto dto, String idemKey) {
        if (dto.getPoints() < 10_000) throw new IllegalStateException("환급 최소 금액은 10,000P 입니다.");
        if (!StringUtils.hasText(dto.getAccountHolder())) throw new IllegalStateException("예금주명이 필요합니다.");
        if (refundMapper.existsPending(memberId)) throw new IllegalStateException("이미 대기/승인 중인 환급 요청이 있습니다.");

        final String key = StringUtils.hasText(idemKey) ? idemKey : UUID.randomUUID().toString();

        Map<String, Object> idem = new HashMap<>();
        idem.put("memberId", memberId);
        idem.put("idemKey", key);
        try {
            refundMapper.insertIdempotency(idem);
        } catch (DataIntegrityViolationException dup) {
            throw new IllegalStateException("이미 접수된 환급 요청입니다. (Idempotency-Key 중복)");
        }

        Map<String, Object> p = new HashMap<>();
        p.put("memberId", memberId);
        p.put("points", dto.getPoints());
        p.put("accountHolder", dto.getAccountHolder());
        p.put("bankCode", dto.getBankCode().toUpperCase(Locale.ROOT));
        p.put("accountNumber", dto.getAccountNumber());
        refundMapper.insertRefund(p);

        long refundId = refundMapper.selectLastInsertId();

        Map<String, Object> link = new HashMap<>();
        link.put("memberId", memberId);
        link.put("idemKey", key);
        link.put("refundId", refundId);
        refundMapper.linkIdemToRefund(link);

        return refundId;
    }

    @Override
    public PageBundle<RefundRowDto> list(Long memberId, RefundStatus status, int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.max(size, 1);
        int offset = safePage * safeSize;

        Map<String, Object> p = new HashMap<>();
        p.put("memberId", memberId);
        p.put("status", status == null ? null : status.name());
        p.put("limit", safeSize);
        p.put("offset", offset);

        var rows = refundMapper.selectRefunds(p);
        long total = refundMapper.countRefunds(p);

        return PageBundle.<RefundRowDto>builder()
                .content(rows)
                .total(total)
                .page(safePage)
                .size(safeSize)
                .build();
    }
}

