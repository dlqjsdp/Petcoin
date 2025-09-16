/*
 * ProcessingScreen.js
 * - 키오스크 분석 대기 화면 컴포넌트
 * - 라즈베리파이 서버(Flask)로부터 분석 완료 상태를 주기적으로 확인하고,
 *   완료되면 다음 단계(onComplete)로 자동 전환
 *
 * 주요 기능:
 *   - runId 기반으로 Flask API에 분석 완료 상태 polling
 *   - 2초 간격으로 상태 확인 (checkAnalysisComplete)
 *   - 완료되면 clearInterval 후 onComplete() 호출
 *   - 분석 중 UI 표시 (제목, 스피너, 안내 텍스트)
 *
 * 사용 API:
 *   - GET /api/analysis/status?runId=123 (Flask)
 *
 * @fileName : ProcessingScreen.js
 * @author   : yukyeong
 * @since    : 250904
 * @history
 *   - 250904 | yukyeong | 최초 생성 - 분석 완료 상태 polling 및 자동 전환 처리
 *   - 250904 | yukyeong | loading-spinner 및 분석 안내 텍스트 UI 구성
 *   - 250904 | yukyeong | polling 중 메모리 누수 방지를 위한 clearInterval 정리 처리
 *   - 250904 | yukyeong | runId 기반 polling 구조 적용 및 자동 취소 처리에 runId 활용 추가
 *   - 250904 | yukyeong | Flask 서버 미응답 시 최대 30회(60초)까지 재시도, 이후 자동 취소 처리로 변경
 *   - 250904 | yukyeong | 분석 완료 응답 수신 시 자동 전환, 실패 시 사용자 alert 후 run 종료
 *   - 250905 | yukyeong | runId 가드 추가 및 폴링 시작/진행/완료/타임아웃/에러/언마운트 단계별 콘솔 로그 정리
 *   - 250905 | yukyeong | 성공 시 onComplete({ totalPet }) 전달, 타임아웃/에러 초과 시 onComplete({ totalPet: 0 })로 일관화
 *   - 250905 | yukyeong | 타임아웃/에러 시 cancelKioskRun 호출 로깅 보강
 *   - 250905 | yukyeong | Flask 응답 done을 엄격 비교(res?.data?.done === true)로 변경, totalPet 안전 파싱 보강
 *   - 250905 | yukyeong | onComplete에 status('DONE'|'TIMEOUT'|'ERROR') 포함하도록 계약 
 *   - 250908 | yukyeong | 폴링 최대 재시도 시간을 60초(30회) → 5분(150회)로 확장(2초 간격 유지)
 */

import React, { useEffect } from 'react';
import '../styles/common.css';
import { checkAnalysisComplete } from '../../api/pi';
import { cancelKioskRun } from '../../api/kiosk';

const ProcessingScreen = ({ runId, onComplete }) => {

  useEffect(() => {
    console.log("🔍 [ProcessingScreen] useEffect mounted. runId:", runId); // runId 확인

    if (!runId) {
      console.warn("⚠️ [Processing] runId가 없어 폴링을 시작하지 않습니다.");
      return;
    }

    let attempts = 0;
    const maxAttempts = 150; // 5분
    let isMounted = true;

    const interval = setInterval(async () => {
      attempts++;

      try {
        const res = await checkAnalysisComplete(runId);
        console.log("✅ Flask 응답 데이터:", res.data);
        if (!isMounted) return;

        const rawDone = res?.data?.done;
        const isDone =
        rawDone === true || rawDone === 'true' || rawDone === 1 || rawDone === '1';
        console.log(`⏳ [Polling] attempt ${attempts} / done(normalized): ${isDone} (raw: ${rawDone})`);

        if (isDone) {
          clearInterval(interval);
          const totalPet = Number(res?.data?.totalPet) || 0;
          console.log("✅ [Polling] 분석 완료 응답 수신. 다음 단계로 이동"); // 완료 로그
          onComplete({ status: 'DONE', totalPet }); // 수량 전달
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          console.warn("분석 타임아웃: 자동 취소 처리");
          console.warn("🚨 [Timeout] 분석 완료 응답 없음. 취소 요청 시작 (runId:", runId, ")"); // 타임아웃 로그

          try {
            const cancelRes = await cancelKioskRun(runId);
            console.log("✅ [Cancel] 취소 요청 성공", cancelRes.data); // 취소 응답 로그
          } catch (cancelErr) {
            console.error("❌ [Cancel] 취소 요청 실패", cancelErr); // 취소 실패 로그
          }

          alert("분석 시간이 초과되어 세션이 종료되었습니다.");
          console.warn("➡️ [Processing] onComplete({ totalPet: 0 }) 호출 (타임아웃)");
          onComplete({ status: 'TIMEOUT', totalPet: 0 }); // 또는 goHome()
        }

      } catch (err) {
        console.error("분석 상태 확인 실패", err);
        console.error("❌ [Polling] 분석 상태 확인 실패", err); // Flask 에러 로그

        if (attempts >= maxAttempts) {
          clearInterval(interval);

          try {
            const cancelRes = await cancelKioskRun(runId);
            console.log("✅ [Cancel] 취소 요청 성공", cancelRes.data);
          } catch (cancelErr) {
            console.error("❌ [Cancel] 취소 요청 실패", cancelErr);
          }

          alert("서버 응답이 없어 세션을 종료합니다.");
          console.warn("➡️ [Processing] onComplete({ totalPet: 0 }) 호출 (에러 누적)");
          onComplete({ status: 'ERROR', totalPet: 0 });
        }
      }

    }, 2000); // 2초 간격

    return () => {
      isMounted = false;
      clearInterval(interval);
      console.log("🧹 [ProcessingScreen] 컴포넌트 언마운트 - polling 중단됨");
    };
  }, [runId, onComplete]);

  return (
    <div className="content">
      <h1 className="title">분석 중입니다.</h1>
      <br></br>
      <p className="info">라벨 및 이물질을 제거해주세요.</p><br></br>

      <div className="loading-spinner large"></div>

      <div className="processing-text">
        페트병을 분석하고 있습니다.<br />
        잠시만 기다려 주세요...
      </div>
    </div>
  );
};

export default ProcessingScreen;