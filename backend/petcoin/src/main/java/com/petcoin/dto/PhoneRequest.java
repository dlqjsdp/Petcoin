package com.petcoin.dto;

/*
 * @fileName : PhoneRequest
 * 로그인 진행 시 프론트에서 백엔드로 사용자가 입력한 값이 맞는지 확인 요청 전용 DTO
 * @author : heekyung
 * @since : 250827
 * @history
 * - 250827 | heekyung | PhoneRequest 생성 / 비밀번호는 통신하면 안되니끼 기재 X
 */

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PhoneRequest {

    @NotBlank
    private String phone;


}
