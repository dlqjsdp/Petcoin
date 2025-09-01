package com.petcoin.service;
/*
 * 페트병 불량 정보 service
 * @author : leejihye
 * @fileName : PetRejectionService
 * @since : 250830
 * @history
 *  - 250830 | leejihye | 페트병 불량 정보 service 생성
 */
import com.petcoin.dto.PetRejectionDto;

public interface PetRejectionService {

    ////불량 정보 및 안내 메시지 조회
    PetRejectionDto getPetRejectionDto(Long petRejectionId);
}
