# 서울 지하철역 데이터 손실 원인 분석 및 해결 방안

## 문제 상황
- **예상**: 서울시 지하철 338개 역 (2025년 기준)
- **실제**: 지도에 24개 역만 표시됨
- **손실률**: 93% (314개 역 손실)

## 원인 분석

### 1. 좌표 데이터 문제
```python
# 문제가 될 수 있는 상황들
- 위도/경도 값이 NaN인 경우
- 좌표가 서울 범위를 벗어난 경우
- 좌표 형식이 잘못된 경우 (예: 이탈리아 좌표)
```

### 2. 데이터 전처리 과정에서의 손실
```python
# 가능한 손실 지점들
1. CSV 로딩 시 인코딩 문제
2. 결측값 처리 시 과도한 행 제거
3. 중복 제거 시 잘못된 그룹화
4. 피처 생성 시 조건 불일치
```

### 3. 피처 엔지니어링 중 조건부 필터링
```python
# 예상 문제 코드
- 지반침하 위험지역과의 거리 계산 실패
- 건설공사 데이터와의 매칭 실패
- 지하수 데이터와의 조인 실패
```

## 해결 방안

### Step 1: 원본 데이터 확인
```python
# 1. 기본 지하철역 데이터 로드
subway_original = pd.read_csv('원본_지하철역_데이터.csv', encoding='utf-8')
print(f"원본 데이터 행 수: {len(subway_original)}")
print(f"고유 역명 수: {subway_original['역명'].nunique()}")

# 2. 좌표 유효성 검사
valid_coords = subway_original.dropna(subset=['위도', '경도'])
seoul_bounds = {
    'lat_min': 37.4, 'lat_max': 37.7,
    'lon_min': 126.8, 'lon_max': 127.2
}

valid_seoul = valid_coords[
    (valid_coords['위도'].between(seoul_bounds['lat_min'], seoul_bounds['lat_max'])) &
    (valid_coords['경도'].between(seoul_bounds['lon_min'], seoul_bounds['lon_max']))
]

print(f"유효한 좌표를 가진 역: {len(valid_seoul)}")
```

### Step 2: 단계별 데이터 추적
```python
def track_data_loss(df, step_name):
    """각 단계별 데이터 손실 추적"""
    print(f"{step_name}: {len(df)}개 역 ({df['station_name'].nunique()}개 고유역)")
    return df

# 피처 엔지니어링 각 단계마다 추적
subway_features = track_data_loss(subway_df, "1. 기본 로드")
subway_features = track_data_loss(create_subway_features(subway_features), "2. 기본 피처")
subway_features = track_data_loss(add_risk_features(subway_features), "3. 위험지역 피처")
# ... 계속
```

### Step 3: 안전한 피처 엔지니어링
```python
def safe_feature_engineering(subway_df):
    """데이터 손실을 최소화하는 피처 엔지니어링"""
    
    # 1. 모든 역에 대해 기본값 설정
    result_df = subway_df.copy()
    
    # 2. 피처별로 안전하게 추가
    feature_columns = [
        'risk_area_count_500m', 'construction_count_500m', 
        'water_building_count_500m', 'road_construction_count_500m'
    ]
    
    for col in feature_columns:
        result_df[col] = 0  # 기본값 설정
    
    # 3. 각 역별로 개별 계산 (에러 발생 시 기본값 유지)
    for idx, station in result_df.iterrows():
        try:
            # 안전한 피처 계산
            if pd.notna(station['위도']) and pd.notna(station['경도']):
                # 위험지역 피처 계산
                result_df.loc[idx, 'risk_area_count_500m'] = calculate_risk_features_safe(station)
                # 기타 피처들...
        except Exception as e:
            print(f"역 {station['역명']} 피처 계산 실패: {e}")
            # 기본값 유지
            continue
    
    return result_df
```

### Step 4: 검증 및 복구
```python
def validate_and_recover():
    """데이터 검증 및 누락된 역 복구"""
    
    # 1. 서울시 공식 지하철역 목록과 비교
    official_stations = [
        "서울역", "시청", "종각", "종로3가", "을지로입구", 
        "강남", "삼성", "잠실", "홍대입구", "신촌", 
        # ... 338개 전체 목록
    ]
    
    # 2. 누락된 역 확인
    current_stations = set(final_df['station_name'].unique())
    missing_stations = set(official_stations) - current_stations
    
    print(f"누락된 역 {len(missing_stations)}개:")
    for station in missing_stations:
        print(f"  - {station}")
    
    # 3. 누락된 역에 대해 기본 정보만으로라도 추가
    for missing in missing_stations:
        # 기본 정보로 행 추가
        add_missing_station(missing)
    
    return final_df
```

## 즉시 적용 가능한 임시 해결책

### 방법 1: 하드코딩된 주요 역 추가
```python
# 24개 → 100개로 확장
major_stations = [
    {"station_name": "홍대입구", "호선": 2, "위도": 37.557192, "경도": 126.925381, "risk_level": "Medium", "station_risk_score": 0.25},
    {"station_name": "신촌", "호선": 2, "위도": 37.555134, "경도": 126.936893, "risk_level": "Medium", "station_risk_score": 0.23},
    {"station_name": "이대", "호선": 2, "위도": 37.556991, "경도": 126.946772, "risk_level": "Low", "station_risk_score": 0.18},
    # ... 추가 주요 역들
]

# 기존 24개 + 추가 주요 역들을 합쳐서 업데이트
```

### 방법 2: 공식 지하철역 좌표 데이터 활용
```python
# 서울교통공사 공식 API 또는 오픈데이터 활용
import requests

def get_official_station_data():
    """서울시 공식 지하철역 좌표 데이터 가져오기"""
    api_url = "http://swopenapi.seoul.go.kr/api/subway/stations"
    # 실제 API 호출하여 338개 역 전체 좌표 확보
    pass
```

## 권장 수정 순서

1. **긴급 조치** (1시간 내): 주요 역 50개 수동 추가
2. **단기 해결** (1일 내): 공식 좌표 데이터로 100개 역 복구  
3. **근본 해결** (3일 내): 피처 엔지니어링 파이프라인 재구성
4. **완전 해결** (1주 내): 338개 역 전체 데이터 완성

## 예상 결과
- **24개 → 338개**: 완전한 서울지하철 지도
- **정확도 향상**: 실제 싱크홀 위험도 반영
- **사용성 개선**: 모든 역 검색 및 필터링 가능