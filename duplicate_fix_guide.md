# 지하철역 데이터 중복 제거 가이드

## 중복 발생 원인 분석

CSV 파일에서 같은 역이 여러 번 나타나는 이유:

1. **공간 조인(Spatial Join) 시 one-to-many 관계**
   - 하나의 지하철역 주변에 여러 개의 위험지역이 있을 때
   - 각 위험지역마다 별도의 행이 생성됨

2. **데이터 merge 과정에서의 중복**
   - 여러 데이터셋을 조인할 때 키 값이 중복되어 cartesian product 발생
   - 지하수 데이터, 건설공사 데이터 등을 개별적으로 조인할 때 중복 증가

3. **반복적인 데이터 추가**
   - 피처 생성 과정에서 같은 역에 대해 여러 번 계산이 수행됨

## 해결 방안

### 방법 1: 최종 단계에서 중복 제거 (권장)

```python
# 기존 피처 엔지니어링 코드 실행 후 마지막에 추가
def remove_duplicates_and_aggregate(df):
    """
    중복된 역 데이터를 제거하고 수치형 피처는 평균값으로 집계
    """
    
    # 1. 기본 정보 컬럼 (중복 제거 시 첫 번째 값 유지)
    basic_cols = ['연번', '호선', 'station_name', '층수', '형식', '지반고', 
                  '레일면고', '선로기준정거장깊이', '정거장깊이', '비고', '위도', '경도']
    
    # 2. 피처 컬럼 (수치형은 평균, 카테고리는 최대값)
    feature_cols = [col for col in df.columns if col not in basic_cols]
    
    # 3. 역명별로 그룹화하여 집계
    aggregation_dict = {}
    
    # 기본 정보는 첫 번째 값 유지
    for col in basic_cols:
        if col in df.columns:
            aggregation_dict[col] = 'first'
    
    # 피처는 적절한 집계 함수 적용
    for col in feature_cols:
        if df[col].dtype in ['int64', 'float64']:
            # 수치형 데이터는 평균값 사용
            aggregation_dict[col] = 'mean'
        else:
            # 카테고리 데이터는 최빈값 사용
            aggregation_dict[col] = lambda x: x.mode().iloc[0] if len(x.mode()) > 0 else x.iloc[0]
    
    # 4. 그룹화 및 집계 실행
    result_df = df.groupby('station_name').agg(aggregation_dict).reset_index(drop=True)
    
    return result_df

# 사용 예시
features_cleaned = remove_duplicates_and_aggregate(features)
features_cleaned.to_csv('feature_engineering_cleaned.csv', index=False, encoding='utf-8')
```

### 방법 2: 각 단계별로 중복 방지

```python
# 1. 지반침하 위험지역 피처 생성 시 집계 적용
def create_risk_area_features_no_duplicate(subway_df, risk_df):
    """중복 없는 지반침하 위험지역 피처 생성"""
    
    features = []
    
    for _, station in subway_df.iterrows():
        station_coords = (station['위도'], station['경도'])
        
        # 거리 계산 후 바로 집계
        distances = []
        for _, risk_area in risk_df.iterrows():
            if pd.notna(risk_area['lat1']) and pd.notna(risk_area['lon1']):
                risk_coords = (risk_area['lat1'], risk_area['lon1'])
                distance = geodesic(station_coords, risk_coords).meters
                distances.append(distance)
        
        # 바로 집계하여 하나의 결과만 생성
        if distances:
            risk_500m = sum(1 for d in distances if d <= 500)
            risk_1km = sum(1 for d in distances if d <= 1000)
            nearest_distance = min(distances)
            weighted_score = sum(1000/d for d in distances if d <= 500 and d > 0)
        else:
            risk_500m = risk_1km = 0
            nearest_distance = float('inf')
            weighted_score = 0
        
        # 하나의 행만 추가
        features.append({
            'station_name': station['역명'],
            'risk_area_count_500m': risk_500m,
            'risk_area_count_1km': risk_1km,
            'nearest_risk_distance': nearest_distance,
            'risk_weighted_score_500m': weighted_score
        })
    
    return pd.DataFrame(features)

# 2. 건설공사 피처도 동일하게 집계 적용
def create_construction_features_no_duplicate(subway_df, construction_df):
    """중복 없는 건설공사 피처 생성"""
    
    features = []
    
    for _, station in subway_df.iterrows():
        station_coords = (station['위도'], station['경도'])
        
        # 주변 건설공사 데이터 수집 및 집계
        nearby_construction = []
        for _, const in construction_df.iterrows():
            if pd.notna(const['위치좌표(위도)']) and pd.notna(const['위치좌표(경도)']):
                const_coords = (const['위치좌표(위도)'], const['위치좌표(경도)'])
                distance = geodesic(station_coords, const_coords).meters
                
                if distance <= 500:
                    nearby_construction.append({
                        'distance': distance,
                        'amount': const['사업금액(억원)'] if pd.notna(const['사업금액(억원)']) else 0,
                        'is_ongoing': not const['프로젝트 종료여부'],
                        'is_subway_related': '지하철' in str(const['프로젝트 명']),
                        'is_large': const['사업금액(억원)'] > 100 if pd.notna(const['사업금액(억원)']) else False
                    })
        
        # 집계된 피처 계산 (하나의 값만 생성)
        total_construction = len(nearby_construction)
        ongoing_construction = sum(1 for c in nearby_construction if c['is_ongoing'])
        total_amount = sum(c['amount'] for c in nearby_construction)
        avg_amount = total_amount / len(nearby_construction) if nearby_construction else 0
        subway_related = sum(1 for c in nearby_construction if c['is_subway_related'])
        large_construction = sum(1 for c in nearby_construction if c['is_large'])
        
        # 하나의 행만 추가
        features.append({
            'station_name': station['역명'],
            'construction_count_500m': total_construction,
            'ongoing_construction_500m': ongoing_construction,
            'total_construction_amount_500m': total_amount,
            'avg_construction_amount_500m': avg_amount,
            'subway_related_construction_500m': subway_related,
            'large_construction_500m': large_construction,
            'construction_density_500m': total_construction / (np.pi * 0.5**2)
        })
    
    return pd.DataFrame(features)
```

### 방법 3: 메인 파이프라인 수정

```python
def main_feature_engineering_no_duplicate():
    """중복 없는 피처 엔지니어링 파이프라인"""
    
    # 1. 기본 데이터 로드
    subway_df = load_subway_data()
    
    # 2. 기본 피처 생성 (역별로 하나씩만)
    subway_features = create_subway_features(subway_df)
    
    # 3. 각 카테고리별 피처 생성 (집계된 형태로)
    risk_features = create_risk_area_features_no_duplicate(subway_features, risk_df)
    construction_features = create_construction_features_no_duplicate(subway_features, construction_df)
    water_features = create_water_features_no_duplicate(subway_features, water_df)
    road_features = create_road_construction_features_no_duplicate(subway_features, road_df)
    
    # 4. 모든 피처 통합 (left join으로 중복 방지)
    final_features = subway_features.copy()
    final_features = final_features.merge(risk_features, on='station_name', how='left')
    final_features = final_features.merge(construction_features, on='station_name', how='left')
    final_features = final_features.merge(water_features, on='station_name', how='left')
    final_features = final_features.merge(road_features, on='station_name', how='left')
    
    # 5. 결측값 처리
    numeric_columns = final_features.select_dtypes(include=[np.number]).columns
    final_features[numeric_columns] = final_features[numeric_columns].fillna(0)
    
    # 6. 복합 피처 생성
    final_features = create_composite_risk_features(final_features)
    
    # 7. 최종 중복 확인 및 제거
    print(f"최종 데이터 크기: {final_features.shape}")
    print(f"고유 역 수: {final_features['station_name'].nunique()}")
    
    if final_features.shape[0] != final_features['station_name'].nunique():
        print("중복이 발견되어 제거합니다.")
        final_features = remove_duplicates_and_aggregate(final_features)
    
    # 8. 결과 저장
    final_features.to_csv('subway_sinkhole_features_no_duplicate.csv', index=False, encoding='utf-8')
    
    return final_features
```

## 권장 수정 사항

현재 코드에서 **가장 간단한 해결책**은 마지막에 중복 제거 코드를 추가하는 것입니다:

```python
# 기존 feature engineering 코드 마지막에 추가
features_final = features.groupby('station_name').agg({
    # 기본 정보는 첫 번째 값 유지
    '연번': 'first',
    '호선': 'first', 
    '층수': 'first',
    '형식': 'first',
    '지반고': 'first',
    '레일면고': 'first',
    '위도': 'first',
    '경도': 'first',
    '비고': 'first',
    
    # 수치형 피처는 평균값 사용
    'station_depth': 'mean',
    'underground_floors': 'first',
    'risk_area_count_500m': 'mean',
    'risk_area_count_1km': 'mean',
    'construction_count_500m': 'mean',
    'total_water_output_500m': 'mean',
    # ... 다른 수치형 피처들도 동일하게
    
    # 카테고리 피처는 최빈값 또는 첫 번째 값
    'is_island_platform': 'first',
    'is_side_platform': 'first',
    'is_transfer_station': 'first',
    'line_1to4': 'first',
    'line_5to8': 'first'
}).reset_index()

features_final.to_csv('feature_engineering_final.csv', index=False, encoding='utf-8')
```

이렇게 하면 각 역별로 하나의 행만 남게 됩니다.