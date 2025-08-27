package com.petcoin.service;

import com.petcoin.dto.*;
import com.petcoin.mapper.DisposalMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DisposalService {
    private final DisposalMapper disposalMapper;

    public PageBundle<DisposalListRowDto> list(long memberId, DisposalListFilter f){
        int page = Math.max(f.getPage(), 0);
        int size = f.getSize() <= 0 ? 10 : f.getSize();
        int offset = page * size;
        List<DisposalListRowDto> rows = disposalMapper.selectList(memberId, f.getFrom(), f.getTo(),
                f.getRegion1(), f.getRegion2(), f.getItemName(), f.getStatus(), offset, size);
        long total = disposalMapper.countList(memberId, f.getFrom(), f.getTo(),
                f.getRegion1(), f.getRegion2(), f.getItemName(), f.getStatus());
        return new PageBundle<>(rows, total, page, size);
    }

    public DisposalDetailDto detail(long memberId, long disposalId){
        return disposalMapper.selectDetail(memberId, disposalId);
    }

    @lombok.Data @lombok.AllArgsConstructor
    public static class PageBundle<T>{
        private List<T> content; private long total; private int page; private int size;
    }
}

