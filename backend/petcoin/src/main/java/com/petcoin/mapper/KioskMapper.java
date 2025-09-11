package com.petcoin.mapper;

import com.petcoin.constant.KioskStatus;
import com.petcoin.domain.KioskVO;
import com.petcoin.dto.KioskCriteria;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;

/*
 * 키오스크 장치 Mapper 인터페이스
 * kiosk 테이블과 연동되어 키오스크 장치의 CRUD 및 상태 전이를 관리
 *
 * 구분:
 * - 관리자 페이지용 : 키오스크 등록/수정/삭제/조회 기능
 * - 키오스크 실행용 : 키오스크 상태 전이 (예: ONLINE → RUNNING)
 *
 * 주요 기능:
 * [관리자 페이지용]
 *  - 단건 조회 (read)
 *  - 전체 조회 (getListWithPaging, getTotalCount)
 *  - 등록 (insert)
 *  - 수정 (update)
 *  - 소프트삭제 (softDelete)
 *
 * [키오스크 실행용]
 *  - 상태 전이 (updateStatusIfCurrent) : 현재 상태가 from일 때만 to로 변경
 *  - 현재 상태 단건 조회 (findStatusById) : 온라인 여부 확인용
 *
 * @author  : yukyeong
 * @fileName: KioskMapper
 * @since   : 250828
 * @history
 *   - 250828 | yukyeong | Mapper 최초 생성 (read, getListWithPaging, getTotalCount, insert, update, softDelete, transitionStatus 정의)
 *   - 250829 | yukyeong | findStatusById 추가 (키오스크 ONLINE 여부 확인용), lockKioskRow 추가 (행 잠금: startRun 시 동시 실행 방지용)
 *   - 250905 | sehui | 대시보드에서 조회할 키오스크 운영 상태별 개수 조회 기능 추가
 *   - 250911 | yukyeong | 관리자 페이지 전용 updateStatus 메서드 추가 (키오스크 상태 단순 변경: ONLINE/MAINT/OFFLINE)
 */

@Mapper
public interface KioskMapper {

    // 관리자 페이지에서 키오스크 조회
    // 1-1) 키오스크 장치 단건 조회
    public KioskVO read(Long kioskId);

    // 1-2) 키오스크 장치 전체조회 (검색 + 페이징 포함)
    public List<KioskVO> getListWithPaging(KioskCriteria cri);

    // 1-3) 키오스크 총 개수 조회
    public int getTotalCount(KioskCriteria cri);

    // 1-4) 관리자 페이지에서 키오스크 상태 변경
    public int updateStatus(@Param("kioskId") Long kioskId,
                            @Param("status") KioskStatus status);


    // 관리자페이지에서 키오스크 등록, 수정, 삭제
    // 2-1) 키오스크 등록
    public int insert(KioskVO vo); // useGeneratedKeys = true (XML에서 설정)

    // 2-2) 키오스크 정보 수정
    public int update(KioskVO vo); // 일반 정보 수정 (updated_at 갱신)

    // 2-3) 키오스크 소프트삭제 (그냥 삭제하면 기존의 기록들도 함께 삭제되기 때문에 소프트삭제 사용)
    public int softDelete(Long kioskId); // is_deleted=1

    // 키오스크 버튼 클릭시 상태 변경
    // 3-1) 키오스크 상태 전이 : 현재 상태가 from(현재 상태)일 때만 to(바꾸려는 목표 상태)로 변경
    public int transitionStatus(@Param("kioskId") Long kioskId,
                              @Param("from") KioskStatus from,
                              @Param("to") KioskStatus to);


    // 3-2) 키오스크 현재 상태 조회 (ONLINE 여부 확인용)
    public KioskStatus findStatusById(Long kioskId);


    // 3-3) 행 잠금: 시작 동시성 제어용
    public KioskVO lockKioskRow(Long kioskId);
    
    //관리자페이지의 대시보드(키오스크 상태별 현황 조회)
    // 4-1) 운영중인 키오스크 개수
    public int onlineCount();
    
    // 4-2) 미운영중인 키오스크 개수
    public int offlineCount();
    
    // 4-3) 점검중인 키오스크 개수
    public int maintCount();

}
