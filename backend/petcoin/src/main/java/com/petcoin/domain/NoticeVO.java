package com.petcoin.domain;

/*
 * @fileName : NoticeVO
 * 안내사항 정보를 담은 vo 클래스
 * @author : heekyung
 * @since : 250827
 * @history
 * - 250827 | heekyung | NoticeVO 생성
 *
 *
 * notice_id BIGINT AUTO_INCREMENT PRIMARY KEY, -- 게시글 고유변호(기본키)
    member_id BIGINT NOT NULL, -- 작성자 ID(외래키)
    title VARCHAR(255) NOT NULL, -- 게시글 제목
    content VARCHAR(5000) NOT NULL, -- 게시글 내용
    view_count INT NOT NULL DEFAULT 0, -- 조회수(초기값 0)
    created_at DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP), -- 게시글 등록일
    updated_at DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP), -- 게시글 수정일
    FOREIGN KEY (member_id) REFERENCES member(member_id)
    *
    *
 */

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoticeVO {

    private Long noticeId; //공지사항 ID
    private Long memberId; // 작성자 ID
    private String title; //제목
    private String content; //내용
    private int viewCount; //조회수
    private LocalDateTime createdAt; //등록일
    private LocalDateTime updatedAt; //수정일

}
