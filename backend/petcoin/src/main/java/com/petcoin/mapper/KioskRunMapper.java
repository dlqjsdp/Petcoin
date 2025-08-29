package com.petcoin.mapper;

import com.petcoin.domain.KioskRunVO;
import com.petcoin.dto.KioskRunCriteria;
import com.petcoin.dto.KioskRunResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;

/*
 * 키오스크 실행 세션 Mapper 인터페이스
 * kiosk_run 테이블과 연동되어 실행 이력(세션) 데이터를 관리
 *
 * 구분:
 * - 키오스크 실행용 : 사용자가 키오스크에서 [시작/종료/취소] 버튼을 누를 때 호출
 * - 관리자 페이지용 : 실행 이력 조회/검색/통계 등 관리 기능
 *
 * 주요 기능:
 * [키오스크 실행용]
 *  - 실행 세션 생성 (insertRun) → RUNNING 상태 시작
 *  - 실행 완료 처리 (completeRun) → RUNNING → COMPLETED
 *  - 실행 취소 처리 (cancelRun)   → RUNNING → CANCELLED
 *  - 특정 키오스크 RUNNING 세션 개수 확인 (getRunningCountByKioskId) → 중복 실행 방지
 *
 * [관리자 페이지용]
 *  - 실행 세션 단건 조회 (readRun: phone 포함)
 *  - 실행 세션 목록 조회 (getRunListWithPaging: 페이징 + 조건 검색)
 *  - 실행 세션 총 개수 조회 (getTotalRunCount)
 *
 * @author  : yukyeong
 * @fileName: KioskRunMapper
 * @since   : 250827
 * @history
 *   - 250827 | yukyeong | Mapper 최초 생성 (insertRun, completeRun, cancelRun, readRun, getRunListWithPaging, getTotalRunCount, getRunningCountByKioskId 메서드 정의)
 */

@Mapper
public interface KioskRunMapper {

    // 키오스크 실행용
    // 1-1) 실행 세션 생성 (RUNNING 상태로 시작)
    public int insertRun(KioskRunVO vo); // useGeneratedKeys로 runId 채움

    // 1-2) 실행 완료 처리 (RUNNING -> COMPLETED)
    public int completeRun(@Param("runId") Long runId,
                           @Param("endedAt")LocalDateTime endedAt);

    // 1-3) 실행 취소 처리 (RUNNING -> CANCELLED)
    public int cancelRun(@Param("runId") Long runId,
                         @Param("endedAt") LocalDateTime endedAt);

    // 1-4) 특정 키오스크 RUNNING 세션 중복 실행 여부 확인
    public int getRunningCountByKioskId(@Param("kioskId") Long kioskId);

    // 관리자 페이지용
    // 2-1) 실행 세션 단건 조회 (단건 조회는 phone 포함 DTO로 반환)
    public KioskRunResponse readRun(Long runId);

    // 2-2) 실행 세션 목록 조회 (페이징 + 조건)
    public List<KioskRunVO> getRunListWithPaging(KioskRunCriteria cri);

    // 2-3) 실행 세션 총 개수 조회
    public int getTotalRunCount(KioskRunCriteria cri);

}
