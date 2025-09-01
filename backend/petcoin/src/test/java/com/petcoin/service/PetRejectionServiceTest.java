package com.petcoin.service;

import com.petcoin.dto.PetRejectionDto;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Slf4j
class PetRejectionServiceTest {

    @Autowired
    private PetRejectionService petRejectionService;

    @Test
    public void testPetRejection() {
        Long targetId = 1L;

        PetRejectionDto dto = petRejectionService.getPetRejectionDto(targetId);

        log.info(dto.toString());
    }
}