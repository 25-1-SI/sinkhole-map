#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CSV 데이터를 JavaScript 배열로 변환하는 스크립트
"""

import csv
import json

def convert_csv_to_js():
    """CSV 데이터를 JavaScript 배열 형태로 변환"""
    
    # JavaScript 배열로 변환할 데이터 구조
    stations_data = []
    
    # CSV 파일 읽기
    with open('subway_sinkhole_features.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            try:
                station = {
                    "station_name": row['station_name'],
                    "line": int(row['호선']),
                    "lat": float(row['위도']),
                    "lng": float(row['경도']),
                    "risk_level": row['risk_level'],
                    "risk_score": float(row['station_risk_score'])
                }
                stations_data.append(station)
            except (ValueError, KeyError) as e:
                print(f"오류 발생: {row.get('station_name', 'Unknown')} - {e}")
                continue
    
    print(f"총 {len(stations_data)}개 역 데이터를 처리했습니다.")
    
    # JavaScript 배열 문자열 생성
    js_content = "const seoul338Stations = [\n"
    
    # 호선별로 그룹화
    line_groups = {}
    for station in stations_data:
        line = station['line']
        if line not in line_groups:
            line_groups[line] = []
        line_groups[line].append(station)
    
    # 호선별로 정렬하여 출력
    for line_num in sorted(line_groups.keys()):
        stations = line_groups[line_num]
        js_content += f"    // {line_num}호선 ({len(stations)}개)\n"
        
        for station in stations:
            js_content += f'    {{"station_name": "{station["station_name"]}", '
            js_content += f'"line": {station["line"]}, '
            js_content += f'"lat": {station["lat"]}, '
            js_content += f'"lng": {station["lng"]}, '
            js_content += f'"risk_level": "{station["risk_level"]}", '
            js_content += f'"risk_score": {station["risk_score"]}}},\n'
        
        js_content += "\n"
    
    # 마지막 콤마 제거
    js_content = js_content.rstrip(',\n') + '\n'
    js_content += "];\n"
    
    # 파일로 저장
    with open('stations_data_js.txt', 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print("JavaScript 배열이 'stations_data_js.txt' 파일로 저장되었습니다.")
    
    # 통계 출력
    print("\n=== 데이터 통계 ===")
    print(f"총 역 수: {len(stations_data)}")
    
    # 호선별 통계
    for line_num in sorted(line_groups.keys()):
        print(f"{line_num}호선: {len(line_groups[line_num])}개 역")
    
    # 위험도별 통계
    risk_counts = {}
    for station in stations_data:
        risk = station['risk_level']
        risk_counts[risk] = risk_counts.get(risk, 0) + 1
    
    print("\n위험도별 통계:")
    for risk_level in ['Low', 'Medium', 'High', 'Very High']:
        count = risk_counts.get(risk_level, 0)
        print(f"{risk_level}: {count}개 역")
    
    # 위험 점수 통계
    risk_scores = [s['risk_score'] for s in stations_data]
    print(f"\n위험 점수 범위: {min(risk_scores):.3f} ~ {max(risk_scores):.3f}")
    print(f"평균 위험 점수: {sum(risk_scores)/len(risk_scores):.3f}")
    
    return stations_data

if __name__ == "__main__":
    convert_csv_to_js()
