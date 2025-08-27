package com.petcoin.service;

import com.petcoin.domain.PointHistoryVO;
import com.petcoin.dto.PointHistoryDto;
import com.petcoin.mapper.PointMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/*
 * 포인트 Service
 * @author : sehui
 * @fileName : PointServiceImpl
 * @since : 250827
 * @history
 * - 250827 | sehui | 회원별 포인트 내역 조회 기능 추가
 */

@Service
@RequiredArgsConstructor
@Slf4j
public class PointServiceImpl implements PointService {

    private final PointMapper pointMapper;

    //VO -> DTO 변환 메소드
    private List<PointHistoryDto> convertVoToDto(List<PointHistoryVO> voList) {
        return voList.stream()
                .map(vo -> PointHistoryDto.builder()
                        .historyId(vo.getHistoryId())
                        .memberId(vo.getMemberId())
                        .pointChange(vo.getPointChange())
                        .pointBalance(vo.getPointBalance())
                        .actionType(vo.getActionType())
                        .description(vo.getDescription())
                        .createdAt(vo.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    };

    //회원별 포인트 내역 조회
    @Override
    public List<PointHistoryDto> getPointHistoryById(Long memberId) {

        List<PointHistoryVO> pointHisVoList = pointMapper.findPointHistoryById(memberId);

        if(pointHisVoList.isEmpty()){
            throw new IllegalArgumentException("해당 회원의 포인트 내역을 조회할 수 없습니다.");
        }

        //VO -> DTO 변환
        List<PointHistoryDto> pointHisDtoList = convertVoToDto(pointHisVoList);

        return pointHisDtoList;
    }
}
