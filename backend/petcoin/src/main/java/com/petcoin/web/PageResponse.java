package com.petcoin.web;

import lombok.*;
import java.util.List;

@Getter @Setter @Builder
@AllArgsConstructor @NoArgsConstructor
public class PageResponse<T> {
    private List<T> content;
    private long totalElements;
    private int page;
    private int size;
}
