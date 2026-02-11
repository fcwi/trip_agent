/**
 * ============================================================================
 * 行程資料檔案 (Trip Data Only) - 釜山版
 * ============================================================================
 *
 * 本檔案僅包含行程與相關資料，不含視圖或邏輯。
 * 所有資料都是靜態結構，供其他元件匯入使用。
 *
 * 【匯出項目】
 * - `guidesData`      : 行前指南與購票流程
 * - `usefulLinks`     : 分類的參考連結 (交通、天氣、購物、緊急...)
 * - `shopGuideData`   : 各區域商店與購物建議
 * - `itineraryData`   : 每日行程與事件列表
 * - `tripConfig`      : 全域設定 (標題、日期、飯店、主題等)
 * - `checklistData`   : 行前檢查清單 (可用於 todo / checkbox UI)
 *
 * ============================================================================
 */

import React from "react";
import {
  Train,
  MapPin,
  Utensils,
  Hotel,
  Snowflake,
  ShoppingBag,
  Star,
  Camera,
  QrCode,
  Shield,
  AlertCircle,
  CloudSnow,
  Sun,
  Briefcase,
  Map,
  Plane,
  Coffee,
  Ticket,
} from "lucide-react";

// ============================================================================
// 1. 指南資料 (Guides)
// ============================================================================
export const guidesData = [
  {
    title: "Visit Busan Pass (VBP)",
    icon: <Ticket className="w-5 h-5" />,
    summary: "釜山旅遊神卡，免費進入多個熱門景點。",
    steps: [
      "事前購買：Klook / KKday 購買 24H 或 48H 通行證 (實體卡或電子憑證)。",
      "實體卡：抵達金海機場後，至櫃檯兌換實體卡 (可當交通卡使用，需儲值)。",
      "電子版：下載 App 綁定憑證，入場出示 QR Code。",
      "啟用：第一個景點入場掃描後開始倒數計時。",
      "適用景點：Blue Line Park 海濱列車 (需預約)、X the Sky、松島纜車、Lotte World 等。",
    ],
    link: {
      text: "VBP 官網與景點列表",
      url: "https://www.visitbusanpass.com/",
    },
    blogs: [
      {
        title: "Mimi韓｜Visit Busan Pass 釜山通行證攻略",
        url: "https://mimihan.tw/visit-busan-pass/",
      },
      {
        title: "波比看世界｜釜山通行證 Visit Busan Pass 買哪種划算？",
        url: "https://bobby.tw/blog/post/visit-busan-pass",
      },
    ],
  },
  {
    title: "Q-CODE 入境檢疫資訊",
    icon: <QrCode className="w-5 h-5" />,
    summary: "入境韓國前建議填寫。",
    steps: [
      "雖目前不強制，但填寫 Q-CODE 可加速通關。",
      "出發前 3 天內上網填寫健康狀態。",
      "填寫完成後截圖 QR Code。",
      "若未填寫，機上需填寫黃色紙本健康申報單。",
    ],
    link: {
      text: "Q-CODE 官方網站",
      url: "https://cov19ent.kdca.go.kr/",
    },
    blogs: [
      {
        title: "Creatrip｜韓國入境最新規定 Q-CODE 教學",
        url: "https://www.creatrip.com/blog/12345", // 示意連結
      },
    ],
  },
  {
    title: "機場交通 (金海機場 ⇄ 市區)",
    icon: <Train className="w-5 h-5" />,
    summary: "輕軌、機場巴士或計程車的選擇。",
    steps: [
      "輕軌 (Light Rail)：機場站 → 沙上站 (轉乘地鐵2號線) → 西面/海雲台。便宜但不適合大行李。",
      "機場巴士 (Limousine Bus)：國際線 1F 3號月台搭乘。直達西面/海雲台飯店門口，舒適。",
      "計程車：依指標排隊。一般計程車 (銀/白/橘) 或模範計程車 (黑)。三人以上建議搭車。",
      "Uber (UT)：可直接叫車，綁定海外信用卡扣款。",
    ],
    link: {
      text: "金海機場交通指南",
      url: "https://www.airport.co.kr/gimhae/cms/fr/conts/contsView.do?MENU_ID=1350",
    },
    blogs: [],
  },
  {
    title: "Naver Map 使用指南",
    icon: <Map className="w-5 h-5" />,
    summary: "韓國必備地圖 App (Google Maps 不準)。",
    steps: [
      "下載 Naver Map App (設定語言為簡體/繁體中文)。",
      "註冊/登入 (可收藏地點)。",
      "搜尋地點建議用「韓文」或「電話號碼」最準確。",
      "導航時選擇「大眾交通」或「步行」。",
      "可查看地鐵到站時間與公車動態。",
    ],
    link: {
      text: "Naver Map 網頁版",
      url: "https://map.naver.com/",
    },
    blogs: [
      {
        title: "小不點看世界｜Naver Map 中文版教學",
        url: "https://www.paine0602.com/naver-map/",
      },
    ],
  },
];

// ============================================================================
// 2. 參考連結 (Useful links)
// ============================================================================
export const usefulLinks = [
  {
    category: "交通與工具",
    items: [
      {
        title: "Naver Map",
        desc: "韓國最強地圖 (必載)",
        url: "https://map.naver.com/",
        icon: <Map className="w-5 h-5" />,
      },
      {
        title: "Subway Korea",
        desc: "韓國地鐵路線圖 App",
        url: "http://www.malang.kr/subway/",
        icon: <Train className="w-5 h-5" />,
      },
      {
        title: "Kakao T",
        desc: "韓國計程車叫車 App",
        url: "https://www.kakaocorp.com/page/service/service/KakaoT",
        icon: <Briefcase className="w-5 h-5" />,
      },
      {
        title: "WOWPASS",
        desc: "外國人專用現金卡資訊",
        url: "https://www.wowpass.io/",
        icon: <QrCode className="w-5 h-5" />,
      },
    ],
  },
  {
    category: "天氣與實用",
    items: [
      {
        title: "釜山天氣 (Naver)",
        desc: "最準確的當地天氣",
        url: "https://weather.naver.com/today/08110580",
        icon: <Sun className="w-5 h-5" />,
      },
      {
        title: "韓巢地圖",
        desc: "中文介面地圖備用",
        url: "https://map.hanchao.com/",
        icon: <Map className="w-5 h-5" />,
      },
    ],
  },
  {
    category: "景點預約",
    items: [
      {
        title: "Blue Line Park",
        desc: "天空膠囊列車預約 (搶票)",
        url: "https://www.bluelinepark.com/eng/",
        icon: <Train className="w-5 h-5" />,
      },
      {
        title: "釜山 X the Sky",
        desc: "觀景台官網",
        url: "https://www.busanxthesky.com/",
        icon: <Star className="w-5 h-5" />,
      },
      {
        title: "Skyline Luge",
        desc: "釜山斜坡滑車",
        url: "https://www.skylineluge.kr/busan/",
        icon: <Snowflake className="w-5 h-5" />,
      },
    ],
  },
  {
    category: "購物與退稅",
    items: [
      {
        title: "樂天免稅店",
        desc: "線上預訂機場取貨",
        url: "https://ct.lottedfs.com/kr",
        icon: <ShoppingBag className="w-5 h-5" />,
      },
      {
        title: "退稅計算機",
        desc: "Global Blue 退稅試算",
        url: "https://www.globalblue.com/tax-free-shopping/refund-calculator",
        icon: <Briefcase className="w-5 h-5" />,
      },
    ],
  },
  {
    category: "緊急與保險",
    items: [
      {
        title: "駐釜山辦事處",
        desc: "急難救助電話",
        url: "https://www.roc-taiwan.org/krpus/index.html",
        icon: <Shield className="w-5 h-5" />,
      },
      {
        title: "韓國觀光公社",
        desc: "旅遊諮詢熱線 1330",
        url: "https://big5chinese.visitkorea.or.kr/cht/index.kto",
        icon: <AlertCircle className="w-5 h-5" />,
      },
    ],
  },
];

// ============================================================================
// 3. 商店與購物指南 (Shop guide)
// ============================================================================
export const shopGuideData = [
  {
    area: "西面 (Seomyeon)",
    desc: "釜山的弘大，逛街美食一級戰區",
    mapQuerySuffix: "釜山 西面",
    mainShops: [
      { name: "NC百貨", tag: "百貨", note: "平價品牌多，好逛" },
      { name: "樂天百貨 釜山總店", tag: "百貨", note: "免稅店在 7-8F" },
      { name: "西面地下街", tag: "服飾", note: "襪子、女裝超便宜" },
    ],
    specialShops: [
      { name: "ARTBOX", tag: "文具/雜貨", note: "韓系可愛小物" },
      { name: "Olive Young", tag: "藥妝", note: "旗艦店貨最全" },
      { name: "ABC Mart", tag: "鞋子", note: "常有特價款" },
    ],
    nearbyChains: [
      { name: "Shake Shack", location: "三井大樓 (Fiesta)" },
      { name: "Starbucks", location: "西面站周邊多間" },
      { name: "Egg Drop", location: "樂天後門" },
    ],
  },
  {
    area: "南浦洞 (Nampo)",
    desc: "BIFF廣場、國際市場、扎嘎其",
    mapQuerySuffix: "釜山 南浦",
    mainShops: [
      { name: "樂天百貨 光復店", tag: "百貨", note: "頂樓觀景台、音樂噴泉" },
      { name: "Kakao Friends", tag: "周邊", note: "旗艦店，有 Ryan Cafe" },
      { name: "Gentle Monster", tag: "眼鏡", note: "旗艦店設計超潮" },
    ],
    specialShops: [
      { name: "Vintage 街", tag: "古著", note: "國際市場內" },
      { name: "BIFF 廣場", tag: "小吃", note: "必吃黑糖餅 (元祖)" },
      { name: "光復路時尚街", tag: "逛街", note: "運動品牌旗艦店聚集" },
    ],
    nearbyChains: [
      { name: "Gong Cha", location: "光復路" },
      { name: "Baskin Robbins", location: "31冰淇淋" },
      { name: "Daiso", location: "多層樓大創 (南浦站旁)" },
    ],
  },
  {
    area: "海雲台 (Haeundae)",
    desc: "度假勝地，市場與大道",
    mapQuerySuffix: "釜山 海雲台",
    mainShops: [
      { name: "海雲台傳統市場", tag: "美食", note: "盲鰻、糖餅、紫菜包飯" },
      { name: "Gunam-ro 大道", tag: "逛街", note: "餐廳、拍貼機林立" },
      { name: "Ryan Holiday", tag: "展覽", note: "海灘旁 Grand Josun B1" },
    ],
    specialShops: [
      { name: "OPS 麵包店", tag: "美食", note: "釜山必吃麵包 (學古齋旁)" },
      { name: "Knotted Donut", tag: "甜點", note: "超人氣甜甜圈" },
      { name: "Musinsa Standard", tag: "服飾", note: "韓版 Uniqlo，質感好" },
    ],
    nearbyChains: [
      { name: "Starbucks", location: "海雲台沙灘景觀店" },
      { name: "Blue Line Park", location: "尾浦站" },
      { name: "Burger King", location: "海邊店" },
    ],
  },
  {
    area: "Centum City / 廣安里",
    desc: "世界最大百貨與海景咖啡",
    mapQuerySuffix: "釜山 Centum City",
    mainShops: [
      { name: "新世界百貨", tag: "百貨", note: "世界最大，內有 Spa Land" },
      { name: "樂天百貨 Centum", tag: "百貨", note: "就在新世界隔壁" },
      { name: "Millac The Market", tag: "商場", note: "廣安里最新複合式空間" },
    ],
    specialShops: [
      { name: "Tamburins", tag: "香氛", note: "新世界百貨內" },
      { name: "Nike Rise", tag: "運動", note: "新世界 Centum City Mall" },
      { name: "Casetify", tag: "手機殼", note: "新世界 B2" },
    ],
    nearbyChains: [
      { name: "Paul Bassett", location: "咖啡拿鐵好喝" },
      { name: "Coffee Bean", location: "廣安里海景座" },
    ],
  },
];

// ============================================================================
// 4. 行程核心資料 (Itinerary)
// ============================================================================
export const itineraryData = [
  {
    day: "Day 1",
    locationKey: "seomyeon",
    date: "2/1 (日)",
    title: "抵達釜山：豬肉湯飯與西面逛街",
    stay: "Lotte Hotel Busan (西面)",
    routeInfo: {
      summary: "金海機場 → 飯店 Check-in → 西面地下街 → 晚餐",
      mapUrl: "https://naver.me/xxx", // 示意連結
    },
    events: [
      {
        time: "14:00",
        title: "抵達金海機場 (PUS)",
        mapQuery: "金海國際機場",
        lat: 35.1732,
        lon: 128.9464,
        icon: <Plane />,
        desc: "領取行李，入境審查 (準備 Q-CODE 或黃色紙本)。入境大廳領取 Visit Busan Pass (若有買) 或儲值 T-money。",
        tips: [
          "機場換匯匯率較差，建議先換少量韓元搭車，去西面再在大額換匯。",
          "便利商店可買 T-money 卡。",
        ],
      },
      {
        time: "15:30",
        title: "交通：機場 → 西面",
        mapQuery: "西面站",
        lat: 35.1578,
        lon: 129.06,
        icon: <Train />,
        desc: "前往市區飯店。",
        transport: {
          mode: "機場巴士 或 計程車",
          duration: "約 30-40 分鐘",
          route: "金海機場 → 樂天飯店 (西面)",
          note: "人多建議直接搭計程車，車資約 1.5-2 萬韓元，省力方便。",
        },
      },
      {
        time: "16:30",
        title: "飯店 Check-in & 換錢",
        mapQuery: "Lotte Hotel Busan",
        lat: 35.1565,
        lon: 129.0558,
        icon: <Hotel />,
        desc: "入住釜山樂天飯店。稍作休息後，前往西面換錢所換韓幣。",
        tips: [
          "老奶奶換錢所 / 那英換錢所：位於西面市場巷弄內，匯率通常不錯。",
          "準備美金或台幣 1000 元面額更換。",
        ],
      },
      {
        time: "18:00",
        title: "晚餐：松亭3代豬肉湯飯",
        mapQuery: "西面豬肉湯飯一條街",
        lat: 35.1548,
        lon: 129.0592,
        icon: <Utensils />,
        desc: "釜山必吃美食！熱騰騰的濃郁豚骨湯頭。",
        highlights: [
          "松亭3代 (70年老店) 或 秀玲豬肉湯飯。",
          "吃法：加入韭菜、蝦醬調味，麵線先丟進去吃。",
          "敢吃內臟可以點內臟湯飯 (Mixed)。",
        ],
      },
      {
        time: "19:30",
        title: "西面地下街 & 商圈",
        mapQuery: "西面地下街",
        lat: 35.1578,
        lon: 129.06,
        icon: <ShoppingBag />,
        desc: "消化一下，逛逛釜山最熱鬧的商圈。",
        tips: [
          "NC百貨：平價好買 (Shoopen 鞋子)。",
          "Olive Young：補給化妝水、面膜。",
          "地下街很長，小心迷路，認這主要地標 (樂天百貨、大賢地下街)。",
        ],
      },
    ],
  },
  {
    day: "Day 2",
    locationKey: "haeundae",
    date: "2/2 (一)",
    title: "海雲台：天空膠囊與絕美海景",
    stay: "Lotte Hotel Busan (西面)",
    routeInfo: {
      summary: "尾浦站 (膠囊列車) → 青沙浦 → X the Sky → 海雲台沙灘",
      mapUrl: "https://naver.me/xxx",
    },
    events: [
      {
        time: "09:30",
        title: "交通：前往海雲台 Blue Line Park",
        mapQuery: "Blue Line Park 尾浦站",
        lat: 35.1633,
        lon: 129.1837,
        icon: <Train />,
        desc: "搭乘地鐵2號線至中洞站或海雲台站，轉計程車/步行至尾浦站。",
        transport: {
          mode: "地鐵 + 步行/Taxi",
          duration: "約 50 分鐘",
          route: "西面站 → 中洞站 → 尾浦站",
        },
      },
      {
        time: "10:30",
        title: "天空膠囊列車 (Sky Capsule)",
        mapQuery: "Blue Line Park 尾浦站",
        lat: 35.1633,
        lon: 129.1837,
        icon: <Camera />,
        desc: "釜山最紅打卡點！可愛彩色小車車，沿著海岸線行駛。",
        highlights: [
          "路線：尾浦 (Mipo) → 青沙浦 (Cheongsapo)。",
          "車程約 30 分鐘，車廂獨立，可盡情拍照。",
          "抵達青沙浦後，一定要拍「灌籃高手平交道」場景。",
        ],
        tips: [
          "⚠️ 務必提早 2-3 週官網預約！黃金時段 (夕陽) 超難搶。",
          "若買 VBP，僅能搭乘下層的海岸列車 (Beach Train)，不能搭膠囊列車。",
        ],
      },
      {
        time: "12:00",
        title: "午餐：青沙浦烤貝/海鮮",
        mapQuery: "青沙浦 秀敏家",
        lat: 35.1608,
        lon: 129.1931,
        icon: <Utensils />,
        desc: "青沙浦必吃炭火烤貝。",
        highlights: [
          "秀敏家 (Su-min-ga)：人氣烤貝店，姨母會幫忙烤。",
          "H.US Coffee：有海景落地窗的咖啡廳。",
        ],
      },
      {
        time: "14:30",
        title: "釜山 X the Sky",
        mapQuery: "BUSAN X the SKY",
        lat: 35.1598,
        lon: 129.1691,
        icon: <Star />,
        desc: "位於 LCT Landmark Tower 100樓，韓國第二高樓觀景台。",
        highlights: [
          "透明地板 Shocking Bridge：挑戰膽量。",
          "全世界最高的星巴克 (99F)：買限定杯子。",
          "俯瞰海雲台沙灘全景。",
        ],
        tips: ["使用 Visit Busan Pass 可免費入場。"],
      },
      {
        time: "16:30",
        title: "海雲台沙灘 & 傳統市場",
        mapQuery: "海雲台傳統市場",
        lat: 35.1617,
        lon: 129.1622,
        icon: <MapPin />,
        desc: "漫步沙灘餵海鷗，接著逛市場。",
        highlights: [
          "餵海鷗：記得買蝦味先 (如果在沙灘上)。",
          "傳統市場：排隊名店「尚國家飯捲」(紫菜包飯、辣炒年糕)。",
          "糖餅：市場頭尾都有好吃的糖餅。",
        ],
      },
      {
        time: "18:30",
        title: "晚餐：味贊王鹽烤肉",
        mapQuery: "味贊王鹽烤肉 海雲台",
        lat: 35.161,
        lon: 129.1605,
        icon: <Utensils />,
        desc: "釜山超強厚切燒肉。",
        tips: ["專人代烤，肉汁在嘴裡爆開。", "一定要加點石鍋飯 (附大醬湯)。"],
      },
    ],
  },
  {
    day: "Day 3",
    locationKey: "gwangalli",
    date: "2/3 (二)",
    title: "汗蒸幕放鬆與廣安里無人機",
    stay: "Lotte Hotel Busan (西面)",
    routeInfo: {
      summary: "Spa Land 汗蒸幕 → 新世界百貨 → Millac The Market → 廣安里",
      mapUrl: "https://naver.me/xxx",
    },
    events: [
      {
        time: "10:30",
        title: "Spa Land 汗蒸幕",
        mapQuery: "Spa Land Centum City",
        lat: 35.169,
        lon: 129.1293,
        icon: <Coffee />,
        desc: "五星級汗蒸幕，位於新世界百貨內。VBP 可免費入場 (4小時)。",
        highlights: [
          "戶外足湯區、各式溫度烤箱、休息區超舒適。",
          "必吃：甜米釀 (Sikhye) + 烤雞蛋。",
          "搓澡：需另外付費預約，全身滑溜溜。",
        ],
        tips: [
          "未滿小學生的兒童不能入場 (需確認年齡規定)。",
          "記得帶換洗衣物 (裡面有提供毛巾與衣褲)。",
        ],
      },
      {
        time: "14:00",
        title: "新世界百貨 Centum City",
        mapQuery: "新世界百貨 Centum City",
        lat: 35.169,
        lon: 129.1293,
        icon: <ShoppingBag />,
        desc: "午餐在百貨地下美食街解決，順便逛逛世界最大百貨。",
        highlights: [
          "B1 美食街：超多甜點 (Knotted, BAKE 等)。",
          "4F 按摩椅咖啡廳：逛累了可以去。",
        ],
      },
      {
        time: "16:00",
        title: "Millac The Market",
        mapQuery: "Millac The Market",
        lat: 35.1557,
        lon: 129.1235,
        icon: <ShoppingBag />,
        desc: "廣安里附近的新地標，複合式紅磚商場。",
        highlights: [
          "大階梯座位區：面對港口發呆看海。",
          "必逛：各式文創小店、啤酒吧。",
        ],
      },
      {
        time: "18:00",
        title: "晚餐：廣安里烤貝/生魚片",
        mapQuery: "廣安里海灘",
        lat: 35.1532,
        lon: 129.1186,
        icon: <Utensils />,
        desc: "選擇一家能看到廣安大橋的餐廳。",
        advice: "推薦：Mad Dogs (芝加哥比薩) 若不想再吃海鮮的話。",
      },
      {
        time: "19:30",
        title: "廣安里 M 無人機秀 (週六限定)",
        mapQuery: "廣安里海水浴場",
        lat: 35.1532,
        lon: 129.1186,
        icon: <Star />,
        desc: "若遇週六晚上，有精彩無人機表演 (20:00 / 22:00)。平日則欣賞廣安大橋夜景。",
        tips: ["買些炸雞、啤酒在沙灘上野餐。", "夜景非常美，適合拍照。"],
      },
    ],
  },
  {
    day: "Day 4",
    locationKey: "nampo",
    date: "2/4 (三)",
    title: "文化探索：甘川洞與南浦洞",
    stay: "Lotte Hotel Busan (西面)",
    routeInfo: {
      summary: "甘川洞文化村 → 松島纜車 → BIFF廣場 → 樂天超市",
      mapUrl: "https://naver.me/xxx",
    },
    events: [
      {
        time: "09:30",
        title: "甘川洞文化村",
        mapQuery: "甘川洞文化村",
        lat: 35.0975,
        lon: 129.0106,
        icon: <Camera />,
        desc: "韓國的馬丘比丘，彩色積木房子。",
        highlights: [
          "必拍：小王子與狐狸的背影 (需排隊)。",
          "集章活動：購買地圖集章，可兌換明信片。",
          "穿韓服：這裡穿韓服拍照非常有氛圍。",
        ],
        tips: [
          "建議搭計程車或專車上山，坡度很陡。",
          "是居民居住區，請降低音量。",
        ],
      },
      {
        time: "13:00",
        title: "松島海上纜車",
        mapQuery: "松島海上纜車",
        lat: 35.0768,
        lon: 129.0205,
        icon: <Train />,
        desc: "搭乘纜車跨越海面，前往岩南公園。",
        highlights: [
          "水晶車廂：地板透明，可看到腳下大海。",
          "龍宮雲橋：走在海上的步道 (需另外購票或 VBP 包含)。",
          "松島天空步道 (Skywalk)：免費的海上步道。",
        ],
        tips: ["VBP 可免費搭乘一般車廂 (來回)，水晶車廂需補差價。"],
      },
      {
        time: "16:00",
        title: "南浦洞 BIFF 廣場",
        mapQuery: "BIFF 廣場",
        lat: 35.0986,
        lon: 129.0267,
        icon: <ShoppingBag />,
        desc: "釜山電影節發源地，路邊攤美食天堂。",
        highlights: [
          "元祖黑糖餅：排隊名店，包堅果超好吃。",
          "辣炒年糕、魚板湯：暖胃首選。",
          "光復路時尚街：運動品牌旗艦店。",
        ],
      },
      {
        time: "18:00",
        title: "晚餐：札嘎其市場 / 豬腳",
        mapQuery: "富平罐頭市場",
        lat: 35.1011,
        lon: 129.0238,
        icon: <Utensils />,
        desc: "晚餐選擇。",
        highlights: [
          "方案A：富平罐頭市場夜市 (巨人炸雞、綠豆煎餅)。",
          "方案B：霸王豬腳 (南浦洞豬腳街)。",
        ],
      },
    ],
  },
  {
    day: "Day 5",
    locationKey: "huinnyeoul",
    date: "2/5 (四)",
    title: "影島絕美海景與太宗台",
    stay: "Lotte Hotel Busan (西面)",
    routeInfo: {
      summary: "影島大橋 → 白淺灘文化村 → 太宗台 → 樂天百貨光復店",
      mapUrl: "https://naver.me/xxx",
    },
    events: [
      {
        time: "10:00",
        title: "影島大橋開橋秀 (週六)",
        mapQuery: "影島大橋",
        lat: 35.0963,
        lon: 129.0367,
        icon: <Camera />,
        desc: "連接南浦洞與影島的橋樑。若非週六，直接前往白淺灘。",
        tips: ["現已改為每週六 14:00 開橋一次 (請確認最新時刻)。"],
      },
      {
        time: "10:30",
        title: "白淺灘文化村",
        mapQuery: "白淺灘文化村",
        lat: 35.0788,
        lon: 129.0435,
        icon: <Coffee />,
        desc: "希臘風海景小村，電影《辯護人》拍攝地。",
        highlights: [
          "海岸隧道：熱門拍照點。",
          "絕美海景咖啡廳：隨便找一家都美 (如 Aether, Having Moment)。",
          "小店逛逛：買文創明信片。",
        ],
      },
      {
        time: "13:30",
        title: "午餐：太宗台海鮮麵",
        mapQuery: "太宗台海鮮麵",
        lat: 35.0538,
        lon: 129.0833,
        icon: <Utensils />,
        desc: "品嘗滿滿海鮮的炒碼麵。",
        highlights: ["太宗台炒碼麵：章魚、鮑魚整隻放。", "糖醋肉：配菜必點。"],
      },
      {
        time: "15:00",
        title: "太宗台 (Danubi 遊園車)",
        mapQuery: "太宗台",
        lat: 35.0536,
        lon: 129.087,
        icon: <Train />,
        desc: "搭乘可愛的 Danubi 列車遊園。",
        highlights: [
          "展望台：天氣好可看到日本對馬島。",
          "影島燈塔：壯觀的懸崖峭壁。",
        ],
        tips: ["VBP 可免費搭乘 Danubi 列車。"],
      },
      {
        time: "17:30",
        title: "樂天百貨 光復店 (購物 & 超市)",
        mapQuery: "樂天百貨光復店",
        lat: 35.097,
        lon: 129.035,
        icon: <ShoppingBag />,
        desc: "回程順路去採買伴手禮，別忘了去頂樓看夜景。",
        highlights: [
          "B1 樂天超市：泡麵、海苔、零食最後補貨。",
          "頂樓觀景台：免費欣賞釜山港夜景。",
          "室內音樂噴泉：世界最大室內噴泉 (整點表演)。",
        ],
      },
    ],
  },
  {
    day: "Day 6",
    locationKey: "airport",
    date: "2/6 (五)",
    title: "最後整理與返家",
    stay: "溫暖的家",
    routeInfo: {
      summary: "飯店 Check-out → 機場 → 免稅店 → 飛往台北",
      mapUrl: "https://naver.me/xxx",
    },
    events: [
      {
        time: "09:00",
        title: "飯店早餐 & Check-out",
        mapQuery: "Lotte Hotel Busan",
        lat: 35.1565,
        lon: 129.0558,
        icon: <Hotel />,
        desc: "享受飯店設施，整理行李。確認護照、錢包。",
        tips: ["若行李太多，請飯店櫃檯幫忙叫大型計程車 (Jumbo Taxi)。"],
      },
      {
        time: "10:30",
        title: "前往金海機場 (PUS)",
        mapQuery: "金海國際機場",
        lat: 35.1732,
        lon: 128.9464,
        icon: <Train />,
        desc: "提早 2.5 - 3 小時抵達機場。",
        transport: {
          mode: "機場巴士 或 計程車",
          duration: "約 30 分鐘",
          route: "西面 → 金海機場",
        },
      },
      {
        time: "11:30",
        title: "退稅 & 免稅店購物",
        mapQuery: "金海機場免稅店",
        lat: 35.1732,
        lon: 128.9464,
        icon: <ShoppingBag />,
        desc: "辦理退稅手續，逛逛機場免稅店。",
        highlights: [
          "7-11：把交通卡餘額花完的好地方。",
          "免稅店：雪花秀、正官庄人蔘。",
        ],
        tips: ["金海機場不大，免稅店品牌有限，建議市區買好。"],
      },
      {
        time: "13:30",
        title: "搭機返台",
        mapQuery: "金海國際機場",
        lat: 35.1732,
        lon: 128.9464,
        icon: <Plane />,
        desc: "再見釜山！",
        transport: {
          mode: "飛機",
          duration: "約 2.5 小時",
          route: "釜山 (PUS) → 台北 (TPE)",
          note: "實際航班時間請依訂票資訊為主。",
        },
      },
    ],
  },
];

// ============================================================================
// 5. 專案全域設定 (Config)
// ============================================================================
export const tripConfig = {
  // ========== 基本資訊 ==========
  title: "韓國釜山親子之旅",
  timeZone: "Asia/Seoul",
  currency: {
    code: "krw",
    label: "韓元",
    source: "KRW",
    target: "TWD",
  },
  subTitle: "2026/2/1 - 2/6",
  startDate: "2026-02-01T00:00:00",

  endDate: "2026-02-06T23:59:59",

  // ========== 網站 Meta 設定 (動態標題) ==========
  meta: {
    title: "韓國釜山親子之旅",
    description: "韓國釜山親子旅遊行程助手",
    ogImage: "https://fcwi.github.io/trip_agent/icon-512.png",
  },

  // ========== 航班資訊 (範例) ==========
  flights: {
    outbound: {
      code: "虎航 IT606",
      time: "14:00 TPE ➝ 17:30 PUS",
    },
    inbound: {
      code: "虎航 IT607",
      time: "18:25 PUS ➝ 20:00 TPE",
    },
  },

  // ========== 住宿資訊 ==========
  hotels: [
    {
      name: "Lotte Hotel Busan",
      phone: "+82-51-810-1000",
      address: "772 Gaya-daero, Busanjin-gu, Busan",
      note: "西面站，交通超方便，直結百貨與賭場。",
    },
  ],

  // ========== 緊急聯絡 ==========
  emergency: {
    police: "112",
    ambulance: "119",
    contact: "駐釜山辦事處：+82-51-463-7965",
  },

  // 導遊模式問題
  aiQuestions: [
    "西面好吃的烤肉推薦?",
    "如何去甘川洞文化村?",
    "這附近有 Olive Young 嗎?",
    "Visit Busan Pass 怎麼用?",
  ],

  // 翻譯模式預設問題
  translationQuestions: [
    "翻譯「請給我菜單」",
    "翻譯「不要太辣」",
    "翻譯「這個多少錢?」",
    "翻譯「可以退稅嗎?」",
  ],

  // ========== 地點定義 ==========
  locations: [
    { key: "seomyeon", name: "西面", lat: 35.1578, lon: 129.06 },
    { key: "haeundae", name: "海雲台", lat: 35.1587, lon: 129.1603 },
    { key: "gwangalli", name: "廣安里", lat: 35.1532, lon: 129.1186 },
    { key: "nampo", name: "南浦洞", lat: 35.099, lon: 129.03 },
    { key: "huinnyeoul", name: "影島", lat: 35.0788, lon: 129.0435 },
    { key: "airport", name: "金海機場", lat: 35.1732, lon: 128.9464 },
  ],

  // ========== 旅程亮點 ==========
  tripHighlights: [
    "海雲台天空膠囊",
    "甘川洞小王子",
    "Spa Land 汗蒸幕",
    "廣安里無人機秀",
    "松島海上纜車",
    "豬肉湯飯/烤貝",
  ],

  // ========== 視覺主題 (沿用或微調) ==========
  theme: {
    colorBase: "stone", // 韓系清新風格
    colorAccent: "sky", // 海洋藍

    textColors: {
      light: "text-stone-800",
      dark: "text-stone-100",
      secLight: "text-stone-500",
      secDark: "text-stone-300",
    },

    bgTexture: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`,

    bgGradientLight: "bg-[#FDFBF7] from-blue-50/50 via-white to-transparent",
    bgGradientDark:
      "bg-[#1A1A1A] from-[#252525] via-[#1A1A1A]/80 to-transparent",

    blobs: {
      light: ["bg-blue-200/30", "bg-stone-200/30", "bg-cyan-100/40"],
      dark: ["bg-blue-500/10", "bg-purple-500/10", "bg-cyan-500/10"],
    },
    // ... (保留其餘樣式設定以維持 UI 一致性)
    weatherColors: {
      rain: "#94a3b8",
      cloud: "#cbd5e1",
      snow: "#94a3b8",
    },
    semanticColors: {
      blue: { light: "text-[#5D737E]", dark: "text-sky-300" },
      green: { light: "text-[#556B2F]", dark: "text-emerald-300" },
      red: { light: "text-[#A04040]", dark: "text-red-300" },
      orange: { light: "text-[#CD853F]", dark: "text-amber-300" },
      pink: { light: "text-[#BC8F8F]", dark: "text-rose-300" },
    },
    weatherIconColors: {
      sun: "text-amber-300",
      moon: "text-indigo-300",
      cloud: "text-gray-400",
      fog: "text-slate-400",
      rain: "text-blue-400",
      snow: "text-cyan-300",
      lightning: "text-yellow-500",
    },
    glassColors: {
      card: {
        light:
          "bg-white/85 backdrop-blur-lg backdrop-saturate-180 border border-white/30 shadow-lg shadow-black/5",
        dark: "bg-[#1F1F1F]/92 backdrop-blur-lg backdrop-saturate-180 border border-white/15 shadow-xl shadow-black/40",
      },
      nav: {
        light:
          "bg-white/25 backdrop-blur-3xl backdrop-saturate-150 border border-white/20 shadow-md shadow-black/3",
        dark: "bg-[#2A2A2A]/50 backdrop-blur-3xl backdrop-saturate-150 border border-white/10 shadow-lg shadow-black/50",
      },
      chatBubble: {
        light:
          "bg-white/88 backdrop-blur-lg backdrop-saturate-180 border border-white/25 shadow-md shadow-black/4",
        dark: "bg-neutral-800/88 backdrop-blur-lg backdrop-saturate-180 border border-white/12 shadow-lg shadow-black/50",
      },
    },
    tagColors: {
      transport: {
        light: "bg-[#E8F0FE] text-[#3B5998]",
        dark: "bg-sky-900/30 text-sky-200",
      },
      food: {
        light: "bg-[#F0F5E5] text-[#556B2F]",
        dark: "bg-emerald-900/30 text-emerald-200",
      },
      shopping: {
        light: "bg-[#FFF8E1] text-[#8B6B23]",
        dark: "bg-amber-900/30 text-amber-200",
      },
      hotel: {
        light: "bg-[#E6E6FA] text-[#6A5ACD]",
        dark: "bg-purple-900/30 text-purple-200",
      },
      spot: {
        light: "bg-[#FFF0F5] text-[#BC8F8F]",
        dark: "bg-rose-900/30 text-rose-200",
      },
    },
    chatColors: {
      userBubble: {
        light: "bg-[#5D737E] text-white border-[#4A606A]",
        dark: "bg-sky-800 text-white border-sky-700",
      },
      modelBubble: {
        light: "bg-white/90 backdrop-blur-sm text-stone-700 border-stone-200",
        dark: "bg-neutral-800/90 backdrop-blur-sm text-neutral-200 border-neutral-700",
      },
      bg: {
        light: "bg-[#F9F9F6]/50",
        dark: "bg-black/20",
      },
    },
    mainBg: {
      light: "bg-[#F0F2F5] text-slate-700",
      dark: "bg-[#1A1A1A] text-neutral-200",
    },
    particleColors: {
      rain: {
        light: "rgba(100, 149, 237, 0.6)",
        dark: "rgba(255, 255, 255, 0.5)",
      },
      snow: "rgba(255, 255, 255, 0.8)",
      stars: "rgba(255, 255, 255, ALPHA)",
      fog: "rgba(200, 200, 200, ALPHA)",
      lightning: "rgba(255, 255, 200, BRIGHTNESS)",
    },
    cloudColors: {
      heavy: "#bdc3c7",
      medium: "#d1d5db",
      light: "#ecf0f1",
    },
    celestialColors: {
      sun: "#f1c40f",
      sunGlow: "#f39c12",
      moon: "#f5f6fa",
      moonShadow: "rgba(245, 246, 250, 0.4)",
    },
    ambientColors: {
      clear: {
        light: "rgba(255, 255, 255, 0.8)",
        dark: "rgba(30, 41, 59, 0.5)",
      },
      cloudy: {
        light: "rgba(241, 245, 249, 0.85)",
        dark: "rgba(51, 65, 85, 0.6)",
      },
      rain: {
        light: "rgba(219, 234, 254, 0.85)",
        dark: "rgba(30, 58, 138, 0.4)",
      },
      snow: {
        light: "rgba(248, 250, 252, 0.9)",
        dark: "rgba(71, 85, 105, 0.5)",
      },
      thunderstorm: {
        light: "rgba(200, 200, 220, 0.85)",
        dark: "rgba(30, 30, 50, 0.7)",
      },
      fog: {
        light: "rgba(226, 232, 240, 0.85)",
        dark: "rgba(71, 85, 105, 0.4)",
      },
    },
    dynamicBg: {
      rain: { light: "#c7d2e0", dark: "#4a5568" },
      cloud: "#cbd5e1",
    },
    buttonGradients: {
      primary: {
        light: "from-[#5D737E] to-[#3F5561]",
        dark: "from-sky-800 to-blue-900",
      },
    },
    inputColors: {
      focusBorder: {
        light: "#5D737E",
        dark: "sky-500",
      },
      focusRing: {
        light: "rgba(93, 115, 126, 0.2)",
        dark: "rgba(14, 165, 233, 0.2)",
      },
    },
    linkColors: {
      hover: {
        light: "#5D737E",
        dark: "sky-300",
      },
    },
    textShadow: {
      light: "0 1px 1px rgba(255,255,255,0.5)",
      dark: "0 2px 4px rgba(0,0,0,0.3)",
    },
    borderRadius: {
      small: "rounded-xl",
      card: "rounded-2xl",
      modal: "rounded-3xl",
      full: "rounded-full",
    },
    spacing: {
      cardSmall: "p-3",
      card: "p-4",
      cardLarge: "p-5",
    },
    typography: {
      h1: {
        size: "text-2xl",
        weight: "font-bold",
        leading: "leading-tight",
        class: "text-2xl font-bold leading-tight",
      },
      h2: {
        size: "text-xl",
        weight: "font-bold",
        leading: "leading-snug",
        class: "text-xl font-bold leading-snug",
      },
      h3: {
        size: "text-lg",
        weight: "font-semibold",
        leading: "leading-normal",
        class: "text-lg font-semibold leading-normal",
      },
      body: {
        size: "text-base",
        weight: "font-normal",
        leading: "leading-relaxed",
        class: "text-base font-normal leading-relaxed",
      },
      caption: {
        size: "text-sm",
        weight: "font-normal",
        leading: "leading-normal",
        class: "text-sm font-normal leading-normal",
      },
      label: {
        size: "text-xs",
        weight: "font-medium",
        leading: "leading-tight",
        class: "text-xs font-medium leading-tight",
      },
    },
    shadows: {
      subtle: "shadow-sm",
      card: "shadow-md",
      elevated: "shadow-lg",
      modal: "shadow-xl",
      inner: "shadow-inner",
      none: "shadow-none",
    },
    transitions: {
      fast: "transition-all duration-150 ease-out",
      normal: "transition-all duration-300 ease-in-out",
      slow: "transition-all duration-500 ease-in-out",
      colors: "transition-colors duration-300 ease-in-out",
    },
    interactions: {
      hover: "hover:scale-105",
      active: "active:scale-95",
      focus: "focus:outline-none focus:ring-2 focus:ring-offset-2",
      disabled: "disabled:opacity-50 disabled:cursor-not-allowed",
    },
    voiceButton: {
      chinese: {
        active: {
          light: "bg-[#5D737E] border-[#4A606A] text-white",
          dark: "bg-[#5D737E] border-[#4A606A] text-white",
        },
        inactive: {
          light: "bg-white text-[#5D737E] border-stone-200 hover:bg-stone-50",
          dark: "bg-stone-800 text-sky-400 border-stone-600 hover:bg-stone-700",
        },
      },
      foreign: {
        active: {
          light: "bg-rose-400 border-rose-500 text-white",
          dark: "bg-rose-400 border-rose-500 text-white",
        },
        inactive: {
          light: "bg-white text-[#BC8F8F] border-stone-200 hover:bg-stone-50",
          dark: "bg-neutral-800 text-rose-300 border-neutral-600 hover:bg-neutral-700",
        },
      },
    },
    componentStyles: {
      itineraryCard: {
        light:
          "bg-white/85 backdrop-blur-lg backdrop-saturate-180 border border-white/30 rounded-2xl shadow-lg shadow-black/5",
        dark: "bg-[#1F1F1F]/92 backdrop-blur-lg backdrop-saturate-180 border border-white/15 rounded-2xl shadow-xl shadow-black/40",
      },
      navButton: {
        light:
          "bg-white/25 backdrop-blur-3xl backdrop-saturate-150 border border-white/20 rounded-xl hover:bg-white/35 transition-all duration-300",
        dark: "bg-[#2A2A2A]/50 backdrop-blur-3xl backdrop-saturate-150 border border-white/10 rounded-xl hover:bg-[#3A3A3A]/60 transition-all duration-300",
      },
      navContainer: {
        light: "bg-gradient-to-r from-white/10 via-white/5 to-white/10",
        dark: "bg-gradient-to-r from-[#2A2A2A]/40 via-[#1F1F1F]/30 to-[#2A2A2A]/40",
      },
      chatUserBubble: {
        light: "bg-[#5D737E] text-white shadow-md",
        dark: "bg-sky-800 text-white shadow-lg",
      },
      chatModelBubble: {
        light:
          "bg-white/88 backdrop-blur-lg border border-white/25 text-stone-700 shadow-md shadow-black/4",
        dark: "bg-neutral-800/88 backdrop-blur-lg border border-white/12 text-neutral-200 shadow-lg shadow-black/50",
      },
      chatContainer: {
        light: "bg-[#F9F9F6]/80",
        dark: "bg-black/30 backdrop-blur-sm",
      },
      infoCard: {
        light:
          "bg-white/80 backdrop-blur-md border border-white/25 rounded-2xl shadow-md",
        dark: "bg-[#262626]/85 backdrop-blur-md border border-white/12 rounded-2xl shadow-lg",
      },
      tagBase: {
        light:
          "rounded-full px-3 py-1 text-sm font-medium shadow-sm backdrop-blur-sm",
        dark: "rounded-full px-3 py-1 text-sm font-medium shadow-md backdrop-blur-sm",
      },
      inputField: {
        light:
          "bg-white/70 backdrop-blur-sm border border-stone-200/50 rounded-xl focus:border-[#5D737E] focus:ring-2 focus:ring-[#5D737E]/20",
        dark: "bg-[#262626]/60 backdrop-blur-sm border border-white/10 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20",
      },
      buttonPrimary: {
        light:
          "bg-gradient-to-br from-[#5D737E] to-[#3F5561] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all",
        dark: "bg-gradient-to-br from-sky-700 to-blue-900 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all",
      },
      buttonSecondary: {
        light:
          "bg-white/40 backdrop-blur-md border border-white/25 hover:bg-white/50 active:scale-95 transition-all",
        dark: "bg-[#2A2A2A]/50 backdrop-blur-md border border-white/10 hover:bg-[#3A3A3A]/60 active:scale-95 transition-all",
      },
      modalBackdrop: {
        light: "bg-black/20 backdrop-blur-sm",
        dark: "bg-black/50 backdrop-blur-sm",
      },
      modalContent: {
        light:
          "bg-white/95 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl",
        dark: "bg-[#1F1F1F]/98 backdrop-blur-lg border border-white/15 rounded-3xl shadow-2xl shadow-black/50",
      },
      divider: {
        light: "border-stone-200/30",
        dark: "border-white/10",
      },
      cardHover: {
        light:
          "hover:shadow-xl hover:shadow-black/8 transition-all duration-300",
        dark: "hover:shadow-2xl hover:shadow-black/60 transition-all duration-300",
      },
      loadingOverlay: {
        light: "bg-white/60 backdrop-blur-md",
        dark: "bg-[#1F1F1F]/80 backdrop-blur-md",
      },
      toastSuccess: {
        light: "bg-emerald-50/90 border border-emerald-200/50 text-emerald-800",
        dark: "bg-emerald-900/30 border border-emerald-500/30 text-emerald-200",
      },
      toastWarning: {
        light: "bg-amber-50/90 border border-amber-200/50 text-amber-800",
        dark: "bg-amber-900/30 border border-amber-500/30 text-amber-200",
      },
      toastError: {
        light: "bg-red-50/90 border border-red-200/50 text-red-800",
        dark: "bg-red-900/30 border border-red-500/30 text-red-200",
      },
      mainBackground: {
        light: "bg-gradient-to-br from-[#F5F7FA] via-[#FDFBF7] to-white",
        dark: "bg-gradient-to-br from-[#0F0F0F] via-[#1A1A1A] to-[#1F1F1F]",
      },
      pageContainer: {
        light: "bg-[#F5F7FA] text-stone-800",
        dark: "bg-[#0F0F0F] text-neutral-200",
      },
    },
  },

  language: {
    code: "ko-KR",
    label: "韓",
    name: "韓文",
  },
};

// ============================================================================
// 6. 行前檢查清單 (Pre-departure checklist)
// ============================================================================
export const checklistData = [
  { id: 1, text: "護照 (效期6個月以上)", checked: false },
  { id: 2, text: "Q-CODE / 入境卡截圖 (若有填)", checked: false },
  { id: 3, text: "E-SIM / 網卡開通", checked: false },
  { id: 4, text: "WOWPASS / T-money 交通卡", checked: false },
  { id: 5, text: "轉接頭 (韓國是圓孔 Type C/F)", checked: false },
  { id: 6, text: "韓幣現金 (少量) & 信用卡 (確認海外開通)", checked: false },
  { id: 7, text: "旅遊保險 (包含不便險/醫療)", checked: false },
  { id: 8, text: "Naver Map / Kakao T App 下載與註冊", checked: false },
  { id: 9, text: "常備藥物 (胃藥、感冒、OK繃)", checked: false },
  { id: 10, text: "各類充電器 & 行動電源", checked: false },
  { id: 11, text: "Visit Busan Pass 憑證 (若有買)", checked: false },
  { id: 12, text: "Sky Capsule 預約憑證", checked: false },
];
