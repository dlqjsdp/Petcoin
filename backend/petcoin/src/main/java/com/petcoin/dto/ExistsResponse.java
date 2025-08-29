package com.petcoin.dto;

/*
 * @fileName : ExistsResponse
 * 로그인 진행 시 백엔드에서 DB에 연락처가 존재하는지를 확인 후 프론트에 알려주는 응답 전용 DTO
 * @author : heekyung
 * @since : 250827
 * @history
 * - 250827 | heekyung | ExistsResponse 생성
 */

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ExistsResponse {

    //번호가 존재하는지 true, false로 나타냄
    private boolean exists;
}
