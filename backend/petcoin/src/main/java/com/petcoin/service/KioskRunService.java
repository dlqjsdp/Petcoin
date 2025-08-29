package com.petcoin.service;

import com.petcoin.dto.KioskRunEndRequest;
import com.petcoin.dto.KioskRunResponse;
import com.petcoin.dto.KioskRunStartRequest;

public interface KioskRunService {

    // 실행 시작 : 키오스크가 ONLINE이고, 해당 키오스크에 RUNNING 세션이 없어야 함
    KioskRunResponse startRun(KioskRunStartRequest request);


    // 실행 종료 : RUNNING → COMPLETED 전이만 허용
    KioskRunResponse endRun(KioskRunEndRequest request);


    // 실행 취소 : RUNNING → CANCELLED 전이만 허용
    KioskRunResponse cancleRun(KioskRunEndRequest request);

}
