package com.petcoin.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @Builder
@AllArgsConstructor @NoArgsConstructor
public class RefundApplyDto {
    @Min(10000)
    private long points;
    @NotBlank private String accountHolder;
    @NotBlank @Pattern(regexp="^[0-9A-Z]{2,20}$") private String bankCode;
    @NotBlank @Pattern(regexp="^[0-9\\-]{8,30}$") private String accountNumber;
}
