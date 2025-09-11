import { useEffect, useState } from "react";

const KAKAO_APP_KEY = "94195befb8e3d7672f4673efc65d8df6"; // 여기에 JavaScript 키를 넣어주세요.

const useKakaoMap = () => {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false`;
    script.async = true;

    const onScriptLoad = () => {
      window.kakao.maps.load(() => {
        setMapLoaded(true);
      });
    };

    script.addEventListener("load", onScriptLoad);
    document.head.appendChild(script);

    return () => {
      script.removeEventListener("load", onScriptLoad);
      document.head.removeChild(script);
    };
  }, []);

  return mapLoaded;
};

export default useKakaoMap;