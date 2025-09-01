package com.petcoin.service;
/*
 * 페트병 회수 기록 mapper
 * @author : leejihye
 * @fileName : PetCollectionLogService
 * @since : 250830
 * @history
 *  - 250830 | leejihye | 페트병 회수 기록 mapper 생성
 */
import com.petcoin.domain.PetCollectionLogVO;
import org.springframework.web.multipart.MultipartFile;

public interface PetCollectionLogService {

    public void savePetCollection(MultipartFile image, PetCollectionLogVO petCollectionLogVO) throws Exception;
}
