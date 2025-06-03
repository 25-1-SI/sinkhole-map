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

// 239개 서울 지하철역 완전한 데이터
// 239개 서울 지하철역 완전한 데이터
const seoul239Stations = [
  // 1호선 (10개)
  {"station_name": "서울", "line": 1, "lat": 37.55315, "lng": 126.972533, "risk_level": "Low", "risk_score": 0.179},
  {"station_name": "시청", "line": 1, "lat": 37.56359, "lng": 126.975407, "risk_level": "Medium", "risk_score": 0.347},
  {"station_name": "종각", "line": 1, "lat": 37.570203, "lng": 126.983116, "risk_level": "Very High", "risk_score": 0.766},
  {"station_name": "종로3가", "line": 1, "lat": 37.570429, "lng": 126.992095, "risk_level": "Medium", "risk_score": 0.313},
  {"station_name": "종로5가", "line": 1, "lat": 37.570971, "lng": 127.0019, "risk_level": "Medium", "risk_score": 0.489},
  {"station_name": "동대문", "line": 1, "lat": 37.57179, "lng": 127.011383, "risk_level": "Medium", "risk_score": 0.301},
  {"station_name": "동묘앞", "line": 1, "lat": 37.573265, "lng": 127.016459, "risk_level": "Low", "risk_score": 0.216},
  {"station_name": "신설동", "line": 1, "lat": 37.576117, "lng": 127.02471, "risk_level": "Low", "risk_score": 0.197},
  {"station_name": "제기동", "line": 1, "lat": 37.578116, "lng": 127.034902, "risk_level": "Medium", "risk_score": 0.375},
  {"station_name": "청량리", "line": 1, "lat": 37.580148, "lng": 127.045063, "risk_level": "Low", "risk_score": 0.086},

  // 2호선 (49개)
  {"station_name": "을지로입구", "line": 2, "lat": 37.565998, "lng": 126.982569, "risk_level": "Very High", "risk_score": 0.959},
  {"station_name": "을지로3가", "line": 2, "lat": 37.566292, "lng": 126.991773, "risk_level": "Medium", "risk_score": 0.49},
  {"station_name": "을지로4가", "line": 2, "lat": 37.566611, "lng": 126.998122, "risk_level": "Low", "risk_score": 0.099},
  {"station_name": "동대문역사문화공원", "line": 2, "lat": 37.565597, "lng": 127.009113, "risk_level": "Medium", "risk_score": 0.333},
  {"station_name": "신당", "line": 2, "lat": 37.565681, "lng": 127.019488, "risk_level": "Medium", "risk_score": 0.434},
  {"station_name": "상왕십리", "line": 2, "lat": 37.564504, "lng": 127.028872, "risk_level": "Low", "risk_score": 0.178},
  {"station_name": "왕십리", "line": 2, "lat": 37.561159, "lng": 127.035505, "risk_level": "Medium", "risk_score": 0.239},
  {"station_name": "한양대", "line": 2, "lat": 37.55658, "lng": 127.043504, "risk_level": "Low", "risk_score": 0.239},
  {"station_name": "뚝섬", "line": 2, "lat": 37.54718, "lng": 127.047413, "risk_level": "Medium", "risk_score": 0.402},
  {"station_name": "성수", "line": 2, "lat": 37.544628, "lng": 127.055983, "risk_level": "High", "risk_score": 0.501},
  {"station_name": "건대입구", "line": 2, "lat": 37.540408, "lng": 127.069231, "risk_level": "Medium", "risk_score": 0.269},
  {"station_name": "구의", "line": 2, "lat": 37.536857, "lng": 127.085024, "risk_level": "Low", "risk_score": 0.171},
  {"station_name": "강변", "line": 2, "lat": 37.535161, "lng": 127.094684, "risk_level": "Low", "risk_score": 0.065},
  {"station_name": "잠실나루", "line": 2, "lat": 37.520688, "lng": 127.103836, "risk_level": "Low", "risk_score": 0.132},
  {"station_name": "잠실", "line": 2, "lat": 37.513305, "lng": 127.100129, "risk_level": "Medium", "risk_score": 0.428},
  {"station_name": "잠실새내", "line": 2, "lat": 37.520731, "lng": 127.103738, "risk_level": "Low", "risk_score": 0.095},
  {"station_name": "종합운동장", "line": 2, "lat": 37.511008, "lng": 127.073641, "risk_level": "Low", "risk_score": 0.039},
  {"station_name": "삼성", "line": 2, "lat": 37.508827, "lng": 127.063203, "risk_level": "Medium", "risk_score": 0.481},
  {"station_name": "선릉", "line": 2, "lat": 37.504257, "lng": 127.048174, "risk_level": "Low", "risk_score": 0.093},
  {"station_name": "역삼", "line": 2, "lat": 37.500658, "lng": 127.03643, "risk_level": "Medium", "risk_score": 0.436},
  {"station_name": "강남", "line": 2, "lat": 37.497958, "lng": 127.027539, "risk_level": "Very High", "risk_score": 0.786},
  {"station_name": "교대", "line": 2, "lat": 37.493957, "lng": 127.014631, "risk_level": "Medium", "risk_score": 0.404},
  {"station_name": "서초", "line": 2, "lat": 37.49191, "lng": 127.007945, "risk_level": "Low", "risk_score": 0.221},
  {"station_name": "방배", "line": 2, "lat": 37.481469, "lng": 126.997627, "risk_level": "Low", "risk_score": 0.078},
  {"station_name": "사당", "line": 2, "lat": 37.476536, "lng": 126.981631, "risk_level": "Medium", "risk_score": 0.272},
  {"station_name": "낙성대", "line": 2, "lat": 37.47693, "lng": 126.963783, "risk_level": "Low", "risk_score": 0.004},
  {"station_name": "서울대입구", "line": 2, "lat": 37.481233, "lng": 126.952745, "risk_level": "Medium", "risk_score": 0.48},
  {"station_name": "봉천", "line": 2, "lat": 37.482416, "lng": 126.941896, "risk_level": "Low", "risk_score": 0.062},
  {"station_name": "신림", "line": 2, "lat": 37.484216, "lng": 126.929573, "risk_level": "Low", "risk_score": 0.233},
  {"station_name": "신대방", "line": 2, "lat": 37.487534, "lng": 126.913279, "risk_level": "Low", "risk_score": 0.004},
  {"station_name": "구로디지털단지", "line": 2, "lat": 37.485005, "lng": 126.902626, "risk_level": "Medium", "risk_score": 0.405},
  {"station_name": "대림", "line": 2, "lat": 37.492426, "lng": 126.895293, "risk_level": "Low", "risk_score": 0.043},
  {"station_name": "신도림", "line": 2, "lat": 37.508815, "lng": 126.891222, "risk_level": "Low", "risk_score": 0.224},
  {"station_name": "문래", "line": 2, "lat": 37.517993, "lng": 126.894766, "risk_level": "Low", "risk_score": 0.122},
  {"station_name": "영등포구청", "line": 2, "lat": 37.525766, "lng": 126.896627, "risk_level": "Low", "risk_score": 0.156},
  {"station_name": "당산", "line": 2, "lat": 37.523977, "lng": 126.902011, "risk_level": "Low", "risk_score": 0.094},
  {"station_name": "합정", "line": 2, "lat": 37.550025, "lng": 126.914557, "risk_level": "Low", "risk_score": 0.191},
  {"station_name": "홍대입구", "line": 2, "lat": 37.556748, "lng": 126.923643, "risk_level": "High", "risk_score": 0.561},
  {"station_name": "신촌", "line": 2, "lat": 37.555153, "lng": 126.93689, "risk_level": "Medium", "risk_score": 0.376},
  {"station_name": "이대", "line": 2, "lat": 37.556734, "lng": 126.945897, "risk_level": "Low", "risk_score": 0.123},
  {"station_name": "아현", "line": 2, "lat": 37.557407, "lng": 126.956079, "risk_level": "Low", "risk_score": 0.249},
  {"station_name": "충정로", "line": 2, "lat": 37.559742, "lng": 126.964455, "risk_level": "Low", "risk_score": 0.121},
  {"station_name": "용두", "line": 2, "lat": 37.574012, "lng": 127.03811, "risk_level": "Medium", "risk_score": 0.239},
  {"station_name": "신답", "line": 2, "lat": 37.56147, "lng": 127.056348, "risk_level": "Medium", "risk_score": 0.48},
  {"station_name": "용답", "line": 2, "lat": 37.566412, "lng": 126.977863, "risk_level": "High", "risk_score": 0.557},
  {"station_name": "도림천", "line": 2, "lat": 37.514759, "lng": 126.882586, "risk_level": "Low", "risk_score": 0.038},
  {"station_name": "양천구청", "line": 2, "lat": 37.512194, "lng": 126.865193, "risk_level": "Medium", "risk_score": 0.346},
  {"station_name": "신정네거리", "line": 2, "lat": 37.520218, "lng": 126.852849, "risk_level": "Low", "risk_score": 0.043},
  {"station_name": "까치산", "line": 2, "lat": 37.53181, "lng": 126.846706, "risk_level": "Low", "risk_score": 0.043},

  // 3호선 (31개)
  {"station_name": "지축", "line": 3, "lat": 37.648281, "lng": 126.912551, "risk_level": "Low", "risk_score": 0.098},
  {"station_name": "구파발", "line": 3, "lat": 37.636612, "lng": 126.918827, "risk_level": "Medium", "risk_score": 0.263},
  {"station_name": "연신내", "line": 3, "lat": 37.618855, "lng": 126.920859, "risk_level": "Low", "risk_score": 0.037},
  {"station_name": "불광", "line": 3, "lat": 37.610554, "lng": 126.929843, "risk_level": "Low", "risk_score": 0.127},
  {"station_name": "녹번", "line": 3, "lat": 37.600882, "lng": 126.935758, "risk_level": "Low", "risk_score": 0.016},
  {"station_name": "홍제", "line": 3, "lat": 37.588851, "lng": 126.944092, "risk_level": "Low", "risk_score": 0.028},
  {"station_name": "무악재", "line": 3, "lat": 37.582658, "lng": 126.950131, "risk_level": "Low", "risk_score": 0.071},
  {"station_name": "독립문", "line": 3, "lat": 37.574534, "lng": 126.957902, "risk_level": "Low", "risk_score": 0.08},
  {"station_name": "경복궁", "line": 3, "lat": 37.575844, "lng": 126.973576, "risk_level": "Medium", "risk_score": 0.255},
  {"station_name": "안국", "line": 3, "lat": 37.576562, "lng": 126.98547, "risk_level": "Low", "risk_score": 0.132},
  {"station_name": "충무로", "line": 3, "lat": 37.561302, "lng": 126.995473, "risk_level": "Medium", "risk_score": 0.345},
  {"station_name": "동대입구", "line": 3, "lat": 37.55816, "lng": 127.005273, "risk_level": "Low", "risk_score": 0.094},
  {"station_name": "약수", "line": 3, "lat": 37.554674, "lng": 127.010628, "risk_level": "Low", "risk_score": 0.039},
  {"station_name": "금호", "line": 3, "lat": 37.548269, "lng": 127.015785, "risk_level": "Low", "risk_score": 0.016},
  {"station_name": "옥수", "line": 3, "lat": 37.541653, "lng": 127.017303, "risk_level": "Low", "risk_score": 0.062},
  {"station_name": "압구정", "line": 3, "lat": 37.526169, "lng": 127.028502, "risk_level": "Low", "risk_score": 0.087},
  {"station_name": "신사", "line": 3, "lat": 37.516438, "lng": 127.020247, "risk_level": "Low", "risk_score": 0.083},
  {"station_name": "잠원", "line": 3, "lat": 37.512989, "lng": 127.011613, "risk_level": "Low", "risk_score": 0.086},
  {"station_name": "고속터미널", "line": 3, "lat": 37.504953, "lng": 127.004916, "risk_level": "Medium", "risk_score": 0.293},
  {"station_name": "남부터미널", "line": 3, "lat": 37.48494, "lng": 127.016289, "risk_level": "Medium", "risk_score": 0.278},
  {"station_name": "양재", "line": 3, "lat": 37.48466, "lng": 127.03513, "risk_level": "Low", "risk_score": 0.13},
  {"station_name": "매봉", "line": 3, "lat": 37.487114, "lng": 127.046907, "risk_level": "Low", "risk_score": 0.085},
  {"station_name": "도곡", "line": 3, "lat": 37.491129, "lng": 127.055694, "risk_level": "Low", "risk_score": 0.021},
  {"station_name": "대치", "line": 3, "lat": 37.494601, "lng": 127.063449, "risk_level": "Low", "risk_score": 0.062},
  {"station_name": "학여울", "line": 3, "lat": 37.496757, "lng": 127.070541, "risk_level": "Low", "risk_score": 0.031},
  {"station_name": "대청", "line": 3, "lat": 37.493607, "lng": 127.079526, "risk_level": "Low", "risk_score": 0.071},
  {"station_name": "일원", "line": 3, "lat": 37.48389, "lng": 127.08416, "risk_level": "Low", "risk_score": 0.042},
  {"station_name": "수서", "line": 3, "lat": 37.487507, "lng": 127.101324, "risk_level": "Low", "risk_score": 0.136},
  {"station_name": "가락시장", "line": 3, "lat": 37.492368, "lng": 127.118101, "risk_level": "Low", "risk_score": 0.137},
  {"station_name": "경찰병원", "line": 3, "lat": 37.495754, "lng": 127.124198, "risk_level": "Low", "risk_score": 0.071},
  {"station_name": "오금", "line": 3, "lat": 37.502288, "lng": 127.128344, "risk_level": "Low", "risk_score": 0.057},

  // 4호선 (21개)
  {"station_name": "당고개", "line": 4, "lat": 37.66956, "lng": 127.078404, "risk_level": "Low", "risk_score": 0.048},
  {"station_name": "상계", "line": 4, "lat": 37.660576, "lng": 127.073199, "risk_level": "Low", "risk_score": 0.04},
  {"station_name": "노원", "line": 4, "lat": 37.656274, "lng": 127.063183, "risk_level": "Medium", "risk_score": 0.406},
  {"station_name": "창동", "line": 4, "lat": 37.652993, "lng": 127.046746, "risk_level": "Medium", "risk_score": 0.27},
  {"station_name": "쌍문", "line": 4, "lat": 37.648274, "lng": 127.034381, "risk_level": "Low", "risk_score": 0.061},
  {"station_name": "수유", "line": 4, "lat": 37.637127, "lng": 127.024731, "risk_level": "Medium", "risk_score": 0.252},
  {"station_name": "미아", "line": 4, "lat": 37.626435, "lng": 127.026151, "risk_level": "Low", "risk_score": 0.105},
  {"station_name": "미아사거리", "line": 4, "lat": 37.613276, "lng": 127.030083, "risk_level": "Low", "risk_score": 0.156},
  {"station_name": "길음", "line": 4, "lat": 37.604087, "lng": 127.025353, "risk_level": "Low", "risk_score": 0.16},
  {"station_name": "성신여대입구", "line": 4, "lat": 37.592782, "lng": 127.017239, "risk_level": "Low", "risk_score": 0.184},
  {"station_name": "한성대입구", "line": 4, "lat": 37.58838, "lng": 127.006751, "risk_level": "Low", "risk_score": 0.016},
  {"station_name": "혜화", "line": 4, "lat": 37.582116, "lng": 127.001759, "risk_level": "Medium", "risk_score": 0.381},
  {"station_name": "명동", "line": 4, "lat": 37.561055, "lng": 126.988271, "risk_level": "Very High", "risk_score": 0.754},
  {"station_name": "회현", "line": 4, "lat": 37.559698, "lng": 126.979565, "risk_level": "Medium", "risk_score": 0.402},
  {"station_name": "숙대입구", "line": 4, "lat": 37.545124, "lng": 126.971952, "risk_level": "Low", "risk_score": 0.119},
  {"station_name": "삼각지", "line": 4, "lat": 37.535057, "lng": 126.973354, "risk_level": "Low", "risk_score": 0.231},
  {"station_name": "신용산", "line": 4, "lat": 37.52919, "lng": 126.96858, "risk_level": "Medium", "risk_score": 0.336},
  {"station_name": "이촌", "line": 4, "lat": 37.522525, "lng": 126.97335, "risk_level": "Low", "risk_score": 0.134},
  {"station_name": "동작", "line": 4, "lat": 37.503567, "lng": 126.980171, "risk_level": "Low", "risk_score": 0.03},
  {"station_name": "이수", "line": 4, "lat": 37.487521, "lng": 126.982309, "risk_level": "Medium", "risk_score": 0.256},
  {"station_name": "남태령", "line": 4, "lat": 37.464339, "lng": 126.989081, "risk_level": "Low", "risk_score": 0.041},

  // 5호선 (48개)
  {"station_name": "방화", "line": 5, "lat": 37.577669, "lng": 126.812822, "risk_level": "Low", "risk_score": 0.004},
  {"station_name": "개화산", "line": 5, "lat": 37.572458, "lng": 126.806838, "risk_level": "Low", "risk_score": 0.039},
  {"station_name": "김포공항", "line": 5, "lat": 37.56217, "lng": 126.801273, "risk_level": "Low", "risk_score": 0.004},
  {"station_name": "송정", "line": 5, "lat": 37.561411, "lng": 126.812052, "risk_level": "Low", "risk_score": 0.027},
  {"station_name": "마곡", "line": 5, "lat": 37.562182, "lng": 126.82693, "risk_level": "Low", "risk_score": 0.088},
  {"station_name": "발산", "line": 5, "lat": 37.562182, "lng": 126.82693, "risk_level": "Low", "risk_score": 0.088},
  {"station_name": "우장산", "line": 5, "lat": 37.548864, "lng": 126.83633, "risk_level": "Low", "risk_score": 0.054},
  {"station_name": "화곡", "line": 5, "lat": 37.541585, "lng": 126.840436, "risk_level": "Low", "risk_score": 0.053},
  {"station_name": "신정", "line": 5, "lat": 37.525001, "lng": 126.856176, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "목동", "line": 5, "lat": 37.526088, "lng": 126.864296, "risk_level": "Low", "risk_score": 0.092},
  {"station_name": "오목교", "line": 5, "lat": 37.524557, "lng": 126.875049, "risk_level": "Very High", "risk_score": 1.0},
  {"station_name": "양평", "line": 5, "lat": 37.525614, "lng": 126.886177, "risk_level": "Low", "risk_score": 0.114},
  {"station_name": "영등포시장", "line": 5, "lat": 37.52276, "lng": 126.905143, "risk_level": "Low", "risk_score": 0.084},
  {"station_name": "신길", "line": 5, "lat": 37.51763, "lng": 126.914886, "risk_level": "Low", "risk_score": 0.143},
  {"station_name": "여의도", "line": 5, "lat": 37.521578, "lng": 126.924318, "risk_level": "Medium", "risk_score": 0.277},
  {"station_name": "여의나루", "line": 5, "lat": 37.527145, "lng": 126.932807, "risk_level": "Low", "risk_score": 0.056},
  {"station_name": "마포", "line": 5, "lat": 37.539718, "lng": 126.946043, "risk_level": "Low", "risk_score": 0.14},
  {"station_name": "공덕", "line": 5, "lat": 37.544005, "lng": 126.951058, "risk_level": "High", "risk_score": 0.54},
  {"station_name": "애오개", "line": 5, "lat": 37.553592, "lng": 126.956733, "risk_level": "Medium", "risk_score": 0.318},
  {"station_name": "서대문", "line": 5, "lat": 37.565812, "lng": 126.966639, "risk_level": "Low", "risk_score": 0.228},
  {"station_name": "광화문", "line": 5, "lat": 37.570545, "lng": 126.976568, "risk_level": "Very High", "risk_score": 0.779},
  {"station_name": "청구", "line": 5, "lat": 37.560237, "lng": 127.01379, "risk_level": "Low", "risk_score": 0.016},
  {"station_name": "신금호", "line": 5, "lat": 37.554504, "lng": 127.020403, "risk_level": "Low", "risk_score": 0.012},
  {"station_name": "행당", "line": 5, "lat": 37.557297, "lng": 127.029482, "risk_level": "Low", "risk_score": 0.074},
  {"station_name": "마장", "line": 5, "lat": 37.566066, "lng": 127.042921, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "답십리", "line": 5, "lat": 37.566833, "lng": 127.05266, "risk_level": "Low", "risk_score": 0.008},
  {"station_name": "장한평", "line": 5, "lat": 37.561438, "lng": 127.064601, "risk_level": "Low", "risk_score": 0.236},
  {"station_name": "군자", "line": 5, "lat": 37.557102, "lng": 127.079559, "risk_level": "Low", "risk_score": 0.016},
  {"station_name": "아차산", "line": 5, "lat": 37.552005, "lng": 127.089609, "risk_level": "Low", "risk_score": 0.027},
  {"station_name": "광나루", "line": 5, "lat": 37.545301, "lng": 127.103478, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "천호", "line": 5, "lat": 37.538566, "lng": 127.123539, "risk_level": "Low", "risk_score": 0.218},
  {"station_name": "강동", "line": 5, "lat": 37.53581, "lng": 127.13249, "risk_level": "Low", "risk_score": 0.033},
  {"station_name": "길동", "line": 5, "lat": 37.538022, "lng": 127.140085, "risk_level": "Low", "risk_score": 0.012},
  {"station_name": "굽은다리", "line": 5, "lat": 37.545442, "lng": 127.142844, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "명일", "line": 5, "lat": 37.551317, "lng": 127.144002, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "고덕", "line": 5, "lat": 37.555002, "lng": 127.154214, "risk_level": "Low", "risk_score": 0.055},
  {"station_name": "상일동", "line": 5, "lat": 37.556714, "lng": 127.166381, "risk_level": "Low", "risk_score": 0.044},
  {"station_name": "둔촌동", "line": 5, "lat": 37.527787, "lng": 127.136219, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "올림픽공원", "line": 5, "lat": 37.516217, "lng": 127.130957, "risk_level": "Low", "risk_score": 0.004},
  {"station_name": "방이", "line": 5, "lat": 37.508752, "lng": 127.126054, "risk_level": "Low", "risk_score": 0.062},
  {"station_name": "개롱", "line": 5, "lat": 37.498097, "lng": 127.134817, "risk_level": "Low", "risk_score": 0.008},
  {"station_name": "거여", "line": 5, "lat": 37.493208, "lng": 127.143983, "risk_level": "Low", "risk_score": 0.054},
  {"station_name": "마천", "line": 5, "lat": 37.494972, "lng": 127.152784, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "강일", "line": 5, "lat": 37.557521, "lng": 127.176018, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "미사", "line": 5, "lat": 37.56329, "lng": 127.192954, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "하남풍산", "line": 5, "lat": 37.552201, "lng": 127.203897, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "하남시청", "line": 5, "lat": 37.541723, "lng": 127.206901, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "하남검단산", "line": 5, "lat": 37.539729, "lng": 127.223427, "risk_level": "Low", "risk_score": 0.0},

  // 6호선 (30개)
  {"station_name": "응암", "line": 6, "lat": 37.59859, "lng": 126.915583, "risk_level": "Low", "risk_score": 0.051},
  {"station_name": "역촌", "line": 6, "lat": 37.60605, "lng": 126.922764, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "독바위", "line": 6, "lat": 37.618413, "lng": 126.933035, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "구산", "line": 6, "lat": 37.611223, "lng": 126.917246, "risk_level": "Low", "risk_score": 0.027},
  {"station_name": "새절", "line": 6, "lat": 37.591148, "lng": 126.913613, "risk_level": "Low", "risk_score": 0.017},
  {"station_name": "증산", "line": 6, "lat": 37.583989, "lng": 126.909785, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "디지털미디어시티", "line": 6, "lat": 37.577005, "lng": 126.898643, "risk_level": "Low", "risk_score": 0.166},
  {"station_name": "월드컵경기장", "line": 6, "lat": 37.569439, "lng": 126.899077, "risk_level": "Low", "risk_score": 0.024},
  {"station_name": "마포구청", "line": 6, "lat": 37.563535, "lng": 126.903326, "risk_level": "Medium", "risk_score": 0.41},
  {"station_name": "망원", "line": 6, "lat": 37.556031, "lng": 126.910129, "risk_level": "Low", "risk_score": 0.054},
  {"station_name": "상수", "line": 6, "lat": 37.547704, "lng": 126.92292, "risk_level": "Low", "risk_score": 0.076},
  {"station_name": "광흥창", "line": 6, "lat": 37.547464, "lng": 126.931971, "risk_level": "Low", "risk_score": 0.087},
  {"station_name": "대흥", "line": 6, "lat": 37.547732, "lng": 126.942214, "risk_level": "Low", "risk_score": 0.116},
  {"station_name": "효창공원앞", "line": 6, "lat": 37.539279, "lng": 126.961348, "risk_level": "Low", "risk_score": 0.026},
  {"station_name": "녹사평", "line": 6, "lat": 37.53469, "lng": 126.98665, "risk_level": "Low", "risk_score": 0.004},
  {"station_name": "이태원", "line": 6, "lat": 37.534485, "lng": 126.994369, "risk_level": "Low", "risk_score": 0.111},
  {"station_name": "한강진", "line": 6, "lat": 37.53956, "lng": 127.001729, "risk_level": "Low", "risk_score": 0.028},
  {"station_name": "버티고개", "line": 6, "lat": 37.547933, "lng": 127.006948, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "창신", "line": 6, "lat": 37.579772, "lng": 127.015246, "risk_level": "Low", "risk_score": 0.017},
  {"station_name": "보문", "line": 6, "lat": 37.585293, "lng": 127.019377, "risk_level": "Low", "risk_score": 0.035},
  {"station_name": "안암", "line": 6, "lat": 37.586261, "lng": 127.02903, "risk_level": "Low", "risk_score": 0.022},
  {"station_name": "고려대", "line": 6, "lat": 37.59034, "lng": 127.03626, "risk_level": "Low", "risk_score": 0.078},
  {"station_name": "월곡", "line": 6, "lat": 37.60192, "lng": 127.041492, "risk_level": "Low", "risk_score": 0.114},
  {"station_name": "상월곡", "line": 6, "lat": 37.606392, "lng": 127.048509, "risk_level": "Low", "risk_score": 0.004},
  {"station_name": "돌곶이", "line": 6, "lat": 37.610522, "lng": 127.056419, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "석계", "line": 6, "lat": 37.614937, "lng": 127.065922, "risk_level": "Low", "risk_score": 0.075},
  {"station_name": "태릉입구", "line": 6, "lat": 37.617319, "lng": 127.074741, "risk_level": "Low", "risk_score": 0.09},
  {"station_name": "화랑대", "line": 6, "lat": 37.619875, "lng": 127.084106, "risk_level": "Low", "risk_score": 0.079},
  {"station_name": "봉화산", "line": 6, "lat": 37.617293, "lng": 127.091375, "risk_level": "Low", "risk_score": 0.096},
  {"station_name": "신내", "line": 6, "lat": 37.612571, "lng": 127.104326, "risk_level": "Low", "risk_score": 0.017},

  // 7호선 (35개)
  {"station_name": "장암", "line": 7, "lat": 37.70015, "lng": 127.053126, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "도봉산", "line": 7, "lat": 37.689131, "lng": 127.046548, "risk_level": "Low", "risk_score": 0.004},
  {"station_name": "수락산", "line": 7, "lat": 37.677804, "lng": 127.055314, "risk_level": "Low", "risk_score": 0.161},
  {"station_name": "마들", "line": 7, "lat": 37.664985, "lng": 127.057701, "risk_level": "Low", "risk_score": 0.014},
  {"station_name": "중계", "line": 7, "lat": 37.645052, "lng": 127.064084, "risk_level": "Low", "risk_score": 0.021},
  {"station_name": "하계", "line": 7, "lat": 37.636363, "lng": 127.067999, "risk_level": "Low", "risk_score": 0.152},
  {"station_name": "공릉", "line": 7, "lat": 37.625642, "lng": 127.072969, "risk_level": "Low", "risk_score": 0.098},
  {"station_name": "먹골", "line": 7, "lat": 37.610638, "lng": 127.077719, "risk_level": "Low", "risk_score": 0.02},
  {"station_name": "중화", "line": 7, "lat": 37.602604, "lng": 127.079254, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "상봉", "line": 7, "lat": 37.595673, "lng": 127.085708, "risk_level": "Low", "risk_score": 0.095},
  {"station_name": "면목", "line": 7, "lat": 37.588671, "lng": 127.087503, "risk_level": "Low", "risk_score": 0.013},
  {"station_name": "사가정", "line": 7, "lat": 37.580912, "lng": 127.088502, "risk_level": "Low", "risk_score": 0.04},
  {"station_name": "용마산", "line": 7, "lat": 37.573752, "lng": 127.086802, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "중곡", "line": 7, "lat": 37.565877, "lng": 127.084291, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "어린이대공원", "line": 7, "lat": 37.547962, "lng": 127.07465, "risk_level": "Low", "risk_score": 0.061},
  {"station_name": "뚝섬유원지", "line": 7, "lat": 37.531558, "lng": 127.066714, "risk_level": "Low", "risk_score": 0.062},
  {"station_name": "청담", "line": 7, "lat": 37.519097, "lng": 127.051851, "risk_level": "Low", "risk_score": 0.034},
  {"station_name": "강남구청", "line": 7, "lat": 37.517185, "lng": 127.04122, "risk_level": "Low", "risk_score": 0.038},
  {"station_name": "학동", "line": 7, "lat": 37.514262, "lng": 127.031738, "risk_level": "Low", "risk_score": 0.01},
  {"station_name": "논현", "line": 7, "lat": 37.511108, "lng": 127.021385, "risk_level": "Low", "risk_score": 0.18},
  {"station_name": "반포", "line": 7, "lat": 37.508171, "lng": 127.011717, "risk_level": "Low", "risk_score": 0.064},
  {"station_name": "내방", "line": 7, "lat": 37.48764, "lng": 126.993541, "risk_level": "Low", "risk_score": 0.009},
  {"station_name": "남성", "line": 7, "lat": 37.484688, "lng": 126.971108, "risk_level": "Low", "risk_score": 0.008},
  {"station_name": "숭실대입구", "line": 7, "lat": 37.496258, "lng": 126.953649, "risk_level": "Low", "risk_score": 0.057},
  {"station_name": "상도", "line": 7, "lat": 37.50279, "lng": 126.947949, "risk_level": "Low", "risk_score": 0.107},
  {"station_name": "장승배기", "line": 7, "lat": 37.504845, "lng": 126.939025, "risk_level": "Low", "risk_score": 0.19},
  {"station_name": "신대방삼거리", "line": 7, "lat": 37.499717, "lng": 126.928218, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "보라매", "line": 7, "lat": 37.499916, "lng": 126.920112, "risk_level": "Low", "risk_score": 0.106},
  {"station_name": "신풍", "line": 7, "lat": 37.500107, "lng": 126.909806, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "남구로", "line": 7, "lat": 37.486181, "lng": 126.887372, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "가산디지털단지", "line": 7, "lat": 37.480376, "lng": 126.882704, "risk_level": "Medium", "risk_score": 0.439},
  {"station_name": "철산", "line": 7, "lat": 37.47616, "lng": 126.868217, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "광명사거리", "line": 7, "lat": 37.47927, "lng": 126.854854, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "천왕", "line": 7, "lat": 37.486699, "lng": 126.838684, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "온수", "line": 7, "lat": 37.492059, "lng": 126.823294, "risk_level": "Low", "risk_score": 0.004},

  // 8호선 (15개)
  {"station_name": "암사", "line": 8, "lat": 37.550127, "lng": 127.127521, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "강동구청", "line": 8, "lat": 37.530348, "lng": 127.120461, "risk_level": "Low", "risk_score": 0.041},
  {"station_name": "몽촌토성", "line": 8, "lat": 37.517692, "lng": 127.11274, "risk_level": "Medium", "risk_score": 0.379},
  {"station_name": "석촌", "line": 8, "lat": 37.505396, "lng": 127.106995, "risk_level": "Low", "risk_score": 0.215},
  {"station_name": "송파", "line": 8, "lat": 37.49978, "lng": 127.11212, "risk_level": "Low", "risk_score": 0.044},
  {"station_name": "문정", "line": 8, "lat": 37.485931, "lng": 127.122473, "risk_level": "Medium", "risk_score": 0.327},
  {"station_name": "장지", "line": 8, "lat": 37.478609, "lng": 127.126229, "risk_level": "Medium", "risk_score": 0.264},
  {"station_name": "복정", "line": 8, "lat": 37.471016, "lng": 127.126746, "risk_level": "Low", "risk_score": 0.188},
  {"station_name": "남위례", "line": 8, "lat": 37.462839, "lng": 127.139047, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "산성", "line": 8, "lat": 37.456886, "lng": 127.149927, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "남한산성입구", "line": 8, "lat": 37.451568, "lng": 127.159845, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "단대오거리", "line": 8, "lat": 37.445057, "lng": 127.156735, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "신흥", "line": 8, "lat": 37.440952, "lng": 127.14759, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "수진", "line": 8, "lat": 37.437575, "lng": 127.140936, "risk_level": "Low", "risk_score": 0.0},
  {"station_name": "모란", "line": 8, "lat": 37.423988, "lng": 127.129921, "risk_level": "Low", "risk_score": 0.004}
];;

// 앱 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    // 데이터 초기화
    allStations = seoul239Stations;
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