package com.petcoin.mapper;

import com.petcoin.dto.PetRejectionDto;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Slf4j
class PetRejectionMapperTest {

    @Autowired
    PetRejectionMapper petRejectionMapper;

    @Test
    void selectPetRejectionByIdTest() {
        Long targetid=1L;

        PetRejectionDto dto = petRejectionMapper.selectPetRejectionById(targetid);

        if(dto!=null) {
            log.info("조회 결과 : {}", dto.toString());
        }else {
            log.info("조회 실패했습니다.");
        }
    }
  
}