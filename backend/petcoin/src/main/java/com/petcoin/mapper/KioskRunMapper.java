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
 * DB 연동을 통해 실행 세션 생성, 상태 변경(완료/취소), 단건 조회, 목록 조회, 중복 실행 체크 등을 수행
 *
 * 주요 기능:
 * - 실행 세션 생성 (insertRun)
 * - 실행 세션 단건 조회 (readRun)
 * - 실행 세션 목록 조회 (getRunListWithPaging)
 * - 실행 세션 총 개수 조회 (getTotalRunCount)
 * - 실행 완료 처리 (completeRun)
 * - 실행 취소 처리 (cancelRun)
 * - 특정 키오스크 RUNNING 세션 존재 여부 확인 (getRunningCountByKioskId)
 *
 * @author  : yukyeong
 * @fileName: KioskRunMapper
 * @since   : 250827
 * @history
 *   - 250827 | yukyeong | Mapper 최초 생성 (insertRun, completeRun, cancelRun, readRun, getRunListWithPaging, getTotalRunCount, getRunningCountByKioskId 메서드 정의)
 */

@Mapper
public interface KioskRunMapper {

    // 1) 실행 세션 생성 (RUNNING 상태로 시작)
    public int insertRun(KioskRunVO vo); // useGeneratedKeys로 runId 채움

    // 2) 실행 완료 처리 (RUNNING -> COMPLETED)
    public int completeRun(@Param("runId") Long runId,
                           @Param("endedAt")LocalDateTime endedAt);

    // 3) 실행 취소 처리 (RUNNING -> CANCELLED)
    public int cancelRun(@Param("runId") Long runId,
                  @Param("endedAt") LocalDateTime endedAt);

    // 4) 실행 세션 단건 조회 (단건 조회는 phone 포함 DTO로 반환)
    public KioskRunResponse readRun(Long runId);

    // 5) 실행 세션 목록 조회 (페이징 + 조건)
    public List<KioskRunVO> getRunListWithPaging(KioskRunCriteria cri);

    // 6) 실행 세션 총 개수 조회 (페이징 + 조건)
    public int getTotalRunCount(KioskRunCriteria cri);

    // 7) 특정 키오스크 RUNNING 세션 중복 실행 여부 확인
    public int getRunningCountByKioskId(Long kioskId);
}
