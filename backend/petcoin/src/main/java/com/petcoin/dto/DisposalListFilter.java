package com.petcoin.dto;

import lombok.*;
import java.time.LocalDate;

@Getter @Setter @Builder
@AllArgsConstructor @NoArgsConstructor
public class DisposalListFilter {
    private LocalDate from;
    private LocalDate to;
    private String region1;
    private String region2;
    private String itemName;
    private String status;
    private int page;
    private int size;
}

