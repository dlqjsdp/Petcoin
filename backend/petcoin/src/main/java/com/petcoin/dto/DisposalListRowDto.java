package com.petcoin.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @Builder
@AllArgsConstructor @NoArgsConstructor
public class DisposalListRowDto {
    private long disposalId;
    private String itemName;
    private double confidence;
    private int fee;
    private String region1;
    private String region2;
    private String repImgUrl; // null이면 FE 플레이스홀더
    private LocalDateTime createdAt;
    private String status;
}