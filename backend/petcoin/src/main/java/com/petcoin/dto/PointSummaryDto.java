package com.petcoin.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PointSummaryDto {
    private long totalEarn;  // 총 적립
    private long totalUse;   // 총 사용
    private long hold;       // 환급 대기/승인 보류분
    private long balance;    // 잔액 = totalEarn - totalUse - hold
}

