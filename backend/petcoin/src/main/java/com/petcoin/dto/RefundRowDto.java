package com.petcoin.dto;

import com.petcoin.constant.RefundStatus;
import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @Builder
@AllArgsConstructor @NoArgsConstructor
public class RefundRowDto {
    private long refundId;
    private long points;
    private long cashAmount;
    private RefundStatus status;
    private String rejectReason;
    private LocalDateTime createdAt;
}
