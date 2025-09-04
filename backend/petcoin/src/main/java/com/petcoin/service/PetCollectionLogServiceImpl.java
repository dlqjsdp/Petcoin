package com.petcoin.service;

import com.petcoin.domain.PetCollectionLogVO;
import com.petcoin.mapper.PetCollectionLogMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
/*
 * 페트병 회수 기록 service
 * @author : leejihye
 * @fileName : PetCollectionLogServiceImpl
 * @since : 250830
 * @history
 *  - 250830 | leejihye | 페트병 회수 기록 service 생성
 */
@Service
@RequiredArgsConstructor
public class PetCollectionLogServiceImpl implements PetCollectionLogService {

    private final PetCollectionLogMapper petCollectionLogMapper;
    private final FileService fileService;

    private final String uploadPath = "C:\\petcoin"; // 실제 이미지 저장 경로 지정

    @Override
    @Transactional
    public void savePetCollection(MultipartFile image, PetCollectionLogVO petCollectionLogVO) throws Exception {
        // 1. 이미지 저장
        String savedFileName = fileService.uploadFile(uploadPath, image.getOriginalFilename(), image.getBytes());

        // 2. imgPath 세팅
        PetCollectionLogVO voToSave = PetCollectionLogVO.builder()
                .petCollectionId(petCollectionLogVO.getPetCollectionId())
                .runId(petCollectionLogVO.getRunId())
                .memberId(petCollectionLogVO.getMemberId())
                .petRejectionId(petCollectionLogVO.getPetRejectionId())
                .aiConfidence(petCollectionLogVO.getAiConfidence())
                .createdAt(LocalDateTime.now())
                .isCollected(petCollectionLogVO.getIsCollected())
                .imgPath(savedFileName) // 저장된 이미지 파일명
                .build();

        // 3. DB 저장 호출
        petCollectionLogMapper.insertPetCollectionLog(voToSave);
    }
}
