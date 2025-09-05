package com.petcoin.service;

import com.petcoin.constant.KioskStatus;
import com.petcoin.constant.RunStatus;
import com.petcoin.domain.KioskRunVO;
import com.petcoin.dto.KioskRunCriteria;
import com.petcoin.dto.KioskRunEndRequest;
import com.petcoin.dto.KioskRunResponse;
import com.petcoin.dto.KioskRunStartRequest;
import com.petcoin.mapper.KioskMapper;
import com.petcoin.mapper.KioskRunMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

/*
 * 키오스크 실행 세션 Service 구현체
 * - KioskRunService 인터페이스 구현
 * - 실행 시작/종료/취소 비즈니스 로직 처리 및 동시성 제어
 *
 * 주요 기능:
 *  - startRun  : 키오스크 ONLINE 확인 → RUNNING 중복 체크 → 세션 시작
 *  - endRun    : RUNNING 상태만 COMPLETED 전이, 멱등 처리
 *  - cancelRun : RUNNING 상태만 CANCELLED 전이, 멱등 처리
 *
 * 동시성 제어:
 *  - startRun  → kioskMapper.lockKioskRow(kioskId) 사용
 *  - endRun/cancelRun → kioskRunMapper.lockRunRow(runId) 사용
 *
 * @author  : yukyeong
 * @fileName: KioskRunServiceImpl
 * @since   : 250827
 * @history
 *   - 250827 | yukyeong | ServiceImpl 최초 생성 (dtoToVo, voToDto, startRun 기본 로직 구현)
 *   - 250829 | yukyeong | endRun, cancelRun 메서드 추가 (RUNNING 상태 조건부 전이, 멱등 처리 포함)
 *   - 250829 | yukyeong | 행 잠금(lockKioskRow, lockRunRow) 적용하여 동시성 제어 보강
 *   - 250904 | sehui | 실행 세션 단건 조회 메서드 추가
 *   - 250904 | sehui | 실행 세션 목록 조회 (페이징 + 조건) 메서드 추가
 *   - 250904 | sehui | 실행 세션 총 개수 조회 메서드 추가
 */

@Service
@Slf4j
@RequiredArgsConstructor
public class KioskRunServiceImpl implements KioskRunService{

    private final KioskMapper kioskMapper; // 키오스크 상태 조회용 (ONLINE 여부)
    private final KioskRunMapper kioskRunMapper; // 실행 세션 insert/update
    private final PointHisService pointHisService;

    // DTO <-> VO 매핑
    private KioskRunVO dtoToVo(KioskRunStartRequest dto) {
        KioskRunVO vo = new KioskRunVO();
        vo.setKioskId(dto.getKioskId());
        vo.setMemberId(dto.getMemberId());
        vo.setStatus(RunStatus.RUNNING); // 시작 시 고정
        vo.setStartedAt(LocalDateTime.now());
        return vo;
    }

    // VO <-> DTO 매핑
    private KioskRunResponse voToDto(KioskRunVO vo) {
        KioskRunResponse dto = new KioskRunResponse();
        dto.setRunId(vo.getRunId());
        dto.setKioskId(vo.getKioskId());
        dto.setMemberId(vo.getMemberId());
        dto.setStatus(vo.getStatus());
        dto.setStartedAt(vo.getStartedAt());
        dto.setEndedAt(vo.getEndedAt());
        dto.setTotalPet(vo.getTotalPet());//이지혜 totalPet 추가
        return dto;
    }

    @Override
    @Transactional
    public KioskRunResponse startRun(KioskRunStartRequest req){
        Long kioskId = req.getKioskId();

        // 키오스크 행 잠금으로 동시성 제어
        kioskMapper.lockKioskRow(kioskId);

        // 키오스크 온라인 상태 확인
        KioskStatus status = kioskMapper.findStatusById(kioskId);
        if (status == null) {
            throw new IllegalArgumentException("존재하지 않는 키오스크입니다.");
        }
        if (status != KioskStatus.ONLINE) {
            throw new IllegalStateException("키오스크가 ONLINE 상태가 아닙니다.");
        }

        // 중복 실행 방지 : 같은 키오스크에 RUNNING이 이미 있으면 거절
        int runningCount = kioskRunMapper.getRunningCountByKioskId(kioskId);
        if (runningCount > 0) {
            throw new IllegalStateException("이미 실행중인 세션이 있습니다.");
        }

        // Running insert
        KioskRunVO vo = dtoToVo(req);
        int inserted = kioskRunMapper.insertRun(vo);
        if (inserted != 1) {
            throw new IllegalStateException("실행 시작(insertRun) 실패.");
        }

        // insert 시 run_id가 세팅되어 있음
        KioskRunVO saved = kioskRunMapper.readRunAsVO(vo.getRunId());
        return voToDto(saved);
    }

    @Override
    @Transactional
    public KioskRunResponse endRun(KioskRunEndRequest req){
        Long runId = req.getRunId();
        int totalPet = req.getTotalPet();  //이지혜 totalPet 추가
        
        // 1) 해당 세션 행 잠금 (동시 종료/취소 경쟁 방지)
        KioskRunVO cur = kioskRunMapper.lockRunRow(runId);
        if (cur == null) {
            throw new IllegalArgumentException("세션이 존재하지 않습니다.");
        }

        // 2) RUNNING 상태만 종료 가능 (멱등 처리: 이미 COMPLETED/CANCELLED면 그대로 반환)
        if (cur.getStatus() != RunStatus.RUNNING) {
            // 이미 종료/취소된 상태면 최신값 조회해서 반환
            KioskRunVO saved = kioskRunMapper.readRunAsVO(runId);
            return voToDto(saved);
        }

        // 3) 상태 전이: RUNNING -> COMPLETED
        int updated = kioskRunMapper.completeRun(runId, LocalDateTime.now(), totalPet);//이지혜 totalPet 추가
        if (updated != 1) {
            throw new IllegalStateException("실행 종료(update) 실패");
        }

        //이지혜 포인트 적립 메소드 추가
        Long memberId = cur.getMemberId();
        pointHisService.plusPoint(memberId, totalPet);

        // 4) 최신값 재조회 후 반환
        KioskRunVO saved = kioskRunMapper.readRunAsVO(runId);
        return voToDto(saved);
    }

    @Override
    @Transactional
    public KioskRunResponse cancelRun(KioskRunEndRequest req){
        Long runId = req.getRunId();

        // 1) 해당 세션 행 잠금
        KioskRunVO cur = kioskRunMapper.lockRunRow(runId);
        if (cur == null) {
            throw new IllegalArgumentException("세션이 존재하지 않습니다.");
        }

        // 2) RUNNING 상태만 취소 (멱등 처리)
        if (cur.getStatus() != RunStatus.RUNNING) {
            KioskRunVO saved = kioskRunMapper.readRunAsVO(runId);
            return voToDto(saved);
        }

        // 3) 상태 전이: RUNNING -> CANCELLED
        int updated = kioskRunMapper.cancelRun(runId, LocalDateTime.now());
        if (updated != 1) {
            throw new IllegalStateException("실행 취소(update) 실패");
        }

        // 4) 최신값 재조회 후 반환
        KioskRunVO saved = kioskRunMapper.readRunAsVO(runId);
        return voToDto(saved);
    }

    //실행 세션 단건 조회
    @Override
    public KioskRunResponse readRun(Long runId) {

        //1. 실행 세션 단건 조회
        KioskRunResponse runResponse = kioskRunMapper.readRun(runId);

        //2. 조회 결과 없으면 예외 처리
        if(runResponse == null) {
            throw new IllegalArgumentException("존재하지 않는 실행 세션입니다.");
        }

        return runResponse;
    }

    //실행 세션 목록 조회
    @Override
    public List<KioskRunResponse> getRunListWithPaging(KioskRunCriteria cri) {

        //실행 세션 목록 조회
        List<KioskRunResponse> runResponseList = kioskRunMapper.getRunListWithPaging(cri);

        return runResponseList;
    }

    //실행 세션 총 개수 조회
    @Override
    public int getTotalRunCount(KioskRunCriteria cri) {

        int totalRunCount = kioskRunMapper.getTotalRunCount(cri);

        if(totalRunCount == 0) {
            throw new IllegalArgumentException("실행 세션 총 개수 조회 오류 발생");
        }

        return totalRunCount;
    }
}
