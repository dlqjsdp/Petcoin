package com.petcoin.controller;

import com.petcoin.constant.PointType;
import com.petcoin.dto.MemberSimpleDto;
import com.petcoin.dto.NoticeDto;
import com.petcoin.dto.PointHistoryDto;
import com.petcoin.dto.RefundRowDto;
import com.petcoin.dto.RefundApplyDto;     // ✅ 추가
import com.petcoin.service.MemberService;
import com.petcoin.service.PointService;
import com.petcoin.service.RefundService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDate;
import java.util.*;
import java.util.Locale;                  // ✅ 추가

@Controller
@RequiredArgsConstructor
public class MypageController {

    private final MemberService memberService;
    private final PointService pointService;
    private final RefundService refundService;

    @GetMapping("/mypage")
    public String mypage(@RequestParam(required = false) String phone,
                         @RequestParam(required = false) Long memberId,
                         @RequestParam(required = false) String from,
                         @RequestParam(required = false) String to,
                         Model model,
                         RedirectAttributes ra) {

        Long resolvedMemberId = resolveMemberId(phone, memberId).orElse(null);
        if (resolvedMemberId == null) {
            ra.addFlashAttribute("toast", "회원 식별이 필요합니다. ?phone=010-0000-0000 또는 ?memberId=1 로 접속해 보세요.");
            model.addAttribute("member", MemberSimpleDto.builder().memberId(null).phone(phone).role("USER").build());
            model.addAttribute("pointBalance", 0);
            model.addAttribute("recentHistories", Collections.emptyList());
            model.addAttribute("requests", Collections.emptyList());
            model.addAttribute("noticeList", Collections.emptyList());
            return "mypage";
        }

        MemberSimpleDto member = memberService.getMemberSimple(resolvedMemberId);
        model.addAttribute("member", member);

        LocalDate fromDate = parseDate(from);
        LocalDate toDate   = parseDate(to);

        long earn = pointService.sumEarnByFilter(resolvedMemberId, fromDate, toDate);
        long use  = pointService.sumUseByFilter(resolvedMemberId, fromDate, toDate);
        long hold = pointService.sumRefundHold(resolvedMemberId);
        long balance = pointService.calculateBalance(resolvedMemberId);
        model.addAttribute("pointBalance", balance);

        // 이력 (type 모호성 제거)
        List<PointHistoryDto> recentHistories =
                pointService.getHistoryPaged(resolvedMemberId, fromDate, toDate, (PointType) null, 20, 0);
        model.addAttribute("recentHistories", recentHistories);

        // 환급 요청 목록 (page=0, size=20)
        var refundPage = refundService.list(resolvedMemberId, null, 0, 20);
        List<RefundRowDto> refunds = refundPage.getContent();
        model.addAttribute("requests", refunds);

        model.addAttribute("noticeList", Collections.<NoticeDto>emptyList());
        model.addAttribute("sumEarnFiltered", earn);
        model.addAttribute("sumUseFiltered", use);
        model.addAttribute("sumHold", hold);

        return "mypage";
    }

    @PostMapping("/mypage/profile")
    public String updatePhone(@RequestParam String phone, RedirectAttributes ra) {
        ra.addFlashAttribute("toast", "현재 스키마에 연락처 변경 UPDATE 쿼리가 없어 DB 반영은 생략되었습니다.");
        return "redirect:/mypage?phone=" + phone;
    }

    @PostMapping("/mypage/password")
    public String changePassword(@RequestParam String newPassword,
                                 @RequestParam String confirmPassword,
                                 RedirectAttributes ra) {
        if (!newPassword.equals(confirmPassword)) {
            ra.addFlashAttribute("toast", "비밀번호 확인이 일치하지 않습니다.");
            return "redirect:/mypage";
        }
        ra.addFlashAttribute("toast", "현재 스키마에 password 컬럼이 없어 DB 반영은 생략되었습니다.");
        return "redirect:/mypage";
    }

    @PostMapping("/mypage/point/request")
    public String requestRefund(@RequestParam long requestAmount,     // ✅ DTO(points: long)에 맞춤
                                @RequestParam String bankName,
                                @RequestParam String accountNumber,
                                @RequestParam(required = false) String accountHolder,
                                @RequestParam(required = false) String idemKey,
                                @RequestParam(required = false) Long memberId,
                                @RequestParam(required = false) String phone,
                                RedirectAttributes ra) {
        Long resolvedMemberId = resolveMemberId(phone, memberId).orElse(1L);

        // DTO 규칙에 맞춰 변환
        String bankCode = normalizeBankCode(bankName);
        RefundApplyDto dto = RefundApplyDto.builder()
                .points(requestAmount)                                       // @Min(10000)
                .accountHolder((accountHolder == null || accountHolder.isBlank()) ? "본인" : accountHolder.trim())
                .bankCode(bankCode)                                          // 대문자/숫자 2~20
                .accountNumber(accountNumber == null ? "" : accountNumber.trim()) // 숫자/하이픈 8~30
                .build();

        try {
            long refundId = refundService.apply(resolvedMemberId, dto, idemKey); // ✅ 변경
            ra.addFlashAttribute("toast", "환급 요청이 접수되었습니다. (#" + refundId + ")");
        } catch (IllegalStateException e) {
            ra.addFlashAttribute("toast", e.getMessage());
        }
        return "redirect:/mypage?memberId=" + resolvedMemberId;
    }

    private Optional<Long> resolveMemberId(String phone, Long memberId) {
        if (memberId != null) return Optional.of(memberId);
        if (phone != null && !phone.isBlank()) return memberService.findMemberIdByPhone(phone);
        return Optional.of(1L);
    }

    private LocalDate parseDate(String ymd) {
        try {
            if (ymd == null || ymd.isBlank()) return null;
            return LocalDate.parse(ymd);
        } catch (Exception e) {
            return null;
        }
    }

    /** 폼의 은행명 → DTO의 bankCode(영대문자/숫자 2~20)로 정규화 */
    private String normalizeBankCode(String input) {
        if (input == null) return "ETC";
        String s = input.trim().toUpperCase(Locale.ROOT);

        // 한글 표기 간단 매핑
        if (s.contains("카카오")) return "KAKAOBANK";
        if (s.contains("토스"))   return "TOSSBANK";
        if (s.contains("국민"))   return "KB";
        if (s.contains("신한"))   return "SHINHAN";
        if (s.contains("우리"))   return "WOORI";
        if (s.contains("하나"))   return "HANA";

        // 그 외 영문/코드 → 영대문자/숫자만 유지
        s = s.replaceAll("[^0-9A-Z]", "");
        if (s.length() < 2) return "ETC";
        if (s.length() > 20) return s.substring(0, 20);
        return s;
    }
}
