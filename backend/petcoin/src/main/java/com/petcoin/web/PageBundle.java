package com.petcoin.web;

import lombok.Builder;
import lombok.Value;

import java.util.List;

@Value
@Builder
public class PageBundle<T> {
    List<T> content;
    long total;
    int page;   // 0-base
    int size;
}