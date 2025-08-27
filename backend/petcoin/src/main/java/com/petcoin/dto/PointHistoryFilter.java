package com.petcoin.dto;

import com.petcoin.constant.PointType;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PointHistoryFilter {
    private LocalDate from;     // 포함 시작일 (nullable)
    private LocalDate to;       // 포함 종료일 (nullable)
    private PointType type;     // EARN / USE (nullable)
    @Builder.Default private Integer page = 1;   // 1-base
    @Builder.Default private Integer size = 20;  // 페이지 크기
}
