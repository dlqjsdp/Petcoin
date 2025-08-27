package com.petcoin.dto;

import com.petcoin.constant.ActionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/*
 * 포인트 내역 DTO
 * @author : sehui
 * @fileName : PointHistoryDto
 * @since : 250827
 */

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PointHistoryDto {

    private Long historyId;
    private Long memberId;
    private int pointChange;
    private int pointBalance;
    private ActionType actionType;
    private String description;
    private LocalDateTime createdAt;
}
