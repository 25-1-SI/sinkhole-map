# 🕳️ [싱크홀 고위험 지역 예측 프로젝트](https://25-1-si.github.io/sinkhole-map/)

## 📌 프로젝트 개요

최근 국내에서 싱크홀 발생 빈도가 증가하며 시민들의 불안감이 커지고 있습니다. 이에 따라 본 프로젝트는 지반침하 관련 데이터를 수집·분석하여 고위험 지역을 사전에 예측함으로써, 사고 예방 및 도시 안전 관리 향상에 기여하고자 합니다.

---

## 🎯 분석 목표
1. 시간별·지역별 싱크홀 발생 패턴 분석
2. 지하환경, 인프라, 공사 현황 등 주요 원인 변수와의 상관관계 분석
3. 머신러닝 기반 고위험 지역 예측 모델 구축
4. 정책적 시사점 도출 및 안전관리 전략 제안

---

## 🔍 분석 내용

1. 시간적 패턴 분석
    - 연도, 계절, 월, 요일(주중/주말)에 따른 싱크홀 발생 분포 분석
    - 기후 변수(강수량, 기온 등)와의 상관성 분석 → 기후 변화의 영향 평가

2. 공간적 위험도 분석
    - 행정구역별(시/구/동) 싱크홀 분포 시각화 및 클러스터링
    - 공간 통계 분석: Moran’s I 등 공간 자기상관도 지표 활용

3. 지하환경 및 인프라 요인 분석
    - 지하수위, 지질, 암반 분포 등의 지질·수문학적 변수와의 상관 분석
    - 노후 인프라(상하수도관, 공동구 등) 밀도 및 노후도와의 연관성 평가

4. 공사 및 개발 활동 영향 분석
    - 대형 공사(지하철, 재개발 등)와 싱크홀 발생 간의 연계성 탐색
    - 공사 규모, 기간, 깊이 등을 고려한 영향력 가중치 모델링

5. 복합 위험도 예측 모델 개발
    - 머신러닝 기반 회귀·분류·클러스터링 모델을 활용한 고위험 지역 예측
    - Feature Importance 분석을 통해 주요 위험 요인 도출

6. 정책 제안
    - 예측 결과 기반 우선 점검 대상 지역 제시
    - 지하 공간 관리 정책, 노후 인프라 정비 전략, 예방 시스템 개선안 제안

---

## 🧠 기대 효과
- 싱크홀 발생 주요 요인 및 복합 관계에 대한 과학적 규명
- 예측 모델을 통한 사전 대응 기반 마련 및 자원 효율적 배분
- 시민 대상 정보 공개 및 정책 개선을 통한 사회적 불안 완화
- 데이터 기반 도시 안전 관리 체계 구축 기여

---

## 🗂️ 프로젝트 진행 단계
1. 도메인 이해 및 원인 분석
2. 데이터 수집 및 전처리
3. 탐색적 데이터 분석(EDA) 및 피처 엔지니어링
4. 예측 모델 개발 및 튜닝
5. 모델 성능 평가
6. 시각화 및 결과 발표 자료 제작

---

## 📂 사용 데이터
- [지반침하 위치도 - 환경 빅데이터 플랫폼](https://www.bigdata-environment.kr/user/data_market/detail.do?id=f644daf0-314a-11ea-adf5-336b13359c97#)
- [국토교통부 지하안전정보 - 공공데이터포털](https://www.data.go.kr/data/15041891/openapi.do)
- [지반침하 정보 현황 - 국토교통부 데이터 통합 채널](https://data.molit.go.kr/data-set/search/detail/11857315)
- [서울시 건설 알림이 정보 - 서울 열린데이터 광장](https://data.seoul.go.kr/dataList/OA-1222/S/1/datasetView.do)
- [서울시 도로굴착 공사 현황 - 서울 열린데이터 광장](https://data.seoul.go.kr/dataList/OA-1239/S/1/datasetView.do)
- [서울시 공사현장 유출지하수 공간정보 - 서울 열린데이터 광장](https://data.seoul.go.kr/dataList/OA-21109/S/1/datasetView.do)
- [서울시 건축물 유출지하수 현황](https://data.seoul.go.kr/dataList/OA-15607/S/1/datasetView.do)
- [전국지반침하정보표준데이터 - 공공데이터포털](https://www.data.go.kr/data/15025448/standard.do#tab_layer_detail_function)
- [서울 싱크홀 고위험지역 50곳 - MBC](https://image.imnews.imbc.com/pdf/society/2025/04/20250408_1.pdf)
- ['유출 지하수'를 아시나요? - ASEZ WAO](https://asezwao.org/talk/%EC%9C%A0%EC%B6%9C-%EC%A7%80%ED%95%98%EC%88%98%EB%A5%BC-%EC%95%84%EC%8B%9C%EB%82%98%EC%9A%94/)
- [서울특별시 유출지하수 활용 가이드라인](https://news.seoul.go.kr/env/archives/513144)
- [서울시 실폭하천 위치도 - 서울특별시 빅데이터 캠퍼스](https://bigdata.seoul.go.kr/data/selectSampleData.do?sample_data_seq=162)
- [상수도 공사 뉴스1 - 투데이신문](https://www.ntoday.co.kr/news/articleView.html?idxno=110006)
- [상수도 공사 뉴스2 - 매일건설신문](https://www.mcnews.co.kr/77965)
- [상수도 실시간 도시 현황 - 스마트 서율뷰](https://scpm.seoul.go.kr/now/water?clean=)
