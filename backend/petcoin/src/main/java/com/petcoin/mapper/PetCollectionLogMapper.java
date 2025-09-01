package com.petcoin.mapper;

/*
 * 페트병 회수 기록 VO
 * @author : leejihye
 * @fileName : PetCollectionLogMapper
 * @since : 250830
 * @history
 *  - 250830 | leejihye | 페트병 회수 기록 mapper 생성
 */

import com.petcoin.domain.PetCollectionLogVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PetCollectionLogMapper {

    //페트병 수거시 페트병 정보 db 저장
    public void insertPetCollectionLog(PetCollectionLogVO petCollectionLogVO);
}
