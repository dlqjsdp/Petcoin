package com.petcoin.domain;


/*
 * 페트병 회수 기록 VO
 * @author : leejihye
 * @fileName : PetCollectionLogVO
 * @since : 250830
 * @history
 *  - 250830 | leejihye | 페트병 회수 기록 VO 생성
 */

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PetCollectionLogVO {

    private Long petCollectionId;
    private Long runId;
    private Long memberId;
    private Long petRejectionId;
    private Double aiConfidence;
    private LocalDateTime createdAt;
    private Boolean isCollected;
    private String imgPath;
}
