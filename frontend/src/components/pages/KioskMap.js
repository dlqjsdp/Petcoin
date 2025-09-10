/*
 * KioskMap.js
 * - 카카오 지도 기반 키오스크 위치 표시 컴포넌트
 *
 * 주요 기능:
 *   - /api/locations API 호출하여 모든 키오스크 위치 불러오기
 *   - 카카오 지도 SDK를 활용해 지도 초기화 및 마커 표시
 *   - 각 마커 클릭 시 인포윈도우로 상세 정보(위치명, 주소) 표시
 *
 * @fileName : KioskMap.js
 * @author  : heekyung
 * @since   : 250909
 * @history
 *   - 250909 | heekyung | 지도 기본 구조 및 마커 표시 구현
 *   - 250910 | heekyung | api 통신, 마커 표시 및 인포윈도우 기능 추가
 */
import React, { useEffect, useRef, useState } from "react";

const mapStyle = {
  width: "100%",
  height: "400px",
  backgroundColor: "#f5f5f5",
  borderRadius: "10px",
};

const KioskMap = ({ locations = [] }) => {
  const mapRef = useRef(null);          // DOM 요소 ref
  const mapInstance = useRef(null);     // 카카오 지도 인스턴스 저장
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentMarkers, setCurrentMarkers] = useState([]);

  // 1. 카카오 지도 SDK 로드
  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=94195befb8e3d7672f4673efc65d8df6&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => setMapLoaded(true));
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // 2. 지도 초기화
  useEffect(() => {
    if (mapLoaded && mapRef.current && !mapInstance.current) {
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울 시청 좌표
        level: 5,
      };
      mapInstance.current = new window.kakao.maps.Map(mapRef.current, options);
    }
  }, [mapLoaded]);

  // 3. 마커 업데이트
  useEffect(() => {
    if (!mapLoaded || !mapInstance.current) return;

    // 기존 마커 제거
    currentMarkers.forEach(marker => marker.setMap(null));

    const newMarkers = [];
    locations.forEach(location => {
      if (!location.latitude || !location.longitude) {
        console.warn("잘못된 좌표 데이터:", location);
        return;
      }

      const markerPosition = new window.kakao.maps.LatLng(location.latitude, location.longitude);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        map: mapInstance.current,
      });

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:10px;text-align:center;">
                    <strong>${location.recycleName ?? "이름 없음"}</strong><br/>
                    ${location.address ?? ""}
                  </div>`,
      });

      window.kakao.maps.event.addListener(marker, "click", () => {
        infowindow.open(mapInstance.current, marker);
      });

      newMarkers.push(marker);
    });

    setCurrentMarkers(newMarkers);

    if (locations.length > 0) {
      mapInstance.current.setCenter(
        new window.kakao.maps.LatLng(locations[0].latitude, locations[0].longitude)
      );
    }
  }, [locations, mapLoaded]);

  return <div ref={mapRef} style={mapStyle}></div>;
};

export default KioskMap;