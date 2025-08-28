//package com.petcoin.service;
//
//import com.petcoin.constant.KioskStatus;
//import com.petcoin.constant.RunStatus;
//import com.petcoin.domain.KioskRunVO;
//import com.petcoin.dto.KioskRunEndRequest;
//import com.petcoin.dto.KioskRunResponse;
//import com.petcoin.dto.KioskRunStartRequest;
//import com.petcoin.mapper.KioskMapper;
//import com.petcoin.mapper.KioskRunMapper;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDateTime;
//
//@Service
//@Slf4j
//@RequiredArgsConstructor
//public class KioskRunServiceImpl implements KioskRunService{
//
//    private final KioskMapper kioskMapper; // 키오스크 상태 조회용 (ONLINE 여부)
//    private final KioskRunMapper kioskRunMapper;   // 실행 세션 insert/update
//
//    // KioskRunServiceImpl 내부
//    private KioskRunVO dtoToVo(KioskRunStartRequest dto) {
//        KioskRunVO vo = new KioskRunVO();
//        vo.setKioskId(dto.getKioskId());
//        vo.setMemberId(dto.getMemberId());
//        vo.setStatus(RunStatus.RUNNING); // 시작 시 고정
//        vo.setStartedAt(LocalDateTime.now());
//        return vo;
//    }
//
//    private KioskRunResponse voToDto(KioskRunVO vo) {
//        KioskRunResponse dto = new KioskRunResponse();
//        dto.setRunId(vo.getRunId());
//        dto.setKioskId(vo.getKioskId());
//        dto.setMemberId(vo.getMemberId());
//        dto.setStatus(vo.getStatus());
//        dto.setStartedAt(vo.getStartedAt());
//        dto.setEndedAt(vo.getEndedAt());
//        return dto;
//    }
//
//    @Override
//    @Transactional
//    public KioskRunResponse startRun(KioskRunStartRequest req){
//
//    }
//
//    @Override
//    @Transactional
//    public KioskRunResponse endRun(KioskRunEndRequest req){
//
//    }
//
//    @Transactional
//    public KioskRunResponse cancelRun(KioskRunEndRequest req){
//    }
//}
