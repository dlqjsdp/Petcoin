package com.petcoin.controller;

import com.petcoin.dto.PetRejectionDto;
import com.petcoin.service.PetRejectionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
/*
 * 포인트 내역 Controller
 * @author : leejihye
 * @fileName : PetRejectionApiController
 * @since : 250901
 * @history
 * - 250901 | leejihye | 페트병 불량 정보 Controller
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class PetRejectionApiController {

    private final PetRejectionService petRejectionService;

    @GetMapping("rejection/{petRejectionId}")
    public ResponseEntity<?> getRejectionReason(@PathVariable Long petRejectionId) {
        try {
            PetRejectionDto petRejectionDto = petRejectionService.getPetRejectionDto(petRejectionId);

            if (petRejectionDto == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("해당 게시글을 찾을 수 없습니다.");
            }

            // 3. 결과 반환
            return ResponseEntity.ok(petRejectionDto); // 상태코드 200 OK + 게시글 정보 반환

        } catch (Exception e) {
            log.error("게시글 단건 조회 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("게시글 조회 중 오류가 발생했습니다.");
        }
    }
}
