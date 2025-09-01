package com.petcoin.service;

import com.petcoin.domain.PetCollectionLogVO;
import com.petcoin.mapper.PetCollectionLogMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class PetCollectionLogServiceImplTest {

    @InjectMocks
    private PetCollectionLogServiceImpl petCollectionLogService;

    @Mock
    private FileService fileService;

    @Mock
    private PetCollectionLogMapper petCollectionLogMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void savePetCollection_shouldSaveImageAndData() throws Exception {
        // given
        MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.getOriginalFilename()).thenReturn("testImage.jpg");
        when(mockFile.getBytes()).thenReturn(new byte[]{1, 2, 3});

        String fakeSavedFileName = "uuid-testImage.jpg";
        when(fileService.uploadFile(anyString(), anyString(), any())).thenReturn(fakeSavedFileName);

        PetCollectionLogVO inputVO = PetCollectionLogVO.builder()
                .petCollectionId(1L)
                .runId(10L)
                .memberId(100L)
                .petRejectionId(5L)
                .aiConfidence(0.95)
                .createdAt(LocalDateTime.now())
                .isCollected(true)
                .imgPath(null)
                .build();

        // when & then
        assertDoesNotThrow(() -> petCollectionLogService.savePetCollection(mockFile, inputVO));

        // verify fileService.uploadFile 호출 확인
        verify(fileService, times(1))
                .uploadFile(anyString(), eq("testImage.jpg"), any());

        // verify DB 저장 메서드 호출 확인
        ArgumentCaptor<PetCollectionLogVO> captor = ArgumentCaptor.forClass(PetCollectionLogVO.class);
        verify(petCollectionLogMapper, times(1)).insertPetCollectionLog(captor.capture());

        PetCollectionLogVO savedVO = captor.getValue();
        // 저장된 VO에 파일명이 제대로 세팅됐는지 확인
        assert(fakeSavedFileName.equals(savedVO.getImgPath()));
    }
}
