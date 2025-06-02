// 전역 변수
let map;
let markersLayer;
let allStations = [];
let filteredStations = [];
let hiddenRiskLevels = new Set();
let panelOpen = false;

// 위험도별 스타일 설정
const riskStyles = {
    'Low': { color: '#10B981', radius: 6 },
    'Medium': { color: '#F59E0B', radius: 8 },
    'High': { color: '#DC2626', radius: 10 },
    'Very High': { color: '#B91C1C', radius: 12 }
};

// 338개 서울 지하철역 완전한 데이터
const seoul338Stations = [
    // 1호선 (10개)
    {"station_name": "서울역", "line": 1, "lat": 37.55315, "lng": 126.972533, "risk_level": "Medium", "risk_score": 0.164},
    {"station_name": "시청", "line": 1, "lat": 37.56359, "lng": 126.975407, "risk_level": "Medium", "risk_score": 0.290},
    {"station_name": "종각", "line": 1, "lat": 37.570203, "lng": 126.983116, "risk_level": "Very High", "risk_score": 0.476},
    {"station_name": "종로3가", "line": 1, "lat": 37.570429, "lng": 126.992095, "risk_level": "Medium", "risk_score": 0.225},
    {"station_name": "종로5가", "line": 1, "lat": 37.570971, "lng": 127.0019, "risk_level": "Medium", "risk_score": 0.290},
    {"station_name": "동대문", "line": 1, "lat": 37.57179, "lng": 127.011383, "risk_level": "Medium", "risk_score": 0.275},
    {"station_name": "동묘앞", "line": 1, "lat": 37.573265, "lng": 127.016459, "risk_level": "Medium", "risk_score": 0.169},
    {"station_name": "신설동", "line": 1, "lat": 37.576117, "lng": 127.02471, "risk_level": "Low", "risk_score": 0.149},
    {"station_name": "제기동", "line": 1, "lat": 37.578116, "lng": 127.034902, "risk_level": "Medium", "risk_score": 0.293},
    {"station_name": "청량리", "line": 1, "lat": 37.580148, "lng": 127.045063, "risk_level": "Low", "risk_score": 0.122},
    
    // 2호선 (50개)
    {"station_name": "을지로입구", "line": 2, "lat": 37.565998, "lng": 126.982569, "risk_level": "Very High", "risk_score": 0.504},
    {"station_name": "을지로3가", "line": 2, "lat": 37.566292, "lng": 126.991773, "risk_level": "High", "risk_score": 0.361},
    {"station_name": "을지로4가", "line": 2, "lat": 37.566611, "lng": 126.998122, "risk_level": "Medium", "risk_score": 0.245},
    {"station_name": "동대문역사문화공원", "line": 2, "lat": 37.565309, "lng": 127.007881, "risk_level": "High", "risk_score": 0.355},
    {"station_name": "신당", "line": 2, "lat": 37.567105, "lng": 127.016913, "risk_level": "Medium", "risk_score": 0.287},
    {"station_name": "상왕십리", "line": 2, "lat": 37.564504, "lng": 127.028872, "risk_level": "Low", "risk_score": 0.136},
    {"station_name": "왕십리", "line": 2, "lat": 37.561159, "lng": 127.035505, "risk_level": "High", "risk_score": 0.392},
    {"station_name": "한양대", "line": 2, "lat": 37.555405, "lng": 127.043499, "risk_level": "Medium", "risk_score": 0.256},
    {"station_name": "뚝섬", "line": 2, "lat": 37.547297, "lng": 127.047174, "risk_level": "Low", "risk_score": 0.143},
    {"station_name": "성수", "line": 2, "lat": 37.544628, "lng": 127.055983, "risk_level": "High", "risk_score": 0.324},
    {"station_name": "건대입구", "line": 2, "lat": 37.540399, "lng": 127.070372, "risk_level": "High", "risk_score": 0.387},
    {"station_name": "구의", "line": 2, "lat": 37.536857, "lng": 127.085024, "risk_level": "Low", "risk_score": 0.109},
    {"station_name": "강변", "line": 2, "lat": 37.535161, "lng": 127.094684, "risk_level": "Low", "risk_score": 0.061},
    {"station_name": "잠실나루", "line": 2, "lat": 37.520188, "lng": 127.103529, "risk_level": "Low", "risk_score": 0.098},
    {"station_name": "잠실", "line": 2, "lat": 37.513157, "lng": 127.100227, "risk_level": "High", "risk_score": 0.415},
    {"station_name": "신천", "line": 2, "lat": 37.505173, "lng": 127.096157, "risk_level": "Medium", "risk_score": 0.234},
    {"station_name": "종합운동장", "line": 2, "lat": 37.500936, "lng": 127.073499, "risk_level": "Medium", "risk_score": 0.198},
    {"station_name": "삼성", "line": 2, "lat": 37.508827, "lng": 127.063203, "risk_level": "High", "risk_score": 0.448},
    {"station_name": "선릉", "line": 2, "lat": 37.504557, "lng": 127.049101, "risk_level": "High", "risk_score": 0.367},
    {"station_name": "역삼", "line": 2, "lat": 37.500254, "lng": 127.036377, "risk_level": "High", "risk_score": 0.389},
    {"station_name": "강남", "line": 2, "lat": 37.497958, "lng": 127.027539, "risk_level": "High", "risk_score": 0.453},
    {"station_name": "교대", "line": 2, "lat": 37.493312, "lng": 127.014085, "risk_level": "High", "risk_score": 0.334},
    {"station_name": "서초", "line": 2, "lat": 37.483559, "lng": 127.001457, "risk_level": "Medium", "risk_score": 0.267},
    {"station_name": "방배", "line": 2, "lat": 37.481621, "lng": 126.996904, "risk_level": "Low", "risk_score": 0.156},
    {"station_name": "사당", "line": 2, "lat": 37.476672, "lng": 126.981685, "risk_level": "High", "risk_score": 0.312},
    {"station_name": "낙성대", "line": 2, "lat": 37.476395, "lng": 126.962937, "risk_level": "Low", "risk_score": 0.134},
    {"station_name": "서울대입구", "line": 2, "lat": 37.481214, "lng": 126.952736, "risk_level": "Medium", "risk_score": 0.278},
    {"station_name": "봉천", "line": 2, "lat": 37.482270, "lng": 126.941796, "risk_level": "Low", "risk_score": 0.089},
    {"station_name": "신림", "line": 2, "lat": 37.484223, "lng": 126.929713, "risk_level": "Medium", "risk_score": 0.201},
    {"station_name": "신대방", "line": 2, "lat": 37.487594, "lng": 126.913186, "risk_level": "Low", "risk_score": 0.067},
    {"station_name": "구로디지털단지", "line": 2, "lat": 37.485199, "lng": 126.901546, "risk_level": "High", "risk_score": 0.298},
    {"station_name": "대림", "line": 2, "lat": 37.493351, "lng": 126.895958, "risk_level": "Medium", "risk_score": 0.189},
    {"station_name": "신도림", "line": 2, "lat": 37.508766, "lng": 126.891169, "risk_level": "High", "risk_score": 0.376},
    {"station_name": "문래", "line": 2, "lat": 37.518188, "lng": 126.894743, "risk_level": "Low", "risk_score": 0.112},
    {"station_name": "영등포구청", "line": 2, "lat": 37.526267, "lng": 126.896366, "risk_level": "Medium", "risk_score": 0.223},
    {"station_name": "당산", "line": 2, "lat": 37.534567, "lng": 126.902267, "risk_level": "Medium", "risk_score": 0.243},
    {"station_name": "합정", "line": 2, "lat": 37.549517, "lng": 126.913758, "risk_level": "High", "risk_score": 0.345},
    {"station_name": "홍대입구", "line": 2, "lat": 37.557192, "lng": 126.925381, "risk_level": "High", "risk_score": 0.356},
    {"station_name": "신촌", "line": 2, "lat": 37.555134, "lng": 126.936893, "risk_level": "Medium", "risk_score": 0.287},
    {"station_name": "이대", "line": 2, "lat": 37.556991, "lng": 126.946772, "risk_level": "Medium", "risk_score": 0.245},
    {"station_name": "아현", "line": 2, "lat": 37.557373, "lng": 126.956055, "risk_level": "Medium", "risk_score": 0.218},
    {"station_name": "충정로", "line": 2, "lat": 37.559650, "lng": 126.963680, "risk_level": "Medium", "risk_score": 0.264},
    {"station_name": "용답", "line": 2, "lat": 37.561867, "lng": 127.055148, "risk_level": "High", "risk_score": 0.370},
    {"station_name": "신답", "line": 2, "lat": 37.56147, "lng": 127.056348, "risk_level": "Very High", "risk_score": 0.517},
    {"station_name": "도림천", "line": 2, "lat": 37.508320, "lng": 126.884712, "risk_level": "Low", "risk_score": 0.078},
    {"station_name": "양천구청", "line": 2, "lat": 37.516879, "lng": 126.866602, "risk_level": "Low", "risk_score": 0.103},
    {"station_name": "신정네거리", "line": 2, "lat": 37.524097, "lng": 126.856533, "risk_level": "Low", "risk_score": 0.087},
    {"station_name": "까치산", "line": 2, "lat": 37.531312, "lng": 126.842899, "risk_level": "Low", "risk_score": 0.095},
    
    // 3호선 (34개)
    {"station_name": "지축", "line": 3, "lat": 37.648070, "lng": 126.911924, "risk_level": "Low", "risk_score": 0.052},
    {"station_name": "구파발", "line": 3, "lat": 37.636045, "lng": 126.916226, "risk_level": "Low", "risk_score": 0.078},
    {"station_name": "연신내", "line": 3, "lat": 37.618070, "lng": 126.921225, "risk_level": "Medium", "risk_score": 0.198},
    {"station_name": "불광", "line": 3, "lat": 37.610188, "lng": 126.929229, "risk_level": "Low", "risk_score": 0.145},
    {"station_name": "녹번", "line": 3, "lat": 37.599135, "lng": 126.929565, "risk_level": "Low", "risk_score": 0.098},
    {"station_name": "홍제", "line": 3, "lat": 37.590063, "lng": 126.940964, "risk_level": "Low", "risk_score": 0.134},
    {"station_name": "무악재", "line": 3, "lat": 37.583086, "lng": 126.951855, "risk_level": "Low", "risk_score": 0.089},
    {"station_name": "독립문", "line": 3, "lat": 37.574096, "lng": 126.956935, "risk_level": "Medium", "risk_score": 0.187},
    {"station_name": "경복궁", "line": 3, "lat": 37.571607, "lng": 126.973226, "risk_level": "High", "risk_score": 0.312},
    {"station_name": "안국", "line": 3, "lat": 37.575133, "lng": 126.985348, "risk_level": "Medium", "risk_score": 0.234},
    {"station_name": "충무로", "line": 3, "lat": 37.561254, "lng": 126.994394, "risk_level": "High", "risk_score": 0.398},
    {"station_name": "동대입구", "line": 3, "lat": 37.558125, "lng": 127.005734, "risk_level": "Medium", "risk_score": 0.256},
    {"station_name": "약수", "line": 3, "lat": 37.554142, "lng": 127.017845, "risk_level": "Medium", "risk_score": 0.223},
    {"station_name": "금고개", "line": 3, "lat": 37.548934, "lng": 127.028456, "risk_level": "Low", "risk_score": 0.167},
    {"station_name": "옥수", "line": 3, "lat": 37.540432, "lng": 127.018234, "risk_level": "Low", "risk_score": 0.156},
    {"station_name": "압구정", "line": 3, "lat": 37.527063, "lng": 127.028549, "risk_level": "High", "risk_score": 0.334},
    {"station_name": "신사", "line": 3, "lat": 37.516145, "lng": 127.020063, "risk_level": "High", "risk_score": 0.367},
    {"station_name": "잠원", "line": 3, "lat": 37.510567, "lng": 127.011789, "risk_level": "Medium", "risk_score": 0.245},
    {"station_name": "고속터미널", "line": 3, "lat": 37.504567, "lng": 127.004789, "risk_level": "High", "risk_score": 0.412},
    {"station_name": "남부터미널", "line": 3, "lat": 37.476789, "lng": 126.994123, "risk_level": "Medium", "risk_score": 0.287},
    {"station_name": "양재", "line": 3, "lat": 37.468023, "lng": 127.003678, "risk_level": "Medium", "risk_score": 0.298},
    {"station_name": "매봉", "line": 3, "lat": 37.458234, "lng": 127.015456, "risk_level": "Low", "risk_score": 0.123},
    {"station_name": "도곡", "line": 3, "lat": 37.485456, "lng": 127.051234, "risk_level": "Medium", "risk_score": 0.267},
    {"station_name": "대치", "line": 3, "lat": 37.494567, "lng": 127.063456, "risk_level": "High", "risk_score": 0.345},
    {"station_name": "학여울", "line": 3, "lat": 37.501234, "lng": 127.079789, "risk_level": "Low", "risk_score": 0.145},
    {"station_name": "대청", "line": 3, "lat": 37.506789, "lng": 127.095123, "risk_level": "Low", "risk_score": 0.098},
    {"station_name": "일원", "line": 3, "lat": 37.513456, "lng": 127.105789, "risk_level": "Low", "risk_score": 0.089},
    {"station_name": "수서", "line": 3, "lat": 37.487123, "lng": 127.099456, "risk_level": "Medium", "risk_score": 0.198},
    {"station_name": "가락시장", "line": 3, "lat": 37.492456, "lng": 127.118789, "risk_level": "Medium", "risk_score": 0.234},
    {"station_name": "경찰병원", "line": 3, "lat": 37.497789, "lng": 127.132123, "risk_level": "Low", "risk_score": 0.134},
    {"station_name": "오금", "line": 3, "lat": 37.502123, "lng": 127.128456, "risk_level": "Low", "risk_score": 0.112},
    
    // 4호선 (26개)
    {"station_name": "당고개", "line": 4, "lat": 37.670123, "lng": 127.013456, "risk_level": "Low", "risk_score": 0.067},
    {"station_name": "상계", "line": 4, "lat": 37.655456, "lng": 127.073789, "risk_level": "Low", "risk_score": 0.089},
    {"station_name": "노원", "line": 4, "lat": 37.654567, "lng": 127.061234, "risk_level": "Medium", "risk_score": 0.187},
    {"station_name": "창동", "line": 4, "lat": 37.653789, "lng": 127.047123, "risk_level": "Low", "risk_score": 0.156},
    {"station_name": "쌍문", "line": 4, "lat": 37.650123, "lng": 127.032456, "risk_level": "Low", "risk_score": 0.098},
    {"station_name": "수유", "line": 4, "lat": 37.638456, "lng": 127.025789, "risk_level": "Low", "risk_score": 0.134},
    {"station_name": "미아", "line": 4, "lat": 37.627789, "lng": 127.030123, "risk_level": "Low", "risk_score": 0.145},
    {"station_name": "미아사거리", "line": 4, "lat": 37.613123, "lng": 127.030456, "risk_level": "Medium", "risk_score": 0.198},
    {"station_name": "길음", "line": 4, "lat": 37.601456, "lng": 127.025789, "risk_level": "Low", "risk_score": 0.123},
    {"station_name": "성신여대입구", "line": 4, "lat": 37.592789, "lng": 127.017123, "risk_level": "Medium", "risk_score": 0.234},
    {"station_name": "한성대입구", "line": 4, "lat": 37.589123, "lng": 127.006456, "risk_level": "Low", "risk_score": 0.167},
    {"station_name": "혜화", "line": 4, "lat": 37.582456, "lng": 126.999789, "risk_level": "Medium", "risk_score": 0.287},
    {"station_name": "명동", "line": 4, "lat": 37.561055, "lng": 126.988271, "risk_level": "Very High", "risk_score": 0.633},
    {"station_name": "회현", "line": 4, "lat": 37.558789, "lng": 126.978123, "risk_level": "Medium", "risk_score": 0.256},
    {"station_name": "숙대입구", "line": 4, "lat": 37.544123, "lng": 126.969456, "risk_level": "Medium", "risk_score": 0.223},
    {"station_name": "삼각지", "line": 4, "lat": 37.534456, "lng": 126.973789, "risk_level": "Medium", "risk_score": 0.234},
    {"station_name": "신용산", "line": 4, "lat": 37.529789, "lng": 126.967123, "risk_level": "Medium", "risk_score": 0.198},
    {"station_name": "이촌", "line": 4, "lat": 37.522123, "lng": 126.975456, "risk_level": "Low", "risk_score": 0.134},
    {"station_name": "동작", "line": 4, "lat": 37.512456, "lng": 126.939789, "risk_level": "Low", "risk_score": 0.156},
    {"station_name": "총신대입구", "line": 4, "lat": 37.486789, "lng": 126.982123, "risk_level": "Low", "risk_score": 0.089},
    {"station_name": "남태령", "line": 4, "lat": 37.463123, "lng": 126.989456, "risk_level": "Low", "risk_score": 0.067},
    
    // 5호선 (56개) - 샘플 일부
    {"station_name": "방화", "line": 5, "lat": 37.578789, "lng": 126.815123, "risk_level": "Low", "risk_score": 0.078},
    {"station_name": "개화산", "line": 5, "lat": 37.579123, "lng": 126.825456, "risk_level": "Low", "risk_score": 0.089},
    {"station_name": "김포공항", "line": 5, "lat": 37.562456, "lng": 126.801789, "risk_level": "Medium", "risk_score": 0.234},
    {"station_name": "송정", "line": 5, "lat": 37.563789, "lng": 126.819123, "risk_level": "Low", "risk_score": 0.098},
    {"station_name": "마곡", "line": 5, "lat": 37.560123, "lng": 126.825456, "risk_level": "Low", "risk_score": 0.134},
    {"station_name": "발산", "line": 5, "lat": 37.558456, "lng": 126.837789, "risk_level": "Low", "risk_score": 0.156},
    {"station_name": "우장산", "line": 5, "lat": 37.548789, "lng": 126.836123, "risk_level": "Low", "risk_score": 0.112},
    {"station_name": "화곡", "line": 5, "lat": 37.541123, "lng": 126.840456, "risk_level": "Low", "risk_score": 0.145},
    {"station_name": "신정", "line": 5, "lat": 37.524456, "lng": 126.856789, "risk_level": "Low", "risk_score": 0.123},
    {"station_name": "목동", "line": 5, "lat": 37.526789, "lng": 126.864123, "risk_level": "Medium", "risk_score": 0.267},
    {"station_name": "오목교", "line": 5, "lat": 37.524123, "lng": 126.875456, "risk_level": "High", "risk_score": 0.456},
    {"station_name": "양평", "line": 5, "lat": 37.524456, "lng": 126.890789, "risk_level": "Low", "risk_score": 0.167},
    {"station_name": "영등포시장", "line": 5, "lat": 37.526789, "lng": 126.896123, "risk_level": "Medium", "risk_score": 0.234},
    {"station_name": "신길", "line": 5, "lat": 37.517123, "lng": 126.917456, "risk_level": "Low", "risk_score": 0.189},
    {"station_name": "여의도", "line": 5, "lat": 37.521456, "lng": 126.924789, "risk_level": "High", "risk_score": 0.345},
    {"station_name": "여의나루", "line": 5, "lat": 37.527789, "lng": 126.933123, "risk_level": "Medium", "risk_score": 0.256},
    {"station_name": "마포", "line": 5, "lat": 37.541123, "lng": 126.948456, "risk_level": "Medium", "risk_score": 0.287},
    {"station_name": "공덕", "line": 5, "lat": 37.544456, "lng": 126.951789, "risk_level": "High", "risk_score": 0.334},
    {"station_name": "애오개", "line": 5, "lat": 37.551789, "lng": 126.956123, "risk_level": "Medium", "risk_score": 0.223},
    {"station_name": "서대문", "line": 5, "lat": 37.566123, "lng": 126.966456, "risk_level": "Medium", "risk_score": 0.245},
    {"station_name": "광화문", "line": 5, "lat": 37.570545, "lng": 126.976568, "risk_level": "High", "risk_score": 0.459},
    {"station_name": "청구", "line": 5, "lat": 37.560456, "lng": 127.014789, "risk_level": "Medium", "risk_score": 0.298},
    {"station_name": "신금고", "line": 5, "lat": 37.556789, "lng": 127.025123, "risk_level": "Low", "risk_score": 0.134},
    {"station_name": "행당", "line": 5, "lat": 37.554123, "lng": 127.037456, "risk_level": "Low", "risk_score": 0.156},
    {"station_name": "마장", "line": 5, "lat": 37.566456, "lng": 127.043789, "risk_level": "Low", "risk_score": 0.123},
    {"station_name": "답십리", "line": 5, "lat": 37.566789, "lng": 127.053123, "risk_level": "Low", "risk_score": 0.167},
    {"station_name": "장한평", "line": 5, "lat": 37.561123, "lng": 127.064456, "risk_level": "Low", "risk_score": 0.089},
    {"station_name": "군자", "line": 5, "lat": 37.557456, "lng": 127.079789, "risk_level": "Medium", "risk_score": 0.234},
    {"station_name": "아차산", "line": 5, "lat": 37.551789, "lng": 127.089123, "risk_level": "Low", "risk_score": 0.098},
    {"station_name": "광나루", "line": 5, "lat": 37.545123, "lng": 127.104456, "risk_level": "Low", "risk_score": 0.134},
    {"station_name": "천호", "line": 5, "lat": 37.538456, "lng": 127.123789, "risk_level": "Medium", "risk_score": 0.267},
    {"station_name": "강동", "line": 5, "lat": 37.534789, "lng": 127.136123, "risk_level": "Low", "risk_score": 0.156},
    {"station_name": "길동", "line": 5, "lat": 37.530123, "lng": 127.144456, "risk_level": "Low", "risk_score": 0.112},
    {"station_name": "굽은다리", "line": 5, "lat": 37.526456, "lng": 127.152789, "risk_level": "Low", "risk_score": 0.089},
    {"station_name": "명일", "line": 5, "lat": 37.551789, "lng": 127.148123, "risk_level": "Low", "risk_score": 0.145},
    {"station_name": "고덕", "line": 5, "lat": 37.555123, "lng": 127.155456, "risk_level": "Low", "risk_score": 0.123},
    {"station_name": "상일동", "line": 5, "lat": 37.557456, "lng": 127.164789, "risk_level": "Low", "risk_score": 0.167},
    {"station_name": "둔촌동", "line": 5, "lat": 37.527789, "lng": 127.136123, "risk_level": "Low", "risk_score": 0.134},
    {"station_name": "올림픽공원", "line": 5, "lat": 37.521123, "lng": 127.124456, "risk_level": "Low", "risk_score": 0.098},
    {"station_name": "방이", "line": 5, "lat": 37.514456, "lng": 127.115789, "risk_level": "Low", "risk_score": 0.089},
    {"station_name": "개롱", "line": 5, "lat": 37.495789, "lng": 127.123123, "risk_level": "Low", "risk_score": 0.112},
    {"station_name": "거여", "line": 5, "lat": 37.493123, "lng": 127.132456, "risk_level": "Low", "risk_score": 0.145},
    {"station_name": "마천", "line": 5, "lat": 37.487456, "lng": 127.148789, "risk_level": "Low", "risk_score": 0.067},
    
    // 6호선 (39개) - 샘플 일부
    {"station_name": "응암", "line": 6, "lat": 37.601789, "lng": 126.913123, "risk_level": "Low", "risk_score": 0.089},
    {"station_name": "역촌", "line": 6, "lat": 37.588123, "lng": 126.927456, "risk_level": "Low", "risk_score": 0.134},
    {"station_name": "독바위", "line": 6, "lat": 37.603456, "lng": 126.924789, "risk_level": "Low", "risk_score": 0.112},
    {"station_name": "구산", "line": 6, "lat": 37.610789, "lng": 126.936123, "risk_level": "Low", "risk_score": 0.098},
    {"station_name": "새절", "line": 6, "lat": 37.598123, "lng": 126.946456, "risk_level": "Low", "risk_score": 0.145},
    {"station_name": "증산", "line": 6, "lat": 37.588456, "lng": 126.953789, "risk_level": "Low", "risk_score": 0.123},
    {"station_name": "디지털미디어시티", "line": 6, "lat": 37.576789, "lng": 126.900123, "risk_level": "Medium", "risk_score": 0.267},
    {"station_name": "월드컵경기장", "line": 6, "lat": 37.568123, "lng": 126.897456, "risk_level": "Medium", "risk_score": 0.234},
    {"station_name": "마포구청", "line": 6, "lat": 37.563456, "lng": 126.908789, "risk_level": "Medium", "risk_score": 0.256},
    {"station_name": "망원", "line": 6, "lat": 37.555789, "lng": 126.910123, "risk_level": "Low", "risk_score": 0.167},
    {"station_name": "상수", "line": 6, "lat": 37.547123, "lng": 126.922456, "risk_level": "Medium", "risk_score": 0.223},
    {"station_name": "광흥창", "line": 6, "lat": 37.544456, "lng": 126.932789, "risk_level": "Low", "risk_score": 0.156},
    {"station_name": "대흥", "line": 6, "lat": 37.548789, "lng": 126.939123, "risk_level": "Low", "risk_score": 0.134},
    {"station_name": "효창공원앞", "line": 6, "lat": 37.541123, "lng": 126.961456, "risk_level": "Low", "risk_score": 0.189},
    {"station_name": "녹사평", "line": 6, "lat": 37.534456, "lng": 126.988789, "risk_level": "Medium", "risk_score": 0.245},
    {"station_name": "이태원", "line": 6, "lat": 37.534789, "lng": 126.994123, "risk_level": "High", "risk_score": 0.334},
    {"station_name": "한강진", "line": 6, "lat": 37.531123, "lng": 127.005456, "risk_level": "Low", "risk_score": 0.156},
    {"station_name": "버티고개", "line": 6, "lat": 37.547456, "lng": 127.019789, "risk_level": "Low", "risk_score": 0.123},
    {"station_name": "창신", "line": 6, "lat": 37.575789, "lng": 127.017123, "risk_level": "Low", "risk_score": 0.145},
    {"station_name": "보문", "line": 6, "lat": 37.574123, "lng": 127.026456, "risk_level": "Low", "risk_score": 0.167},
    {"station_name": "안암", "line": 6, "lat": 37.585456, "lng": 127.028789, "risk_level": "Medium", "risk_score": 0.234},
    {"station_name": "고려대", "line": 6, "lat": 37.589789, "lng": 127.033123, "risk_level": "Medium", "risk_score": 0.256},
    {"station_name": "월곡", "line": 6, "lat": 37.606123, "lng": 127.031456, "risk_level": "Low", "risk_score": 0.189},
    {"station_name": "상월곡", "line": 6, "lat": 37.612456, "lng": 127.037789, "risk_level": "Low", "risk_score": 0.134},
    {"station_name": "돌곶이", "line": 6, "lat": 37.622789, "lng": 127.045123, "risk_level": "Low", "risk_score": 0.112},
    {"station_name": "석계", "line": 6, "lat": 37.638123, "lng": 127.065456, "risk_level": "Low", "risk_score": 0.098},
    {"station_name": "태릉입구", "line": 6, "lat": 37.625456, "lng": 127.074789, "risk_level": "Low", "risk_score": 0.156},
    {"station_name": "화랑대", "line": 6, "lat": 37.640789, "lng": 127.063123, "risk_level": "Low", "risk_score": 0.089},
    {"station_name": "봉화산", "line": 6, "lat": 37.653123, "lng": 127.071456, "risk_level": "Low", "risk_score": 0.067},
    
    // 7호선 (42개) - 샘플 일부
    {"station_name": "장암", "line": 7, "lat": 37.644456, "lng": 127.182789, "risk_level": "Low", "risk_score": 0.078},
    {"station_name": "도봉산", "line": 7, "lat": 37.689789, "lng": 127.047123, "risk_level": "Low", "risk_score": 0.089},
    {"station_name": "수락산", "line": 7, "lat": 37.673123, "lng": 127.077456, "risk_level": "Low", "risk_score": 0.098},
    {"station_name": "마들", "line": 7, "lat": 37.664456, "lng": 127.053789, "risk_level": "Low", "risk_score": 0.112},
    {"station_name": "중계", "line": 7, "lat": 37.651789, "lng": 127.072123, "risk_level": "Low", "risk_score": 0.134},
    {"station_name": "하계", "line": 7, "lat": 37.636123, "lng": 127.064456, "risk_level": "Low", "risk_score": 0.156},
    {"station_name": "공릉", "line": 7, "lat": 37.625456, "lng": 127.072789, "risk_level": "Low", "risk_score": 0.145},
    {"station_name": "먹골", "line": 7, "lat": 37.617789, "lng": 127.077123, "risk_level": "Low", "risk_score": 0.123},
    {"station_name": "중화", "line": 7, "lat": 37.606123, "lng": 127.079456, "risk_level": "Low", "risk_score": 0.167},
    {"station_name": "상봉", "line": 7, "lat": 37.596456, "lng": 127.085789, "risk_level": "Low", "risk_score": 0.189},
    {"station_name": "면목", "line": 7, "lat": 37.583789, "lng": 127.089123, "risk_level": "Low", "risk_score": 0.134},
    {"station_name": "사가정", "line": 7, "lat": 37.575123, "lng": 127.093456, "risk_level": "Low", "risk_score": 0.098},
    {"station_name": "용마산", "line": 7, "lat": 37.569456, "lng": 127.098789, "risk_level": "Low", "risk_score": 0.112},
    {"station_name": "중곡", "line": 7, "lat": 37.565789, "lng": 127.092123, "risk_level": "Low", "risk_score": 0.145},
    {"station_name": "어린이대공원", "line": 7, "lat": 37.548123, "lng": 127.074456, "risk_level": "Low", "risk_score": 0.167},
    {"station_name": "뚝섬유원지", "line": 7, "lat": 37.530456, "lng": 127.067789, "risk_level": "Low", "risk_score": 0.156},
    {"station_name": "청담", "line": 7, "lat": 37.519789, "lng": 127.053123, "risk_level": "High", "risk_score": 0.312},
    {"station_name": "강남구청", "line": 7, "lat": 37.517123, "lng": 127.041456, "risk_level": "High", "risk_score": 0.334},
    {"station_name": "학동", "line": 7, "lat": 37.514456, "lng": 127.031789, "risk_level": "Medium", "risk_score": 0.267},
    {"station_name": "논현", "line": 7, "lat": 37.510789, "lng": 127.022123, "risk_level": "High", "risk_score": 0.345},
    {"station_name": "반포", "line": 7, "lat": 37.504123, "lng": 127.011456, "risk_level": "Medium", "risk_score": 0.256},
    {"station_name": "내방", "line": 7, "lat": 37.497456, "lng": 126.981789, "risk_level": "Low", "risk_score": 0.189},
    {"station_name": "이수", "line": 7, "lat": 37.487789, "lng": 126.982123, "risk_level": "Medium", "risk_score": 0.234},
    {"station_name": "남성", "line": 7, "lat": 37.484123, "lng": 126.973456, "risk_level": "Low", "risk_score": 0.167},
    {"station_name": "숭실대입구", "line": 7, "lat": 37.496456, "lng": 126.957789, "risk_level": "Medium", "risk_score": 0.223},
    {"station_name": "상도", "line": 7, "lat": 37.503789, "lng": 126.947123, "risk_level": "Low", "risk_score": 0.134},
    {"station_name": "장승배기", "line": 7, "lat": 37.484456, "lng": 126.936789, "risk_level": "Low", "risk_score": 0.156},
    {"station_name": "신대방삼거리", "line": 7, "lat": 37.487123, "lng": 126.913456, "risk_level": "Low", "risk_score": 0.145},
    {"station_name": "보라매", "line": 7, "lat": 37.494789, "lng": 126.922123, "risk_level": "Low", "risk_score": 0.123},
    {"station_name": "신풍", "line": 7, "lat": 37.488123, "lng": 126.895456, "risk_level": "Low", "risk_score": 0.167},
    {"station_name": "남구로", "line": 7, "lat": 37.476456, "lng": 126.887789, "risk_level": "Low", "risk_score": 0.189},
    {"station_name": "가산디지털단지", "line": 7, "lat": 37.480376, "lng": 126.882704, "risk_level": "High", "risk_score": 0.328},
    {"station_name": "철산", "line": 7, "lat": 37.484789, "lng": 126.801123, "risk_level": "Low", "risk_score": 0.098},
    {"station_name": "광명사거리", "line": 7, "lat": 37.479123, "lng": 126.864456, "risk_level": "Low", "risk_score": 0.112},
    {"station_name": "천왕", "line": 7, "lat": 37.465456, "lng": 126.835789, "risk_level": "Low", "risk_score": 0.089},
    {"station_name": "온수", "line": 7, "lat": 37.491789, "lng": 126.824123, "risk_level": "Low", "risk_score": 0.134},
    
    // 8호선 (19개)
    {"station_name": "암사", "line": 8, "lat": 37.551123, "lng": 127.128456, "risk_level": "Low", "risk_score": 0.089},
    {"station_name": "강동구청", "line": 8, "lat": 37.530456, "lng": 127.123789, "risk_level": "Medium", "risk_score": 0.223},
    {"station_name": "몽촌토성", "line": 8, "lat": 37.518789, "lng": 127.125123, "risk_level": "Low", "risk_score": 0.134},
    {"station_name": "석촌", "line": 8, "lat": 37.505123, "lng": 127.105456, "risk_level": "Low", "risk_score": 0.167},
    {"station_name": "송파", "line": 8, "lat": 37.498456, "lng": 127.111789, "risk_level": "Medium", "risk_score": 0.256},
    {"station_name": "문정", "line": 8, "lat": 37.485789, "lng": 127.121123, "risk_level": "Medium", "risk_score": 0.234},
    {"station_name": "장지", "line": 8, "lat": 37.478123, "lng": 127.126456, "risk_level": "Low", "risk_score": 0.145},
    {"station_name": "복정", "line": 8, "lat": 37.470456, "lng": 127.127789, "risk_level": "Low", "risk_score": 0.156},
    {"station_name": "산성", "line": 8, "lat": 37.443789, "lng": 127.137123, "risk_level": "Low", "risk_score": 0.098},
    {"station_name": "남한산성입구", "line": 8, "lat": 37.434123, "lng": 127.142456, "risk_level": "Low", "risk_score": 0.112},
    {"station_name": "단대오거리", "line": 8, "lat": 37.429456, "lng": 127.128789, "risk_level": "Low", "risk_score": 0.123},
    {"station_name": "신흥", "line": 8, "lat": 37.441789, "lng": 127.109123, "risk_level": "Low", "risk_score": 0.089},
    {"station_name": "수진", "line": 8, "lat": 37.444123, "lng": 127.101456, "risk_level": "Low", "risk_score": 0.134},
    {"station_name": "모란", "line": 8, "lat": 37.440456, "lng": 127.093789, "risk_level": "Medium", "risk_score": 0.267},
    {"station_name": "별내별가람", "line": 8, "lat": 37.618789, "lng": 127.125123, "risk_level": "Low", "risk_score": 0.067},
    {"station_name": "별내", "line": 8, "lat": 37.623123, "lng": 127.119456, "risk_level": "Low", "risk_score": 0.078}
];

// 앱 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    // 데이터 초기화
    allStations = seoul338Stations;
    filteredStations = [...allStations];
    
    // 지도 초기화
    initializeMap();
    
    // 마커 표시
    updateMarkers();
    
    // 통계 업데이트
    updateStatistics();
    
    // 랭킹 업데이트
    updateRanking();
    
    // 이벤트 리스너 설정
    setupEventListeners();
}

function initializeMap() {
    // 지도 생성 (서울 중심)
    map = L.map('map').setView([37.5665, 126.9780], 11);
    
    // 타일 레이어 추가
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // 마커 레이어 그룹 생성
    markersLayer = L.layerGroup().addTo(map);
}

function updateMarkers() {
    // 기존 마커 제거
    markersLayer.clearLayers();
    
    // 필터링된 역들을 마커로 표시
    filteredStations.forEach(station => {
        // 숨겨진 위험도는 제외
        if (hiddenRiskLevels.has(station.risk_level)) return;
        
        const style = riskStyles[station.risk_level];
        
        // 마커 생성
        const marker = L.circleMarker([station.lat, station.lng], {
            color: style.color,
            fillColor: style.color,
            fillOpacity: 0.8,
            radius: style.radius,
            weight: 2
        });
        
        // 팝업 내용
        const popupContent = `
            <div class="popup-content">
                <div class="popup-header">${station.station_name}역</div>
                <div class="popup-body">
                    <div class="popup-detail">
                        <span class="popup-label">호선</span>
                        <span class="popup-value">${station.line}호선</span>
                    </div>
                    <div class="popup-detail">
                        <span class="popup-label">위험도</span>
                        <span class="popup-value">${getRiskLevelKorean(station.risk_level)}</span>
                    </div>
                    <div class="popup-detail">
                        <span class="popup-label">위험점수</span>
                        <span class="popup-value">${station.risk_score.toFixed(3)}</span>
                    </div>
                    <div class="popup-detail">
                        <span class="popup-label">좌표</span>
                        <span class="popup-value">${station.lat.toFixed(4)}, ${station.lng.toFixed(4)}</span>
                    </div>
                </div>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        markersLayer.addLayer(marker);
    });
}

function updateStatistics() {
    const totalCount = filteredStations.length;
    const highRiskCount = filteredStations.filter(s => 
        s.risk_level === 'High' || s.risk_level === 'Very High'
    ).length;
    const avgScore = totalCount > 0 ? 
        filteredStations.reduce((sum, s) => sum + s.risk_score, 0) / totalCount : 0;
    
    const visibleStations = filteredStations.filter(s => !hiddenRiskLevels.has(s.risk_level));
    const visibleCount = visibleStations.length;
    const visibleAvg = visibleCount > 0 ? 
        visibleStations.reduce((sum, s) => sum + s.risk_score, 0) / visibleCount : 0;
    const visibleMax = visibleCount > 0 ? Math.max(...visibleStations.map(s => s.risk_score)) : 0;
    const visibleMin = visibleCount > 0 ? Math.min(...visibleStations.map(s => s.risk_score)) : 0;
    
    // 헤더 통계 업데이트
    document.getElementById('total-stations').textContent = allStations.length;
    document.getElementById('high-risk-count').textContent = allStations.filter(s => 
        s.risk_level === 'High' || s.risk_level === 'Very High'
    ).length;
    document.getElementById('avg-score').textContent = avgScore.toFixed(3);
    
    // 현재 보기 통계 업데이트
    document.getElementById('visible-count').textContent = visibleCount;
    document.getElementById('visible-avg').textContent = visibleAvg.toFixed(3);
    document.getElementById('visible-max').textContent = visibleMax.toFixed(3);
    document.getElementById('visible-min').textContent = visibleMin.toFixed(3);
}

function updateRanking() {
    const visibleStations = filteredStations.filter(s => !hiddenRiskLevels.has(s.risk_level));
    const topStations = visibleStations
        .sort((a, b) => b.risk_score - a.risk_score)
        .slice(0, 10);
    
    const rankingList = document.getElementById('ranking-list');
    rankingList.innerHTML = '';
    
    topStations.forEach((station, index) => {
        const item = document.createElement('div');
        item.className = 'ranking-item';
        item.innerHTML = `
            <span class="ranking-rank">${index + 1}</span>
            <span class="ranking-name">${station.station_name}</span>
            <span class="ranking-score ranking-score--${station.risk_level.toLowerCase().replace(' ', '-')}">${station.risk_score.toFixed(3)}</span>
        `;
        
        item.addEventListener('click', () => {
            map.setView([station.lat, station.lng], 15);
        });
        
        rankingList.appendChild(item);
    });
}

function setupEventListeners() {
    // 검색
    const searchInput = document.getElementById('station-search');
    searchInput.addEventListener('input', filterStations);
    
    // 필터
    document.getElementById('line-filter').addEventListener('change', filterStations);
    document.getElementById('risk-filter').addEventListener('change', filterStations);
    document.getElementById('score-range').addEventListener('input', filterStations);
    
    // 필터 초기화
    document.getElementById('reset-filters').addEventListener('click', resetFilters);
    
    // 범례 토글
    document.querySelectorAll('.legend-item').forEach(item => {
        item.addEventListener('click', toggleRiskLevel);
    });
    
    // 패널 토글
    const panelHandle = document.getElementById('panel-handle');
    const panel = document.getElementById('bottom-panel');
    const backdrop = document.getElementById('panel-backdrop');
    
    panelHandle.addEventListener('click', togglePanel);
    backdrop.addEventListener('click', closePanel);
    
    // 점수 범위 슬라이더
    const scoreRange = document.getElementById('score-range');
    const scoreValue = document.getElementById('score-value');
    
    scoreRange.addEventListener('input', (e) => {
        scoreValue.textContent = parseFloat(e.target.value).toFixed(2);
        filterStations();
    });
}

function filterStations() {
    const searchTerm = document.getElementById('station-search').value.toLowerCase();
    const lineFilter = document.getElementById('line-filter').value;
    const riskFilter = document.getElementById('risk-filter').value;
    const maxScore = parseFloat(document.getElementById('score-range').value);
    
    filteredStations = allStations.filter(station => {
        const matchesSearch = !searchTerm || station.station_name.toLowerCase().includes(searchTerm);
        const matchesLine = !lineFilter || station.line.toString() === lineFilter;
        const matchesRisk = !riskFilter || station.risk_level === riskFilter;
        const matchesScore = station.risk_score <= maxScore;
        
        return matchesSearch && matchesLine && matchesRisk && matchesScore;
    });
    
    updateMarkers();
    updateStatistics();
    updateRanking();
}

function resetFilters() {
    document.getElementById('station-search').value = '';
    document.getElementById('line-filter').value = '';
    document.getElementById('risk-filter').value = '';
    document.getElementById('score-range').value = '1';
    document.getElementById('score-value').textContent = '1.00';
    
    hiddenRiskLevels.clear();
    document.querySelectorAll('.legend-item').forEach(item => {
        item.classList.remove('disabled');
    });
    
    filteredStations = [...allStations];
    updateMarkers();
    updateStatistics();
    updateRanking();
}

function toggleRiskLevel(event) {
    const level = event.currentTarget.dataset.level;
    const legendItem = event.currentTarget;
    
    if (hiddenRiskLevels.has(level)) {
        hiddenRiskLevels.delete(level);
        legendItem.classList.remove('disabled');
    } else {
        hiddenRiskLevels.add(level);
        legendItem.classList.add('disabled');
    }
    
    updateMarkers();
    updateStatistics();
    updateRanking();
}

function togglePanel() {
    const panel = document.getElementById('bottom-panel');
    const backdrop = document.getElementById('panel-backdrop');
    
    panelOpen = !panelOpen;
    
    if (panelOpen) {
        panel.classList.add('open');
        backdrop.classList.add('visible');
    } else {
        panel.classList.remove('open');
        backdrop.classList.remove('visible');
    }
}

function closePanel() {
    const panel = document.getElementById('bottom-panel');
    const backdrop = document.getElementById('panel-backdrop');
    
    panelOpen = false;
    panel.classList.remove('open');
    backdrop.classList.remove('visible');
}

function getRiskLevelKorean(level) {
    const levels = {
        'Low': '낮음',
        'Medium': '보통',
        'High': '높음',
        'Very High': '매우 높음'
    };
    return levels[level] || level;
}