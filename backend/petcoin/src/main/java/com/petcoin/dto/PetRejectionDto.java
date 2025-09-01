package com.petcoin.dto;

/*
 * 페트병 불량 정보 Dto
 * @author : leejihye
 * @fileName : PetRejectionDto
 * @since : 250830
 * @history
 *  - 250830 | leejihye | 페트병 불량 정보 Dto 생성
 */

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PetRejectionDto {

    private Long petRejectionId;
    private String petRejectionReason;
    private String petRejectionInfo;

}
