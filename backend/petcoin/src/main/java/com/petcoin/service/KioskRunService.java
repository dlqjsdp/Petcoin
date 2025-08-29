package com.petcoin.service;

import com.petcoin.dto.KioskRunEndRequest;
import com.petcoin.dto.KioskRunResponse;
import com.petcoin.dto.KioskRunStartRequest;

/*
 * 키오스크 실행 세션 Service 인터페이스
 * - 키오스크에서 실행 시작/종료/취소 버튼 동작 시 호출되는 비즈니스 로직 규격을 정의
 * - 구현체: KioskRunServiceImpl
 *
 * 주요 기능:
 *  - startRun : 키오스크가 ONLINE 상태일 때 실행 세션 생성 (RUNNING 시작)
 *  - endRun   : RUNNING → COMPLETED 전이만 허용
 *  - cancelRun: RUNNING → CANCELLED 전이만 허용
 *
 * @author  : yukyeong
 * @fileName: KioskRunService
 * @since   : 250827
 * @history
 *   - 250827 | yukyeong | 인터페이스 최초 생성 (startRun, endRun, cancelRun 메서드 정의)
 */

public interface KioskRunService {

    // 실행 시작 : 키오스크가 ONLINE이고, 해당 키오스크에 RUNNING 세션이 없어야 함
    KioskRunResponse startRun(KioskRunStartRequest req);


    // 실행 종료 : RUNNING → COMPLETED 전이만 허용
    KioskRunResponse endRun(KioskRunEndRequest req);


    // 실행 취소 : RUNNING → CANCELLED 전이만 허용
    KioskRunResponse cancelRun(KioskRunEndRequest req);

}
