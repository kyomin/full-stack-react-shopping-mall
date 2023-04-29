import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

const useIntersection = (targetRef: RefObject<HTMLElement>) => {
  const observerRef = useRef<IntersectionObserver>();
  const [intersecting, setIntersecting] = useState(false);

  const getObserver = useCallback(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver((entries) => {
        /**
         * isIntersecting
         * 더 불러오기의 기준이 되는 돔(targetRef)이 화면과 교차하는지 검증
         * true면 사용자가 스크롤을 내려 화면이 하단에 도달했다는 뜻이다.
         */
        setIntersecting(entries.some((entry) => entry.isIntersecting));
      });
    }

    return observerRef.current;
  }, [observerRef.current]);

  useEffect(() => {
    if (targetRef.current) {
      // 더 불러오기의 기준이 되는 돔(fetchMoreRef)을 관찰하겠다(보통 화면 맨 하단).
      getObserver().observe(targetRef.current);
    }
  }, [targetRef.current]);

  return intersecting;
};

export default useIntersection;
