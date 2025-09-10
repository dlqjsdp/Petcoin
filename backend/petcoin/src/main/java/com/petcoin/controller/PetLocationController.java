package com.petcoin.controller;

import com.petcoin.domain.PetLocationVO;
import com.petcoin.service.PetLocationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
 * @fileName : PetLocationController
 * 수거함 위치 / 검색 기능 Controller 클래스
 * @author : heekyung
 * @since : 250902
 * @history
 * - 250827 | heekyung | PetLocationController 생성 / 지역별 검색 기능, 근처 수거함 조회 기능 작성
 */

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/locations")
@Slf4j
public class PetLocationController {

    private final PetLocationService petLocationService;

    // "시" 목록 검색
    @GetMapping("/sido")
    public List<String> listSido(){
        return petLocationService.listSido();
    }


    // "구" 목록 검색
    @GetMapping("/sigungu")
    public List<String> listSigungu(@RequestParam String sido){
        return petLocationService.listSigungu(sido);
    }

    // "동" 목록 검색
    @GetMapping("/dong")
    public List<String> listDong(@RequestParam String sido, @RequestParam String sigungu){
        return petLocationService.listDong(sido, sigungu);
    }

    // 지역 조건 목록
    // @RequestParam(required = false) : sido, sigungu, dong 중 하나라도 빠져 있어도 조회 되도록
    @GetMapping
    public List<PetLocationVO> findByRegion(
            @RequestParam(required = false) String sido,
            @RequestParam(required = false) String sigungu,

            @RequestParam(required = false) String dong){

        return petLocationService.findByRegion(sido, sigungu, dong);
    }

    // 단건 조회
    @GetMapping("/{recycleId}")
    public PetLocationVO findById(@PathVariable Long recycleId){
        return petLocationService.findById(recycleId);
    }
}
