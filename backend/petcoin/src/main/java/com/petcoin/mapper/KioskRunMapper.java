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
 *   - 250829 | yukyeong | lockRunRow 추가 (행 잠금: endRun/cancelRun 시 동시성 제어), readRunAsVO 추가 (실행 로직용 VO 반환, DB DEFAULT/트리거 값 반영 확인용)
 *   - 250905 | sehui | 대시보드용 총 수거량 조회 추가
 */

@Mapper
public interface KioskRunMapper {

    // 키오스크 실행용
    // 1-1) 실행 세션 생성 (RUNNING 상태로 시작)
    public int insertRun(KioskRunVO vo); // useGeneratedKeys로 runId 채움

    // 1-2) 실행 완료 처리 (RUNNING -> COMPLETED)
    public int completeRun(@Param("runId") Long runId,
                           @Param("endedAt")LocalDateTime endedAt,
                           @Param("totalPet") int totalPet);//이지혜 totalPet 추가

    // 1-3) 실행 취소 처리 (RUNNING -> CANCELLED)
    public int cancelRun(@Param("runId") Long runId,
                         @Param("endedAt") LocalDateTime endedAt);

    // 1-4) 특정 키오스크 RUNNING 세션 중복 실행 여부 확인
    public int getRunningCountByKioskId(Long kioskId);

    // 1-5) 실행 세션 행 잠금 (종료/취소 시 동시성 제어)
    public KioskRunVO lockRunRow(Long runId);

    // 1-6) 실행 세션 단건 조회 (실행 로직용: VO 반환, DB DEFAULT/트리거 반영값 확인용)
    public KioskRunVO readRunAsVO(Long runId);

    // 관리자 페이지용
    // 2-1) 실행 세션 단건 조회 (단건 조회는 phone 포함 DTO로 반환)
    public KioskRunResponse readRun(Long runId);

    // 2-2) 실행 세션 목록 조회 (페이징 + 조건)
    public List<KioskRunResponse> getRunListWithPaging(KioskRunCriteria cri);

    // 2-3) 실행 세션 총 개수 조회
    public int getTotalRunCount(KioskRunCriteria cri);

    // 2-4) 총 수거량 조회
    public int getTotalPetCount();

}
