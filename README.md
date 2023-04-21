# 개요
React 관련 여러 기술들을 사용하여 간단한 쇼핑몰을 만들어 보는 프로젝트입니다.   
깊게는 안 들어가고, 여러 기술들을 체험해보는 취지로 시작한 프로젝트입니다.   
   
# Step 1
- 클라이언트 환경세팅(vite), 라우터 처리
- 상품목록 및 상세페이지 작성
- React Query 적용 및 캐시 정책 맛보기
- GNB 작성   
   
# Step 2
- Mock Service Worker 도입 => 브라우저 단에서 서버 흉내내기
- 상품목록 및 장바구니 mock API 작성
- 장바구니 페이지 작성   
   
# Step 3
- 장바구니 API 적용
- 낙관적 업데이트와 invalidateQueries를 각각 적용하여 장단점 파악해 보기
- 장바구니 삭제 및 선택하기 기능 구현
- Uncontrolled Component를 사용해 보기(실무에서는 Controlled Component를 자주 사용하므로)   
   
# Step 4
- recoil을 이용하여 장바구니 상태관리
- 결제 페이지 작성   
   
# Step 5
- 모노레포 도입(yarn workspace)
- 아폴로 express 서버 환경 설정
- schema 및 resolver 정의