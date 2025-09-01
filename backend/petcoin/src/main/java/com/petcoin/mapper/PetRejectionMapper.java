package com.petcoin.mapper;

/*
 * 페트병 불량 정보 mapper
 * @author : leejihye
 * @fileName : PetRejectionMapper
 * @since : 250830
 * @history
 *  - 250830 | leejihye | 페트병 불량 정보 mapper 생성
 */

import com.petcoin.dto.PetRejectionDto;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PetRejectionMapper {

    //불량 정보 및 안내 메시지 조회
    public PetRejectionDto selectPetRejectionById(Long petRejectionId);
}
