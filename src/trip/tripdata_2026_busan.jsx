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
    summary: "依使用時數或景點次數選票，先比較想去的景點再購買。",
    steps: [
      "先在 VBP 官網核對票種、適用景點與使用期限，再選擇官方或授權通路購買。",
      "實體票依訂單指定地點兌換；交通卡功能須另外儲值，不包含在景點權益內。",
      "電子版：下載 App 綁定憑證，入場出示 QR Code。",
      "時數型票券於首次使用適用景點時開始計時；次數型票券另按該票種規則使用。",
      "海濱列車與天空膠囊是不同產品；持 VBP 仍須確認景點權益、兌票方式與另行預約需求。",
    ],
    link: {
      text: "VBP 官網與景點列表",
      url: "https://www.visitbusanpass.com/",
    },
    blogs: [],
  },
  {
    title: "韓國入境申報與 Q-CODE",
    icon: <QrCode className="w-5 h-5" />,
    summary: "先區分入境申報、K-ETA 與健康檢疫，依適用條件準備。",
    steps: [
      "先在韓國 e-Arrival Card 官網確認是否屬申報對象，並核對 K-ETA 或簽證資格。",
      "適用電子入境申報者，可自抵達韓國前三天起免費填寫；完成後保存申報編號與確認信。",
      "Q-CODE 是健康檢疫申報，不能取代入境卡；依當季檢疫地區、旅遊史及症狀判斷是否須申報。",
      "準備護照、住宿地址、航班與回程資料，入境時依檢疫及移民官指示辦理。",
    ],
    link: {
      text: "韓國電子入境申報官方指南",
      url: "https://www.e-arrivalcard.go.kr/portal/guide/eacGuide.do?locale=E",
    },
    blogs: [
      {
        title: "KDCA｜Q-CODE 官方公告與適用條件",
        url: "https://qcode.kdca.go.kr/qco/bbs/BD_selectBbsList.do?q_bbsSn=1016",
      },
    ],
  },
  {
    title: "機場交通 (金海機場 ⇄ 市區)",
    icon: <Train className="w-5 h-5" />,
    summary: "輕軌、機場巴士或計程車的選擇。",
    steps: [
      "輕軌 (Light Rail)：機場站 → 沙上站 (轉乘地鐵2號線) → 西面/海雲台。便宜但不適合大行李。",
      "機場巴士依當日路線、停靠站與時刻搭乘；不要將海雲台班次當成西面飯店直達車。",
      "計程車：依指標排隊。一般計程車 (銀/白/橘) 或模範計程車 (黑)。三人以上建議搭車。",
      "Uber (UT)：可直接叫車，綁定海外信用卡扣款。",
    ],
    link: {
      text: "金海機場交通指南",
      url: "https://www.airport.co.kr/gimhaeeng/cms/frCon/index.do?CONTENTS_NO=1&MENU_ID=110",
    },
    blogs: [],
  },
  {
    title: "Naver Map 使用指南",
    icon: <Map className="w-5 h-5" />,
    summary: "以 Naver Map 核對韓國境內的大眾交通與步行路線。",
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
    blogs: [],
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
    date: "7/2 (四)",
    title: "抵達釜山：豬肉湯飯與西面逛街",
    intro:
      "抵達後先安頓行李，以一碗熱湯飯展開旅程。下午留在西面附近散步採買，讓通關、換匯與入住都有餘裕。",
    stay: "Lotte Hotel Busan (西面)",
    routeInfo: {
      summary: "金海機場 → 飯店放行李 → 豬肉湯飯 → 西面商圈",
      mapUrl:
        "https://www.google.com/maps/dir/?api=1&origin=35.1732,128.9464&destination=35.1578,129.06&waypoints=35.1565,129.0558%7C35.1548,129.0592&travelmode=transit",
    },
    events: [
      {
        time: "10:50",
        title: "抵達金海機場 (PUS)",
        mapQuery: "金海國際機場",
        lat: 35.1732,
        lon: 128.9464,
        icon: <Plane />,
        desc: "抵達後依序完成檢疫、入境與行李提領。先準備適用的入境申報資料，再依訂單領取通行證或儲值交通卡。",
        tips: [
          "機場換匯匯率較差，建議先換少量韓元搭車，去西面再在大額換匯。",
          "便利商店可買 T-money 卡。",
        ],
      },
      {
        time: "12:00",
        title: "交通：機場 → 西面",
        mapQuery: "西面站",
        lat: 35.1578,
        lon: 129.06,
        icon: <Train />,
        desc: "前往市區飯店。",
        transport: {
          mode: "計程車 或 輕軌轉地鐵",
          duration: "約 45–60 分鐘，另留候車時間",
          route: "金海機場 → 樂天飯店 (西面)",
          note: "行李較多可從正式排班區搭計程車，依跳表及道路狀況計費；搭軌道交通則於沙上轉地鐵 2 號線往西面。",
        },
      },
      {
        time: "13:00",
        title: "飯店寄放行李 & 換錢",
        mapQuery: "Lotte Hotel Busan",
        lat: 35.1565,
        lon: 129.0558,
        icon: <Hotel />,
        desc: "先至釜山樂天飯店寄放行李。隨後前往西面換錢所換韓幣。",
        tips: [
          "老奶奶換錢所 / 那英換錢所：位於西面市場巷弄內，匯率通常不錯。",
          "先確認店家接受的幣別與匯率，換匯後當場點清金額。",
        ],
      },
      {
        time: "14:30",
        title: "午餐：松亭3代豬肉湯飯",
        mapQuery: "西面豬肉湯飯一條街",
        lat: 35.1548,
        lon: 129.0592,
        icon: <Utensils />,
        desc: "以西面豬肉湯飯作為抵達後的第一餐，依口味加入韭菜與蝦醬；帶孩子用餐可先詢問不加辣的作法。",
        highlights: [
          "松亭3代 (70年老店) 或 秀玲豬肉湯飯。",
          "吃法：加入韭菜、蝦醬調味，麵線先丟進去吃。",
          "★ 兒童友善：可請阿姨不要加辣醬 (다대기 빼주세요)，另可單點白切肉給小朋友吃。",
        ],
      },
      {
        time: "16:00",
        title: "西面地下街 & 百貨商圈",
        mapQuery: "西面地下街",
        lat: 35.1578,
        lon: 129.06,
        icon: <ShoppingBag />,
        desc: "沿地下街與百貨慢慢逛，穿插飲水與休息。傍晚回飯店辦理入住，再於西面商圈安排晚餐。",
        tips: [
          "NC百貨：平價好逛，有多款童裝及 Shoopen 特價鞋子。",
          "樂天百貨 釜山總店：可逛免稅店或高階美妝品牌。",
          "地下街：童裝與女裝選擇多，價格實惠。",
        ],
      },
    ],
  },
  {
    day: "Day 2",
    locationKey: "haeundae",
    date: "7/3 (五)",
    title: "機張海線：天空膠囊、購物與滑車",
    intro:
      "沿著海岸搭膠囊列車，在青沙浦看海，再轉往東釜山用餐與採買。下午的滑車依家人年齡、身高與體力安排。",
    stay: "Lotte Hotel Busan (西面)",
    routeInfo: {
      summary:
        "尾浦站 (膠囊列車) → 青沙浦 → 樂天 Premium Outlet 東釜山店 → Skyline Luge",
      mapUrl:
        "https://www.google.com/maps/dir/?api=1&origin=35.1633,129.1837&destination=35.161,129.1605&waypoints=35.1608,129.1931%7C35.193,129.213%7C35.195,129.215&travelmode=driving",
    },
    events: [
      {
        time: "09:30",
        title: "交通：前往海雲台 Blue Line Park",
        mapQuery: "Blue Line Park 尾浦站",
        lat: 35.1633,
        lon: 129.1837,
        icon: <Train />,
        desc: "搭乘地鐵2號線至中洞站或海雲台站，轉計程車至尾浦站。",
        transport: {
          mode: "地鐵 + Taxi",
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
        desc: "釜山超人氣打卡點！可愛的彩色小車，非常適合親子同樂看海。",
        highlights: [
          "路線：尾浦 (Mipo) → 青沙浦 (Cheongsapo)。",
          "車程約 30 分鐘，車廂獨立，可盡情拍照。",
        ],
        tips: [
          "事先在官網確認開放售票日、出發站與搭乘時段；天空膠囊須另確認票券，不能直接以 VBP 取代預約。",
        ],
      },
      {
        time: "11:30",
        title: "抵達青沙浦 & 轉乘至東釜山",
        mapQuery: "青沙浦",
        lat: 35.1608,
        lon: 129.1931,
        icon: <Train />,
        desc: "在青沙浦紅白燈塔拍完照後，直接搭計程車前往機張東釜山區。",
        transport: {
          mode: "計程車",
          duration: "約 20–30 分鐘，依路況調整",
          route: "青沙浦 → 樂天 Premium Outlet",
        },
      },
      {
        time: "12:00",
        title: "午餐與購物：東釜山 Outlet",
        mapQuery: "樂天 Premium Outlet 東釜山店",
        lat: 35.193,
        lon: 129.213,
        icon: <ShoppingBag />,
        desc: "中午在東釜山 Outlet 用餐與採買，先找好集合點，再依家人的興趣分區逛。為下午滑車預留移動與報到時間。",
        highlights: [
          "運動品牌：Nike, Adidas 款式齊全常有折扣。",
          "兒童專區：除了買童裝，附近也有旋轉木馬等小型遊樂設施。",
        ],
      },
      {
        time: "15:30",
        title: "親子放電：Skyline Luge 斜坡滑車",
        mapQuery: "Skyline Luge 釜山",
        lat: 35.195,
        lon: 129.215,
        icon: <Star />,
        desc: "前往機張的 Skyline Luge，先聽取操作說明，再搭吊椅上山體驗滑車。排隊、裝備與練習都要計入停留時間。",
        tips: [
          "單獨搭乘須同時符合至少 6 歲及身高 110cm，並由現場人員確認；未滿 85cm 不可搭乘。",
          "共乘須另確認兒童票、身高條件及成人監護人資格。未能搭乘的家人可改為休息，不臨時加排另一座主題樂園。",
        ],
      },
      {
        time: "18:00",
        title: "晚餐：海雲台味贊王鹽烤肉",
        mapQuery: "味贊王鹽烤肉 海雲台",
        lat: 35.161,
        lon: 129.1605,
        icon: <Utensils />,
        desc: "返回海雲台用晚餐，以烤肉與米飯為一天收尾；若候位較久，可改選附近其他餐廳。",
        tips: [
          "專人代烤，不用自己動手，非常適合帶小孩的家庭。",
          "可搭配米飯與湯品，點餐時先確認份量與是否含辣。",
        ],
      },
    ],
  },
  {
    day: "Day 3",
    locationKey: "gwangalli",
    date: "7/4 (六)",
    title: "水族館、新世界百貨與無人機秀",
    intro:
      "上午走進海底世界，下午回到室內用餐與休息。晚上再前往廣安里，讓城市海景與無人機表演為一天收尾。",
    stay: "Lotte Hotel Busan (西面)",
    routeInfo: {
      summary: "SEA LIFE 水族館 → Centum City 用餐與購物 → 廣安里",
      mapUrl:
        "https://www.google.com/maps/dir/?api=1&origin=35.159,129.16&destination=35.1532,129.1186&waypoints=35.169,129.1293&travelmode=transit",
    },
    events: [
      {
        time: "10:00",
        title: "親子首選：SEA LIFE 釜山水族館",
        mapQuery: "SEA LIFE 釜山水族館",
        lat: 35.159,
        lon: 129.16,
        icon: <Star />,
        desc: "在海雲台沙灘旁安排室內海洋生物觀察，避開中午日曬；午餐與前往 Centum City 的交通另留時間。",
        highlights: [
          "入館後先查看當日活動與餵食時刻，再安排海洋生物展區。",
          "海底隧道與透明玻璃船 (需另購票) 體驗。",
        ],
      },
      {
        time: "13:30",
        title: "新世界百貨 Centum City：用餐與購物",
        mapQuery: "新世界百貨 Centum City",
        lat: 35.169,
        lon: 129.1293,
        icon: <ShoppingBag />,
        desc: "在 Centum City 用餐、逛街與休息。今天晚間安排廣安里，下午以能彈性離開的活動為主。",
        highlights: [
          "KidZania 須另購票並核對場次；若要完整體驗，應改排半天行程，避免與晚間廣安里活動互相壓縮。",
          "購物與甜點可依興趣分組安排，先約好會合地點。",
          "Spa Land 有兒童入場與陪同規則，請先核對館方條件；不作為幼童通用備案。",
        ],
      },
      {
        time: "17:30",
        title: "晚餐：廣安里海邊",
        mapQuery: "廣安里海灘",
        lat: 35.1532,
        lon: 129.1186,
        icon: <Utensils />,
        desc: "離開百貨搭乘地鐵至廣安里。可選擇海邊的餐廳或比薩店。",
        tips: ["推薦 Mad Dogs (芝加哥比薩)，小朋友通常很喜歡！"],
      },
      {
        time: "19:30",
        title: "廣安里 M 無人機秀 (週六限定)",
        mapQuery: "廣安里海水浴場",
        lat: 35.1532,
        lon: 129.1186,
        icon: <Star />,
        desc: "依夏季常態安排，週六 20:00、22:00 於廣安里海邊演出；親子行程可優先看第一場，再依體力決定返程。",
        tips: [
          "出發前查看主辦方當日公告；雨勢、強風或通訊狀況可能造成延後或取消。",
        ],
      },
    ],
  },
  {
    day: "Day 4",
    locationKey: "nampo",
    date: "7/5 (日)",
    title: "文化探索：甘川洞與南浦洞",
    intro:
      "從山城的彩色街屋走到松島海岸，再回南浦商圈吃小吃。坡路與階梯較多，散策路段依同行家人的體力選擇。",
    stay: "Lotte Hotel Busan (西面)",
    routeInfo: {
      summary: "甘川洞文化村 → 松島纜車 → BIFF廣場 → 富平罐頭市場",
      mapUrl:
        "https://www.google.com/maps/dir/?api=1&origin=35.0975,129.0106&destination=35.1011,129.0238&waypoints=35.0768,129.0205%7C35.0986,129.0267&travelmode=transit",
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
          "可先在遊客中心了解地圖與散策路線，再依坡度與家人體力選擇路段。",
          "穿韓服：這裡全家穿韓服拍照非常有氛圍。",
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
          "龍宮雲橋與纜車是不同設施，先確認開放情況與各自票券。",
          "松島天空步道 (Skywalk)：免費的海上步道。",
        ],
        tips: [
          "使用 VBP 前，先核對當次票種適用的車廂、搭乘次數與兌票方式；水晶車廂及其他設施另依官方規則購票。",
        ],
      },
      {
        time: "16:00",
        title: "南浦洞 BIFF 廣場 & 光復路商圈",
        mapQuery: "BIFF 廣場",
        lat: 35.0986,
        lon: 129.0267,
        icon: <ShoppingBag />,
        desc: "沿 BIFF 廣場與光復路散步，將街頭小吃、服飾與文具採買穿插安排。",
        highlights: [
          "光復路時尚街：可挑選美妝與服飾，先比較款式、價格與付款方式。",
          "元祖黑糖餅：排隊名店，包堅果超好吃，小孩會喜歡的甜點。",
          "ARTBOX：南浦洞也有超大文具店，買可愛文具給小孩。",
        ],
      },
      {
        time: "18:00",
        title: "晚餐：富平市場與南浦小吃",
        mapQuery: "富平罐頭市場",
        lat: 35.1011,
        lon: 129.0238,
        icon: <Utensils />,
        desc: "在南浦商圈挑選晚餐；想吃市場小吃或豬腳都可就近安排，不必再跨區移動。",
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
    date: "7/6 (一)",
    title: "樂天超市掃貨、影島海景與搭機返台",
    intro:
      "上午完成伴手禮採買，下午視時間在白淺灘短暫看海。回程以領行李、準時報到為主，海景咖啡可彈性省略。",
    stay: "溫暖的家",
    routeInfo: {
      summary:
        "飯店 Check-out → 樂天超市光復店 → 白淺灘文化村 → 機場 → 飛往台北",
      mapUrl:
        "https://www.google.com/maps/dir/?api=1&origin=35.1565,129.0558&destination=35.1732,128.9464&waypoints=35.097,129.035%7C35.0788,129.0435%7C35.1565,129.0558&travelmode=driving",
    },
    events: [
      {
        time: "09:00",
        title: "飯店 Check-out & 寄放行李",
        mapQuery: "Lotte Hotel Busan",
        lat: 35.1565,
        lon: 129.0558,
        icon: <Hotel />,
        desc: "早上先退房並將行李寄放在飯店櫃台。",
      },
      {
        time: "10:00",
        title: "最後衝刺：樂天百貨與 Lotte Mart 超市",
        mapQuery: "樂天百貨光復店",
        lat: 35.097,
        lon: 129.035,
        icon: <ShoppingBag />,
        desc: "前往光復店商場與超市採買伴手禮，入館先查樓層導覽與營業時間，避免拖著戰利品反覆找路。",
        highlights: [
          "掃貨重點：海苔、韓國泡麵、Market O 零食、各式伴手禮。",
          "若商場當日有噴泉演出，可依現場時刻短暫停留，不為等待演出影響回程。",
          "購物時先詢問店家退稅方式，保存護照、收據與商品，依單據指示辦理。",
        ],
      },
      {
        time: "13:00",
        title: "午餐：南浦洞或百貨內美食街",
        mapQuery: "樂天百貨光復店",
        lat: 35.097,
        lon: 129.035,
        icon: <Utensils />,
        desc: "購物完畢後，就近在百貨地下街或南浦商圈吃午餐。",
      },
      {
        time: "14:30",
        title: "影島白淺灘文化村：海景小歇",
        mapQuery: "白淺灘文化村",
        lat: 35.0788,
        lon: 129.0435,
        icon: <Coffee />,
        desc: "視行李、路況與剩餘時間，在白淺灘上方街區短暫看海。若上午採買延後，就省略此站，優先回飯店領行李。",
        tips: ["推著嬰兒車不方便走階梯，建議在上面大路的咖啡廳看海即可。"],
      },
      {
        time: "15:30",
        title: "回飯店拿行李，前往金海機場 (PUS)",
        mapQuery: "金海國際機場",
        lat: 35.1732,
        lon: 128.9464,
        icon: <Train />,
        desc: "從白淺灘返回西面飯店領取行李，再前往機場；以起飛前約三小時抵達為目標，班機與報到期限請核對訂單。",
        transport: {
          mode: "計程車 或 輕軌轉地鐵",
          duration: "約 45–60 分鐘，另留候車時間",
          route: "白淺灘 → 西面飯店取行李 → 金海機場",
        },
      },
      {
        time: "16:45",
        title: "機場報到、退稅與候機",
        mapQuery: "金海機場免稅店",
        lat: 35.1732,
        lon: 128.9464,
        icon: <ShoppingBag />,
        desc: "先完成航空公司報到，需海關查驗的退稅商品先依指示處理，再交付託運行李。完成安檢與出境後，確認登機門再用餐或採買。",
        highlights: [
          "7-11：把交通卡餘額花完的好地方。",
          "免稅店：雪花秀、正官庄人蔘。",
        ],
      },
      {
        time: "19:50",
        title: "搭機返台",
        mapQuery: "金海國際機場",
        lat: 35.1732,
        lon: 128.9464,
        icon: <Plane />,
        desc: "搭乘 CI187 班機，再見釜山！",
        transport: {
          mode: "飛機",
          duration: "約 2 小時 10 分鐘",
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
  id: "2026_busan",
  title: "韓國釜山親子之旅",
  timeZone: "Asia/Seoul",
  currency: {
    code: "krw",
    label: "韓元",
    source: "KRW",
    target: "TWD",
  },
  subTitle: "2026/7/2 - 7/6",
  startDate: "2026-07-02T00:00:00",

  endDate: "2026-07-06T23:59:59",

  // ========== 網站 Meta 設定 (動態標題) ==========
  meta: {
    title: "韓國釜山親子之旅",
    shortName: "釜山親子之旅",
    description: "韓國釜山親子旅遊行程助手",
    ogImage: "https://fcwi.github.io/trip_agent/icon-512.png",
  },

  // ========== 航班資訊 (範例) ==========
  flights: {
    outbound: {
      code: "中華航空 CI188",
      time: "07:40 TPE ➝ 10:50 PUS",
    },
    inbound: {
      code: "中華航空 CI187",
      time: "19:50 PUS ➝ 21:00 TPE",
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
    "SEA LIFE 水族館",
    "Luge 斜坡滑車",
    "Lotte 購物掃貨",
    "廣安里無人機秀",
    "甘川洞尋找小王子",
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
  { id: 2, text: "核對電子入境卡、K-ETA／簽證與適用檢疫申報", checked: false },
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
