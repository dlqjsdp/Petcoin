package com.petcoin.controller;

import com.petcoin.domain.PetCollectionLogVO;
import com.petcoin.service.PetCollectionLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.channels.MulticastChannel;
/*
 * 포인트 내역 Controller
 * @author : leejihye
 * @fileName : PetCollectionLogApiController
 * @since : 250901
 * @history
 * - 250901 | leejihye | 페트병 회수 기록 기능 추가
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class PetCollectionLogApiController {

    private final PetCollectionLogService petCollectionLogService;

    @PostMapping("/prediction/save")
    public ResponseEntity<?> savePetCollectionLog(
            @RequestParam("file")MultipartFile multipartFile,
            @ModelAttribute PetCollectionLogVO vo) throws Exception{

        petCollectionLogService.savePetCollection(multipartFile, vo);

        return ResponseEntity.ok("success");
    }
}
