package com.petcoin.domain;

/*
 * 페트병 불량 정보 VO
 * @author : leejihye
 * @fileName : PetRejectionVO
 * @since : 250830
 * @history
 *  - 250830 | leejihye | 페트병 불량 정보 VO 생성
 */

import lombok.Data;

@Data
public class PetRejectionVO {

    private Long petRejectionId;
    private String petRejectionReason;
    private String petRejectionInfo;
}
