package com.petcoin.dto;

import lombok.*;

@Getter @Setter @Builder
@AllArgsConstructor @NoArgsConstructor
public class DisposalDetailDto {
    private long disposalId;
    private String repImgUrl; // null이면 FE 플레이스홀더
    private String itemName;
    private double confidence;
    private int fee;
    private String region1;
    private String region2;
    private Integer widthCm;
    private Integer heightCm;
    private String status;
}
