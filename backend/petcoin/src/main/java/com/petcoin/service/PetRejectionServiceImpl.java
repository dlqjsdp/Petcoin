package com.petcoin.service;

import com.petcoin.dto.PetRejectionDto;
import com.petcoin.mapper.PetRejectionMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
/*
 * 페트병 불량 정보 service
 * @author : leejihye
 * @fileName : PetRejectionServiceImpl
 * @since : 250830
 * @history
 *  - 250830 | leejihye | 페트병 불량 정보 service 생성
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PetRejectionServiceImpl implements PetRejectionService {

    @Autowired
    PetRejectionMapper petRejectionMapper;

    @Override
    public PetRejectionDto getPetRejectionDto(Long petRejectionId) {
        return petRejectionMapper.selectPetRejectionById(petRejectionId);
    }
}
