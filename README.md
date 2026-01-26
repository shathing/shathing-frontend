# Frontend Template

## 설명

아래 목록을 적용한 Next.js 프론트엔드 템플릿 입니다.

- shadcn/ui 를 사용한 디자인 시스템
- Pretendard 폰트
- light, dark, system 테마
- 다국어(prefix 라우팅)

## 주의 사항

### 새 페이지 개발 시

- `sitemap.ts` 파일의 `sitemap()` 함수에 해당 페이지 경로를 명시한다.
- sitemap 페이지에도 해당 페이지를 올려준다.
- 크롤링을 막아야 하는 페이지라면 robots.txt 에 작성해준다.
