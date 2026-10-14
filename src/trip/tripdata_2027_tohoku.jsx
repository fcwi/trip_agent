/**
 * ============================================================================
 * 行程資料檔案 (Trip Data Only) - 2027 東北／森吉（阿仁）樹冰五日
 * ============================================================================
 *
 * 可樂森吉樹冰團（阿仁／森吉），不是藏王樹冰。
 * 日序以手冊 v11／Top5 B 為準。未擴充 schema。
 *
 * 結構、主題與 `theme.componentStyles` 自 `src/trip/tripdata_2026_karuizawa.jsx`
 * 整檔複製；僅替換旅程內容。
 *
 * 【匯出項目】
 * - `guidesData`      : 行前指南與購票流程
 * - `usefulLinks`     : 分類的參考連結 (交通、天氣、購物、緊急...)
 * - `shopGuideData`   : 各區域商店與購物建議
 * - `itineraryData`   : 每日行程與事件列表
 * - `tripConfig`      : 全域設定 (標題、日期、飯店、主題等)
 * - `checklistData`   : 行前檢查清單 (可用於 todo / checkbox UI)
 *
 * 【修改指南】
 * 若要改為其他行程，請依序調整以下內容：
 * 1. 修改 tripConfig 中的基本資訊 (標題、日期、飯店名稱、地點等)
 * 2. 更新 itineraryData 中的每日行程 (日期、地點、事件時間、交通)
 * 3. 替換 shopGuideData 中的景點與商店資訊
 * 4. 新增/刪除 usefulLinks 中的相關連結
 * 5. 根據新行程調整 guidesData 中的實用指南
 * 6. 更新 checklistData 中的行前檢查項目
 *
 * ============================================================================
 */

import React from "react";
import {
  Train,
  Plane,
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
} from "lucide-react";

// ============================================================================
// 1. 指南資料 (Guides)
// ============================================================================
//
// 旅行前的實用指南與購票/入場流程說明，僅為參考。
//
// 【資料結構】
// {
//   title         : 指南標題
//   icon          : Lucide React 圖示
//   summary       : 簡短說明
//   steps         : 步驟陣列 (循序說明)
//   link          : { text: "連結文字", url: "網址" }
//   blogs         : 相關部落格連結陣列
// }
//
export const guidesData = [
  {
    title: "旅程資訊與出發準備",
    icon: <Map className="w-5 h-5" />,
    summary:
      "五天串起山形溫泉、秋田雪景與宮城海灣。出發前將重要資料收進手機，旅途中即可隨時查閱。",
    steps: [
      "核對出發通知上的航班、航廈與團體集合時間。",
      "保存每晚住宿地址、領隊聯絡方式及電子行程。",
      "預覽每日路線，將雪地裝備與證件分開收納。",
    ],
    link: {
      text: "旅行社行程參考",
      url: "https://tour.colatour.com.tw/itinerary?PatternNo=243740",
    },
    blogs: [],
  },
  {
    title: "Visit Japan Web 入境申報",
    icon: <QrCode className="w-5 h-5" />,
    summary: "提前準備入境審查與海關申報資料，抵達後依現場指示通關。",
    steps: [
      "登入官方網站，登錄本人與適用的同行家人資料。",
      "依出發通知填寫實際航班與住宿資訊。",
      "完成申報並保存可使用的 QR Code，出發前再次核對資料。",
    ],
    link: {
      text: "Visit Japan Web 官方說明",
      url: "https://vjw-lp.digital.go.jp/zh-hant/",
    },
    blogs: [],
  },
  {
    title: "免稅購物與回程確認",
    icon: <ShoppingBag className="w-5 h-5" />,
    summary:
      "本次旅程在新免稅制度實施後：先支付含稅金額，完成海關持出確認後，由店家或其指定業者辦理退款。",
    steps: [
      "購物前向店家確認免稅資格、購買門檻及退款方式。",
      "保存購物紀錄，讓護照與需查驗商品保持可取用。",
      "購買後須於規定期限內完成持出確認；機場查驗流程依現場指示。",
      "若商品需託運，先確認海關查驗安排，再交付行李。",
      "預留查驗、託運與登機時間；確認持出不等於當場領取退款。",
    ],
    link: {
      text: "日本國稅廳｜新免稅制度",
      url: "https://www.nta.go.jp/publication/pamph/shohi/menzei/201805/format/002.htm",
    },
    blogs: [],
  },
  {
    title: "冬季活動與雪地安全",
    icon: <AlertCircle className="w-5 h-5" />,
    summary:
      "樹冰、纜車、鐵道與遊船都受天候影響。依領隊與現場人員的指示，安心欣賞冬日景色。",
    steps: [
      "森吉山樹冰安排於第三天，景觀形態與能見度依氣候變化。",
      "纜車、雪上活動或遊船如有調整，依領隊通知參加替代安排。",
      "銀山與角館步行時放慢腳步，避免在結冰路面奔跑。",
      "乘船及雪地活動保持適當距離，沿開放路線活動。",
      "入浴前清洗身體，留意飯店規定並適時補充水分。",
    ],
    link: {
      text: "阿仁滑雪場｜營運資訊",
      url: "https://www.aniski.jp/",
    },
    blogs: [],
  },
  {
    title: "雪國穿搭與隨身裝備",
    icon: <Snowflake className="w-5 h-5" />,
    summary:
      "分層保暖、阻擋風雪，也讓室內外溫差更容易適應。乾爽的鞋襪與手套會讓冬季散策舒服許多。",
    steps: [
      "內層選快乾衣物，中層保暖，外層防風防水。",
      "準備防滑鞋、毛帽、圍巾、手套與備用襪。",
      "暖暖包依產品指示使用，避免直接長時間接觸皮膚。",
      "將濕衣物分開收納，休息時補充水分。",
    ],
    link: {
      text: "JNTO｜日本冬季旅行",
      url: "https://www.japan.travel/tw/guide/winter-guide/",
    },
    blogs: [],
  },
  {
    title: "讓旅程留些餘裕",
    icon: <Star className="w-5 h-5" />,
    summary:
      "留意窗外的雪景，也為熱食、休息與同行的片刻留些時間。旅行的記憶不只在照片裡。",
    steps: [
      "自由活動前確認集合地點與時間，購物後預留返回路程。",
      "車程中整理照片與充電，隨身準備小點心。",
      "遇天候調整時，跟隨團體安排，欣賞當日能看見的風景。",
      "外出或改變活動安排前，先與領隊確認。",
    ],
    link: {
      text: "JNTO｜東北觀光資訊",
      url: "https://www.japan.travel/tw/destinations/tohoku/",
    },
    blogs: [],
  },
  {
    title: "名取購物與扭蛋小提醒",
    icon: <Camera className="w-5 h-5" />,
    summary:
      "第五天在 AEON 名取安排購物。先挑想看的店，再把少量時間留給扭蛋或文具，從容回到集合點。",
    steps: [
      "先確認集合位置與停留時間，選擇一至兩個購物重點。",
      "設定扭蛋預算，重複角色可與同行旅伴交換。",
      "保留購物紀錄，確認食品保存期限及返國攜帶規定。",
      "返回機場前整理行李，將需查驗商品放在方便取用處。",
    ],
    link: {
      text: "AEON Mall 名取｜樓層資訊",
      url: "https://natori-aeonmall.com/",
    },
    blogs: [],
  },
  {
    title: "出發前確認清單",
    icon: <Briefcase className="w-5 h-5" />,
    summary: "將容易遺漏的旅行資訊集中確認，出發當天就能少些匆忙。",
    steps: [
      "護照效期、航班時刻、行李額度與集合地點。",
      "領隊聯絡方式、住宿地址與特殊餐食需求。",
      "雪地裝備、行動網路與充電用品。",
      "團體活動、自費項目及天候變更安排。",
    ],
    link: {
      text: "星宇航空｜行李資訊",
      url: "https://www.starlux-airlines.com/zh-TW/check-in-fly/baggage-information/general",
    },
    blogs: [],
  },
];

// ============================================================================
// 2. 參考連結 (Useful links)
// ============================================================================
//
// 將常用網站分類整理，方便快速查詢。
//
// 【資料結構】
// {
//   category   : 連結分類名稱 (交通、天氣、購物、緊急等)
//   items      : 連結項目陣列
// }
//
export const usefulLinks = [
  {
    category: "交通與工具",
    items: [
      {
        title: "Visit Japan Web",
        desc: "入境與海關申報（官方）",
        url: "https://vjw-lp.digital.go.jp/zh-hant/",
        icon: <QrCode className="w-5 h-5" />,
      },
      {
        title: "乘換案內 (Jorudan)",
        desc: "日本電車轉乘查詢中文版",
        url: "https://world.jorudan.co.jp/mln/zh-tw/",
        icon: <Train className="w-5 h-5" />,
      },
      {
        title: "JR 東日本訂票",
        desc: "新幹線／在來線參考",
        url: "https://www.eki-net.com/zh-CHT/jreast-train-reservation/Top/Index",
        icon: <Train className="w-5 h-5" />,
      },
      {
        title: "仙台空港",
        desc: "航廈交通與樓層（官方）",
        url: "https://www.sdj-airport.com/",
        icon: <Map className="w-5 h-5" />,
      },
      {
        title: "秋田內陸縱貫鐵道",
        desc: "微笑鐵道時刻（官方）",
        url: "https://www.akita-nairiku.com/",
        icon: <Train className="w-5 h-5" />,
      },
    ],
  },
  {
    category: "天氣與實用",
    items: [
      {
        title: "仙台天氣 (Tenki.jp)",
        desc: "宮城市區與沿海",
        url: "https://tenki.jp/forecast/5/18/3410/4100/",
        icon: <Sun className="w-5 h-5" />,
      },
      {
        title: "北秋田／森吉山天氣",
        desc: "阿仁樹冰日前查降雪與穿搭",
        url: "https://tenki.jp/forecast/2/8/3220/5213/",
        icon: <CloudSnow className="w-5 h-5" />,
      },
      {
        title: "Coin Locker Navi",
        desc: "尋找車站置物櫃",
        url: "https://www.coinlocker-navi.com/",
        icon: <Briefcase className="w-5 h-5" />,
      },
    ],
  },
  {
    category: "景點預約",
    items: [
      {
        title: "森吉山阿仁ゴンドラ",
        desc: "阿仁スキー場樹冰／雪上活動",
        url: "https://www.aniski.jp/",
        icon: <Snowflake className="w-5 h-5" />,
      },
      {
        title: "木戶五郎兵衛村",
        desc: "橫手古民家／搗麻糬（官方）",
        url: "https://www.city.yokote.lg.jp/shisetsu/1001528/1008619.html",
        icon: <Star className="w-5 h-5" />,
      },
      {
        title: "銀山溫泉",
        desc: "溫泉街官方導覽",
        url: "https://www.ginzanonsen.jp/",
        icon: <Camera className="w-5 h-5" />,
      },
      {
        title: "猊鼻溪遊船",
        desc: "輕舟營運與停航資訊",
        url: "https://www.geibikei.co.jp/",
        icon: <Star className="w-5 h-5" />,
      },
    ],
  },
  {
    category: "購物與優惠",
    items: [
      {
        title: "AEON Mall 名取",
        desc: "樓層與營業時間",
        url: "https://natori-aeonmall.com/",
        icon: <ShoppingBag className="w-5 h-5" />,
      },
      {
        title: "日本退稅新制說明",
        desc: "觀光廳免稅制度入口",
        url: "https://www.mlit.go.jp/kankocho/tax-free/",
        icon: <ShoppingBag className="w-5 h-5" />,
      },
      {
        title: "松本清藥妝",
        desc: "店鋪搜尋與資訊",
        url: "https://www.matsukiyococokara-online.com/store/",
        icon: <ShoppingBag className="w-5 h-5" />,
      },
    ],
  },
  {
    category: "緊急與保險",
    items: [
      {
        title: "富邦產險理賠",
        desc: "旅遊不便險/旅平險官網",
        url: "https://www.fubon.com/insurance/home/",
        icon: <Shield className="w-5 h-5" />,
      },
      {
        title: "Tokio Marine 日動",
        desc: "VJW 推薦旅平險理賠 (中文)",
        url: "https://tokiomarinenichido.jp/zh-hant/china2/",
        icon: <Shield className="w-5 h-5" />,
      },
      {
        title: "JNTO 醫療指南",
        desc: "搜尋可對應外語的醫院",
        url: "https://www.jnto.go.jp/emergency/chc/mi_guide.html",
        icon: <AlertCircle className="w-5 h-5" />,
      },
    ],
  },
];

// ============================================================================
// 3. 商店與購物指南 (Shop guide)
// ============================================================================
//
// 各區域推薦店家、特色與附近連鎖店，方便安排行程與購物。
//
export const shopGuideData = [
  {
    area: "AEON 名取 (Day 5)",
    desc: "杜せきのした站直結，回程補貨首選",
    mapQuerySuffix: "イオンモール名取",
    mainShops: [
      { name: "AEON Style 名取", tag: "超市", note: "伴手禮食品一次買" },
      { name: "藥妝樓層", tag: "藥妝", note: "比免稅店好比價" },
      { name: "美食街", tag: "美食", note: "依自由活動時間安排用餐" },
    ],
    specialShops: [
      {
        name: "扭蛋與小物",
        tag: "玩具",
        note: "設定小額預算，留意集合時間",
      },
      { name: "LOFT", tag: "文具", note: "依可用時間挑選文具與雜貨" },
      {
        name: "退稅櫃台",
        tag: "退稅",
        note: "保存購物紀錄，確認查驗與退款方式",
      },
    ],
    nearbyChains: [
      { name: "Starbucks", location: "Mall 內" },
      { name: "7-Eleven", location: "杜せきのした站周邊" },
      { name: "Lawson", location: "Mall 周邊" },
    ],
  },
  {
    area: "仙台市區 (Day 4 晚／Day 5)",
    desc: "牛舌與一番町，時間看領隊",
    mapQuerySuffix: "仙台駅",
    mainShops: [
      { name: "牛舌街／駅前", tag: "美食", note: "利久、喜助等" },
      { name: "S-PAL 仙台", tag: "百貨", note: "車站直結" },
      { name: "藤崎／一番町", tag: "購物", note: "自由活動才走得完" },
    ],
    specialShops: [
      { name: "萩之月／支倉", tag: "伴手禮", note: "機場也有，市區可先看" },
      { name: "唐吉訶德仙台", tag: "雜貨", note: "請向領隊確認分店與停留" },
      { name: "Loft", tag: "文具", note: "請向領隊確認是否排入" },
    ],
    nearbyChains: [
      { name: "Starbucks", location: "仙台駅構內" },
      { name: "松屋", location: "駅前" },
      { name: "FamilyMart", location: "飯店周邊" },
    ],
  },
  {
    area: "松島 (Day 5)",
    desc: "五大堂與烤魚板；時間不夠可整段刪",
    mapQuerySuffix: "松島海岸",
    mainShops: [
      { name: "松島遊船賣店", tag: "伴手禮", note: "牡蠣／海產點心" },
      { name: "五大堂周邊", tag: "散策", note: "透橋拍照，路滑慢走" },
      { name: "日式點心", tag: "甜點", note: "點心品項與費用請詢問店家" },
    ],
    specialShops: [
      {
        name: "烤笹蒲鉾體驗",
        tag: "體驗",
        note: "阿部蒲鉾等；與 AEON 時間互搶",
      },
      { name: "牡蠣小屋", tag: "美食", note: "季節與團餐衝突時先跟領隊" },
    ],
    nearbyChains: [
      { name: "7-Eleven", location: "松島海岸駅前" },
      { name: "觀光案內所", location: "駅前" },
    ],
  },
  {
    area: "銀山／木戶／角館 (Day 2)",
    desc: "溫泉街、古民家搗麻糬與小京都，當日無樹冰",
    mapQuerySuffix: "角館 武家屋敷",
    mainShops: [
      { name: "武家屋敷通商店", tag: "雜貨", note: "樺細工（櫻樹皮）" },
      { name: "銀山溫泉街", tag: "散策", note: "瓦斯燈與木造旅館，路滑" },
      {
        name: "木戶五郎兵衛村",
        tag: "體驗",
        note: "搗麻糬＋古民家午餐，紀念品少",
      },
    ],
    specialShops: [
      { name: "角館和菓子", tag: "甜點", note: "停留短，看好再買" },
      { name: "銀山足湯／茶屋", tag: "體驗", note: "時間不夠就拍照離開" },
    ],
    nearbyChains: [
      { name: "JR 角館駅超商", location: "轉乘內陸線處" },
      { name: "自動販賣機", location: "銀山停車場一帶" },
    ],
  },
];

// ============================================================================
// 4. 行程核心資料 (Itinerary)
// ============================================================================
//
// 每日行程包含事件時間、地點、交通與小提醒，供 UI 呈現用。
// 事件時間多標「約」或「待領隊」，以商品頁／v11 為準。
//
export const itineraryData = [
  {
    day: "Day 1",
    locationKey: "tendo",
    date: "1/22 (五)",
    title: "仙台空港 → 天童／上山溫泉",
    intro: "從仙台落地，讓第一晚的溫泉與熱食替旅程暖身。",
    caption: "抵達東北，走進溫泉的暖意",
    stay: "天童／上山溫泉區",
    routeInfo: {
      summary: "桃園機場 → JX862 → 仙台空港 → 天童／上山溫泉區",
      mapUrl:
        "https://www.google.com/maps/dir/?api=1&origin=Sendai+Airport&destination=Tendo+Onsen",
    },
    events: [
      {
        time: "約 09:30",
        title: "桃園機場集合",
        mapQuery: "桃園國際機場",
        // Wikipedia 臺灣桃園國際機場：25.077758, 121.232822
        lat: 25.077758,
        lon: 121.232822,
        icon: <MapPin />,
        desc: "在桃園機場集合，辦理團體報到與行李託運。將護照、登機資料與入境申報備妥，從容展開旅程。",
        tips: [
          "核對出發通知上的航廈、櫃檯與集合時間。",
          "護照及入境申報 QR Code 放在隨身可取處。",
        ],
      },
      {
        time: "11:50",
        title: "班機：星宇 JX862",
        mapQuery: "桃園國際機場",
        // Wikipedia 臺灣桃園國際機場：25.077758, 121.232822
        lat: 25.077758,
        lon: 121.232822,
        icon: <Plane />,
        desc: "搭乘星宇航空前往仙台，旅程從空中展開。日本時間比台灣快一小時，抵達後請將手機時間切換至當地。",
        transport: {
          mode: "飛機",
          duration: "約 3 小時 10 分",
          route: "台北桃園 (TPE) → 仙台 (SDJ)",
          note: "團體座位依航空公司安排，同行旅客未必連座。",
        },
        tips: [
          "起飛與抵達時間以航空公司及出發通知為準。",
          "行動電源請放隨身行李，並遵守航空公司使用規定。",
        ],
      },
      {
        time: "約 16:00",
        title: "抵達仙台空港",
        mapQuery: "仙台空港",
        lat: 38.13694,
        lon: 140.9225,
        icon: <MapPin />,
        desc: "抵達仙台空港後，依序完成入境審查、領取行李與海關申報，再與領隊會合。",
        tips: [
          "確認行李件數後，依團體指示前往遊覽車。",
          "開通行動網路並保存領隊聯絡方式。",
        ],
      },
      {
        time: "約 17:30",
        title: "前往天童／上山溫泉",
        mapQuery: "天童温泉",
        // Wikipedia 天童駅：北緯 38.3599694、東経 140.3695028
        lat: 38.3599694,
        lon: 140.3695028,
        icon: <Hotel />,
        desc: "搭乘遊覽車前往山形的溫泉區。窗外逐漸轉為雪國風景，抵達飯店後先安頓行李，再享用晚餐。",
        transport: {
          mode: "遊覽車",
          duration: "",
          route: "仙台空港 → 天童／上山溫泉",
          note: "抵達時間依交通與領隊安排，請在上車前備妥隨身物品。",
        },
        tips: [
          "隨身攜帶保暖外套，方便下車時穿著。",
          "入住後確認用餐時間、大浴場位置與隔日集合時間。",
        ],
      },
      {
        time: "約 19:00",
        title: "晚餐與入住",
        mapQuery: "天童温泉",
        lat: 38.3599694,
        lon: 140.3695028,
        icon: <Utensils />,
        desc: "以一頓熱食與溫泉為旅程的第一天收尾。餐食依飯店安排，晚間留些時間休息，迎接翌日的雪中散策。",
        tips: [
          "入浴前先清洗身體，毛巾留在浴池外。",
          "留意飯店的入浴規定，泡湯後補充水分。",
        ],
      },
    ],
    notice: {
      type: "info",
      text: "抵達仙台後前往溫泉飯店。集合時間與住宿請依旅行社出發通知。",
    },
  },
  {
    day: "Day 2",
    locationKey: "ginzan",
    date: "1/23 (六)",
    title: "銀山溫泉 → 木戶五郎兵衛村 → 角館",
    intro: "走過雪中的銀山街屋、古民家與角館，讀一段東北的生活風景。",
    caption: "雪中街屋與古民家的冬日散策",
    stay: "田澤湖／雫石溫泉區",
    routeInfo: {
      summary: "飯店 → 銀山溫泉街 → 木戶五郎兵衛村（搗麻糬）→ 角館 → 飯店",
      mapUrl:
        "https://www.google.com/maps/dir/?api=1&origin=Ginzan+Onsen&destination=Kakunodate+Bukeyashiki&waypoints=Kido+Gorobei+Village+Yokote",
    },
    events: [
      {
        time: "約 08:30",
        title: "前往銀山溫泉",
        mapQuery: "銀山温泉",
        // Wikipedia 銀山温泉：北緯 38.5697、東経 140.5311
        lat: 38.5697,
        lon: 140.5311,
        icon: <Hotel />,
        desc: "早餐後前往銀山溫泉。今天將串起溫泉街、古民家與角館老街，在雪景中感受東北不同的生活風貌。",
        tips: [
          "穿著防滑鞋，手套與圍巾放在隨身包。",
          "確認停車處與返回遊覽車的集合時間。",
        ],
      },
      {
        time: "約 10:00",
        title: "銀山溫泉街散策",
        mapQuery: "銀山温泉",
        lat: 38.5697,
        lon: 140.5311,
        icon: <Camera />,
        desc: "沿著銀山川漫步，欣賞木造旅館、橋梁與街道細節。冬日積雪襯出溫泉街的輪廓，適合放慢腳步觀察。",
        tips: [
          "從橋邊拍攝河川與兩側旅館，注意避讓行人。",
          "步行與足湯體驗依現場開放情況安排。",
        ],
      },
      {
        time: "約 12:30",
        title: "木戶五郎兵衛村・古民家體驗",
        mapQuery: "木戸五郎兵衛村",
        // OSM node 11359797231「雄物川民家苑木戸五郎兵衛村」：39.2982401, 140.4327054
        lat: 39.2982401,
        lon: 140.4327054,
        icon: <Star />,
        desc: "走進橫手的古民家園區，近看茅草屋頂與傳統木構造。依團體安排參與搗麻糬體驗，並享用當日午餐。",
        transport: {
          mode: "遊覽車",
          duration: "",
          route: "銀山溫泉 → 木戶五郎兵衛村",
          note: "車程依道路狀況調整。園區內請注意防滑，體驗活動依工作人員指示操作。",
        },
        tips: [
          "搗麻糬時依工作人員節奏操作，注意與木槌保持距離。",
          "飲食過敏或特殊餐食需求請提前告知領隊。",
        ],
      },
      {
        time: "約 15:00",
        title: "角館武家屋敷",
        mapQuery: "角館 武家屋敷",
        // Wikipedia 角館駅（JR）：北緯 39.591722、東経 140.571000
        lat: 39.591722,
        lon: 140.571,
        icon: <MapPin />,
        desc: "漫步角館武家屋敷街，欣賞黑色板牆、庭院與歷史住宅。雪中的街道格外安靜，也可留意當地樺細工的細緻工藝。",
        tips: [
          "邸宅開放與入館費用各有不同，依現場安排參觀。",
          "路面可能結冰，拍照時先停穩腳步。",
        ],
      },
      {
        time: "約 18:00",
        title: "入住溫泉飯店",
        mapQuery: "田沢湖",
        lat: 39.591722,
        lon: 140.571,
        icon: <Utensils />,
        desc: "傍晚前往溫泉飯店，享用晚餐並放鬆休息。明天將前往森吉山，今晚先整理好雪地裝備。",
        tips: [
          "檢查手套、毛帽與備用襪，將濕衣物妥善晾乾。",
          "確認翌日早餐與集合時間。",
        ],
      },
    ],
    notice: {
      type: "info",
      text: "今天以雪地步行與文化體驗為主。穿著防滑鞋，依現場指示參觀。",
    },
  },
  {
    day: "Day 3",
    locationKey: "ani",
    date: "1/24 (日)",
    title: "阿仁／森吉樹冰＋秋田內陸線",
    intro: "把目光交給山上的樹冰與車窗外的雪原，感受秋田冬天的尺度。",
    caption: "雪山纜車與內陸鐵道的風景",
    stay: "溫泉飯店",
    routeInfo: {
      summary:
        "飯店 → 阿仁ゴンドラ／樹冰平＋雪上活動 → 內陸線（阿仁和⇄松葉）→ 飯店",
      mapUrl:
        "https://www.google.com/maps/dir/?api=1&origin=Ani+Ski+Resort+Moriyoshi&destination=Ani-Matagi+Station",
    },
    events: [
      {
        time: "約 08:30",
        title: "出發往阿仁／森吉",
        mapQuery: "森吉山阿仁スキー場",
        // Wikipedia 阿仁スキー場：北緯 39.95500、東経 140.49194
        lat: 39.955,
        lon: 140.49194,
        icon: <Snowflake />,
        desc: "前往森吉山阿仁滑雪場，準備迎接本次旅程的雪山風景。山區氣溫與風勢變化較大，上車前備妥防寒用品。",
        transport: {
          mode: "遊覽車",
          duration: "",
          route: "飯店 → 森吉山阿仁スキー場",
          note: "山區車程依道路狀況調整，請留意領隊通知的集合時間。",
        },
        tips: [
          "採用分層穿搭，隨身帶手套、毛帽與護目用品。",
          "先確認雪地裝備與活動安排，再前往纜車站。",
        ],
      },
      {
        time: "約 10:00",
        title: "阿仁纜車・森吉山樹冰",
        mapQuery: "阿仁ゴンドラ",
        lat: 39.955,
        lon: 140.49194,
        icon: <Snowflake />,
        desc: "搭乘阿仁纜車向雪山高處前進，單程約二十分鐘。天候合適時，可依現場指示步行欣賞樹冰；雪上活動依當日安排進行。",
        transport: {
          mode: "阿仁ゴンドラ",
          duration: "片道約 20 分鐘",
          route: "山麓駅 → 山頂駅／樹冰平",
          note: "樹冰景觀依天候而定。若纜車或雪上活動取消，替代行程及退費依旅行社說明。",
        },
        tips: [
          "山頂風勢較強，請沿開放路線活動並遵從工作人員指示。",
          "樹冰是自然景觀，形態與能見度隨氣候變化。",
        ],
      },
      {
        time: "約 12:30",
        title: "雪場午餐",
        mapQuery: "森吉山阿仁スキー場",
        lat: 39.955,
        lon: 140.49194,
        icon: <Utensils />,
        desc: "午間稍作休息，享用雪場餐食並補充熱量。餐點形式依團體安排，將手套與衣物整理乾爽後再繼續下午行程。",
        tips: ["休息時補充水分，留意濕襪與手套的保暖狀況。"],
      },
      {
        time: "約 14:00",
        title: "秋田內陸線（阿仁和⇄松葉）",
        mapQuery: "阿仁マタギ駅",
        // Wikipedia 阿仁マタギ駅（阿仁和站）：北緯 39.9195694、東経 140.5157000
        lat: 39.9195694,
        lon: 140.5157,
        icon: <Train />,
        desc: "搭乘秋田內陸線，從車窗欣賞雪原、森林與沿線聚落。預定乘車區間為阿仁和至松葉，實際方向及班次依團體安排。",
        transport: {
          mode: "秋田內陸縱貫鐵道",
          duration: "",
          route: "阿仁和（阿仁マタギ）⇄ 松葉",
          note: "班次較少，請隨團搭乘。停駛時由領隊說明替代交通與退費方式。",
        },
        tips: [
          "上車前確認乘車月台與集合時間。",
          "拍照時保持走道暢通，留意其他乘客。",
        ],
      },
      {
        time: "約 18:00",
        title: "返回飯店",
        mapQuery: "雫石プリンスホテル",
        lat: 39.9195694,
        lon: 140.5157,
        icon: <Hotel />,
        desc: "結束雪山與鐵道行程，返回飯店享用晚餐。讓身體暖起來，整理照片，也為隔天的採果與溪谷旅程留足精神。",
        tips: ["妥善晾乾雪地用品，備好隔日隨身衣物。"],
      },
    ],
    notice: {
      type: "warning",
      text: "山區行程依天候與纜車營運調整；如有變更，請依領隊通知參加替代安排。",
    },
  },
  {
    day: "Day 4",
    locationKey: "geibikei",
    date: "1/25 (一)",
    title: "草莓採果 → 猊鼻溪 → 仙台市區",
    intro: "從溫室裡的草莓香氣，到木舟上的溪谷風景，再回到仙台的街燈。",
    caption: "草莓、溪谷與仙台夜色",
    stay: "仙台市區",
    routeInfo: {
      summary: "飯店 → 草莓園 → 猊鼻溪 → 仙台市區",
      mapUrl:
        "https://www.google.com/maps/dir/?api=1&origin=Ichinoseki&destination=Sendai+Station&waypoints=Geibikei",
    },
    events: [
      {
        time: "約 08:30",
        title: "出發往草莓園",
        mapQuery: "一関 いちご狩り",
        // Wikipedia 一ノ関駅：北緯 38.926052、東経 141.139225（園區正確落點待核商品頁）
        lat: 38.926052,
        lon: 141.139225,
        icon: <Star />,
        desc: "早餐後出發前往草莓園，從雪景轉入溫室裡的暖意。園區與採果方式依團體預約和當日收成安排。",
        transport: {
          mode: "遊覽車",
          duration: "",
          route: "飯店 → 草莓園",
          note: "本日前往草莓園與猊鼻溪，再返回仙台。",
        },
        tips: [
          "依園區指示洗手與採摘，留意可食用及可攜出的規定。",
          "帶上方便活動的外套，進出溫室時調整穿著。",
        ],
      },
      {
        time: "約 10:30",
        title: "現採草莓吃到飽",
        mapQuery: "一関 いちご狩り",
        lat: 38.926052,
        lon: 141.139225,
        icon: <Star />,
        desc: "在溫室裡挑選成熟草莓，品嚐冬季果實的香氣與甜味。採果時間與供應品種依園區當日安排。",
        tips: [
          "挑選成熟果實，按照園區示範輕柔採摘。",
          "留意集合時間，採摘後維持園區整潔。",
        ],
      },
      {
        time: "約 11:30",
        title: "前往猊鼻溪",
        mapQuery: "猊鼻渓駅",
        lat: 38.9887792,
        lon: 141.2532381,
        icon: <Train />,
        desc: "前往岩手縣一關市的猊鼻溪。沿途稍作休息，抵達後準備近看溪谷岩壁與冬日水色。",
        transport: {
          mode: "遊覽車",
          duration: "",
          route: "草莓園 → 猊鼻溪",
          note: "遊船依天候營運；停航時請依領隊安排，確認替代行程與退費方式。",
        },
        tips: ["遊船是否營運及船型以現場公告為準。"],
      },
      {
        time: "約 12:30",
        title: "午餐",
        mapQuery: "猊鼻渓",
        lat: 38.9887792,
        lon: 141.2532381,
        icon: <Utensils />,
        desc: "在溪谷行程間享用午餐，補充熱量並稍作休息。餐廳與菜色依團體當日安排。",
        tips: ["用餐後確認登船與集合時間。"],
      },
      {
        time: "約 13:30",
        title: "猊鼻溪輕舟",
        mapQuery: "猊鼻渓",
        lat: 38.9865477,
        lon: 141.2650788,
        icon: <Camera />,
        desc: "乘坐木舟緩緩穿過猊鼻溪，從水面仰望陡峭岩壁，聆聽船夫的引導。冬季船型與保暖設備依現場營運安排。",
        tips: [
          "上下船依序進行，拍照時保持坐姿並聽從船夫指示。",
          "即使船上有保暖設備，仍請備妥帽子與手套。",
        ],
      },
      {
        time: "約 17:30",
        title: "入住仙台市區＋晚餐／逛街",
        mapQuery: "仙台駅",
        lat: 38.26028,
        lon: 140.88222,
        icon: <Hotel />,
        desc: "傍晚返回仙台市區，入住後享用晚餐。若有自由活動時間，可在車站周邊散步，感受東北城市的夜間節奏。",
        tips: [
          "餐食及自由活動時間依領隊通知。",
          "外出前保存飯店地址，留意返回時間。",
        ],
      },
    ],
    notice: {
      type: "info",
      text: "採草莓、遊猊鼻溪，晚間返回仙台。",
    },
  },
  {
    day: "Day 5",
    locationKey: "natori",
    date: "1/26 (二)",
    title: "松島散策 → 名取購物 → 仙台空港",
    intro: "沿海灣慢慢散步，帶回宮城的小滋味，為旅程收好最後一頁。",
    caption: "松島海灣與回程前的小採買",
    stay: "溫暖的家",
    routeInfo: {
      summary: "飯店 → 松島 → 笹蒲鉾體驗 → AEON 名取 → 仙台空港 → JX863",
      mapUrl:
        "https://www.google.com/maps/dir/?api=1&origin=Matsushima-Kaigan&destination=Sendai+Airport&waypoints=AEON+Mall+Natori",
    },
    events: [
      {
        time: "約 08:30",
        title: "退房出發",
        mapQuery: "仙台駅",
        lat: 38.26028,
        lon: 140.88222,
        icon: <Hotel />,
        desc: "早餐後退房，整理行李並前往松島。今天將安排海灣散策與購物，下午返回仙台空港。",
        tips: [
          "將護照、藥品與購物單據放在隨身包。",
          "離房前檢查充電器、衣物與房間保險箱。",
        ],
      },
      {
        time: "約 09:30",
        title: "松島散策",
        mapQuery: "松島海岸駅",
        // Wikipedia 松島海岸駅：北緯 38.368142、東経 141.058789
        lat: 38.368142,
        lon: 141.058789,
        icon: <Camera />,
        desc: "沿松島海灣散步，欣賞島嶼、松林與海岸景色。天氣清朗時，遠近島影層層相疊，呈現日本三景之一的冬日風貌。",
        tips: [
          "近看五大堂與周邊橋梁時，注意腳下與結冰路面。",
          "依當日停留時間安排步行範圍，準時返回集合處。",
        ],
      },
      {
        time: "約 10:30",
        title: "烤笹蒲鉾／魚板體驗",
        mapQuery: "阿部蒲鉾店 松島寺町店",
        // MapFan／松島観光ナビ：阿部蒲鉾店松島寺町店 38.3702743, 141.0605585
        lat: 38.3702743,
        lon: 141.0605585,
        icon: <Utensils />,
        desc: "體驗烤笹蒲鉾，品嚐宮城特色魚板。觀察魚板慢慢烤出香氣，為海灣散策添上一段溫暖的味覺記憶。",
        tips: [
          "操作烤架時留意熱源，依店員指示翻面。",
          "活動與用餐安排以團體當日通知為準。",
        ],
      },
      {
        time: "約 12:00",
        title: "AEON Mall 名取",
        mapQuery: "イオンモール名取",
        // Wikipedia イオンモール名取：北緯 38.163917、東経 140.895972
        lat: 38.163917,
        lon: 140.895972,
        icon: <ShoppingBag />,
        desc: "在 AEON Mall 名取挑選食品、藥妝與生活雜貨，替旅程帶回一些日常小物。也可安排短暫的扭蛋或文具購物。",
        tips: [
          "先確認集合位置與可用時間，再規劃購物動線。",
          "購買食品時留意保存期限及返國攜帶規定。",
          "保存免稅購物資料，預留機場手續時間。",
        ],
      },
      {
        time: "約 14:00",
        title: "前往仙台空港",
        mapQuery: "仙台空港",
        lat: 38.13694,
        lon: 140.9225,
        icon: <Train />,
        desc: "搭乘團體遊覽車前往仙台空港。抵達前整理護照、登機資料與購物單據，依領隊通知完成回程手續。",
        transport: {
          mode: "遊覽車",
          duration: "",
          route: "AEON 名取 → 仙台空港",
          note: "請依航空公司與領隊通知，提早抵達報到櫃檯。",
        },
        tips: ["確認免稅商品是否需在託運前接受海關查驗。"],
      },
      {
        time: "約 14:30",
        title: "機場手續與免稅商品確認",
        mapQuery: "仙台空港",
        lat: 38.13694,
        lon: 140.9225,
        icon: <QrCode />,
        desc: "抵達機場後，依海關及店家指示辦理免稅商品持出確認，再完成行李託運、安檢與出境。",
        tips: [
          "護照、購物紀錄及需查驗的商品保持可取用。",
          "退款方式依店家安排；機場確認持出不代表立即收到退款。",
          "留意登機門及最後登機時間。",
        ],
      },
      {
        time: "17:25",
        title: "班機：星宇 JX863",
        mapQuery: "仙台空港",
        lat: 38.13694,
        lon: 140.9225,
        icon: <Plane />,
        desc: "搭乘星宇航空返回桃園，為五天的雪國旅程畫下句點。抵達後領取行李，確認隨身物品，再帶著回憶回家。",
        transport: {
          mode: "飛機",
          duration: "約 4 小時 10 分",
          route: "仙台 (SDJ) → 台北桃園 (TPE)",
          note: "航班時刻依出發通知。抵台後確認隨身物品與行李。",
        },
        tips: [
          "航班時刻以航空公司及出發通知為準。",
          "下機前檢查座位周邊、證件與隨身用品。",
        ],
      },
    ],
    notice: {
      type: "info",
      text: "購物請留意集合時間。抵達空港後先完成退稅手續，再辦理託運與報到。",
    },
  },
];

// ============================================================================
// 5. 專案全域設定 (Config)
// ============================================================================
//
// 用於控制行程標題、日期、飯店、緊急聯絡與 UI 主題等。
// 主題（含 componentStyles light/dark）自 2026 輕井澤檔整段複製。
//
export const tripConfig = {
  // ========== 基本資訊 ==========
  id: "2027_tohoku",
  title: "2027 東北／森吉樹冰五日",
  timeZone: "Asia/Tokyo",
  currency: {
    code: "jpy", // API 使用小寫 (jpy, usd, eur...)
    label: "日圓",
    source: "JPY",
    target: "TWD", // 目標貨幣 (固定為TWD)
  },
  subTitle: "2027/1/22 – 1/26",
  startDate: "2027-01-22T00:00:00",

  endDate: "2027-01-26T23:59:59",

  // ========== 網站 Meta 設定 (動態標題) ==========
  meta: {
    title: "2027 東北／森吉樹冰五日",
    shortName: "2027森吉樹冰",
    description: "2027 東北／阿仁森吉樹冰五日旅遊行程助手",
    ogImage: "https://fcwi.github.io/trip_agent/icon-512.png",
  },

  // ========== 航班資訊 ==========
  // 時刻為冬季常見班表草稿，待核商品頁／v11
  flights: {
    outbound: {
      code: "星宇 JX862",
      time: "11:50 TPE ➝ 16:00 SDJ · 時刻依出發通知",
    },
    inbound: {
      code: "星宇 JX863",
      time: "17:25 SDJ ➝ 20:35 TPE · 時刻依出發通知",
    },
  },

  // ========== 住宿資訊 ==========
  // 皆為團體常見候選，未保證落點
  hotels: [
    {
      name: "仙台大都會飯店",
      phone: "+81-22-268-2525",
      address: "宮城県仙台市青葉区中央1-1-1",
      note: "仙台市區住宿參考，實際入住飯店依出發通知。",
    },
    {
      name: "仙溪園月岡",
      phone: "+81-23-672-1212",
      address: "山形県上山市新湯",
      note: "上山溫泉住宿參考，實際入住飯店依出發通知。",
    },
    {
      name: "天童溫泉飯店（滝の湯／天童ホテル等同級）",
      phone: "請向領隊確認",
      address: "山形県天童市",
      note: "天童溫泉住宿參考，實際入住飯店依出發通知。",
    },
    {
      name: "雫石王子大飯店",
      phone: "+81-196-98-1100",
      address: "岩手県岩手郡雫石町繋温泉水沢",
      note: "雫石地區住宿參考，實際入住飯店依出發通知。",
    },
  ],

  // ========== 緊急聯絡 ==========
  emergency: {
    police: "110",
    ambulance: "119",
    contact: "旅外國人急難救助：+81-3-3280-7917",
  },

  // 導遊模式問題 (針對行程)
  aiQuestions: [
    "Day 3 阿仁／森吉樹冰看得到嗎?",
    "銀山溫泉街路滑要注意什麼?",
    "AEON 名取有哪些購物重點?",
    "仙台空港退稅要在託運前辦嗎?",
  ],

  // 翻譯模式預設問題
  translationQuestions: [
    "翻譯「請給我兒童餐具」",
    "翻譯「這個多少錢?」",
    "翻譯「廁所在哪裡?」",
    "翻譯「可以退稅嗎?」",
  ],

  // ========== 地點定義 ==========
  // key 必須與 itineraryData.locationKey 對應
  locations: [
    // Wikipedia 仙台駅：北緯 38.26028、東経 140.88222
    { key: "sendai", name: "仙台", lat: 38.26028, lon: 140.88222 },
    // Wikipedia 仙台空港：北緯 38.13694、東経 140.92250
    {
      key: "sendai_airport",
      name: "仙台空港",
      lat: 38.13694,
      lon: 140.9225,
    },
    // Wikipedia 天童駅：北緯 38.3599694、東経 140.3695028
    { key: "tendo", name: "天童／上山", lat: 38.3599694, lon: 140.3695028 },
    // Wikipedia 上山温泉：北緯 38.16697、東経 140.27322
    {
      key: "kaminoyama",
      name: "上山溫泉",
      lat: 38.16697,
      lon: 140.27322,
    },
    // Wikipedia 銀山温泉：北緯 38.5697、東経 140.5311
    { key: "ginzan", name: "銀山溫泉", lat: 38.5697, lon: 140.5311 },
    // OSM node 11359797231「雄物川民家苑木戸五郎兵衛村」
    { key: "kido", name: "木戶五郎兵衛村", lat: 39.2982401, lon: 140.4327054 },
    // Wikipedia 角館駅（JR）：北緯 39.591722、東経 140.571000
    { key: "kakunodate", name: "角館", lat: 39.591722, lon: 140.571 },
    // Wikipedia 阿仁スキー場：北緯 39.95500、東経 140.49194
    { key: "ani", name: "阿仁／森吉樹冰", lat: 39.955, lon: 140.49194 },
    // Wikipedia 阿仁マタギ駅（阿仁和站）：北緯 39.9195694、東経 140.5157000
    {
      key: "nairiku",
      name: "秋田內陸線（阿仁和）",
      lat: 39.9195694,
      lon: 140.5157,
    },
    // OSM 鉄道駅「猊鼻渓」（node 3838451239）
    { key: "geibikei", name: "猊鼻溪", lat: 38.9887792, lon: 141.2532381 },
    // Wikipedia 松島海岸駅：北緯 38.368142、東経 141.058789
    {
      key: "matsushima",
      name: "松島",
      lat: 38.368142,
      lon: 141.058789,
    },
    // Wikipedia イオンモール名取：北緯 38.163917、東経 140.895972
    { key: "natori", name: "AEON 名取", lat: 38.163917, lon: 140.895972 },
  ],

  // ========== 旅程亮點 ==========
  tripHighlights: [
    "阿仁／森吉樹冰纜車",
    "銀山溫泉街",
    "木戶五郎兵衛村搗麻糬",
    "角館武家屋敷",
    "秋田內陸線（阿仁和⇄松葉）",
    "草莓採果",
    "猊鼻溪遊船",
    "松島／烤魚板",
    "AEON 名取購物與扭蛋",
    "仙台牛舌",
  ],

  // ========== 視覺主題 (UI 樣式) ==========
  // 以下 theme（含 componentStyles light/dark）自
  // src/trip/tripdata_2026_karuizawa.jsx 整段複製，勿拆 light/dark。
  theme: {
    colorBase: "stone",
    colorAccent: "amber",

    textColors: {
      light: "text-stone-800",
      dark: "text-stone-100",
      secLight: "text-stone-500",
      secDark: "text-stone-300",
    },

    bgTexture: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`,

    bgGradientLight: "bg-[#FDFBF7] from-stone-100/50 via-white to-transparent",
    bgGradientDark:
      "bg-[#1A1A1A] from-[#252525] via-[#1A1A1A]/80 to-transparent",

    blobs: {
      light: ["bg-orange-200/30", "bg-stone-200/30", "bg-amber-100/40"],
      dark: ["bg-amber-500/10", "bg-purple-500/10", "bg-blue-500/10"],
    },
    // 天氣底色覆蓋 (若不設定則預設為程式碼中的灰色)
    weatherColors: {
      rain: "#94a3b8", // 自訂雨天底色
      cloud: "#cbd5e1", // 自訂多雲底色
      snow: "#94a3b8", // 自訂雪天底色
    },

    // 語義化配色 (用於圖示、標籤等)
    semanticColors: {
      blue: { light: "text-[#5D737E]", dark: "text-sky-300" },
      green: { light: "text-[#556B2F]", dark: "text-emerald-300" },
      red: { light: "text-[#A04040]", dark: "text-red-300" },
      orange: { light: "text-[#CD853F]", dark: "text-amber-300" },
      pink: { light: "text-[#BC8F8F]", dark: "text-rose-300" },
    },

    // 天氣圖示專用色
    weatherIconColors: {
      sun: "text-amber-300", // 🆕 提升深色模式對比度（原 text-amber-400）
      moon: "text-indigo-300",
      cloud: "text-gray-400",
      fog: "text-slate-400",
      rain: "text-blue-400",
      snow: "text-cyan-300",
      lightning: "text-yellow-500",
    },

    // 毛玻璃與背景色 (Pro Max 級升級)
    // 【設計原則】
    // - card: 內容卡片，透明度高但清晰，提升感強
    // - nav: 背景導航，超級透明，輔助性
    // - chatBubble: 對話泡泡，適度透明，易讀性優先
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

    // 標籤與分類顏色
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

    // 聊天介面顏色
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

    // 主背景色
    mainBg: {
      light: "bg-[#F0F2F5] text-slate-700",
      dark: "bg-[#1A1A1A] text-neutral-200",
    },

    // 粒子系統顏色
    particleColors: {
      rain: {
        light: "rgba(100, 149, 237, 0.6)",
        dark: "rgba(255, 255, 255, 0.5)",
      },
      snow: "rgba(255, 255, 255, 0.8)",
      stars: "rgba(255, 255, 255, ALPHA)", // ALPHA 將在使用時替換
      fog: "rgba(200, 200, 200, ALPHA)",
      lightning: "rgba(255, 255, 200, BRIGHTNESS)",
    },

    // 雲朵顏色
    cloudColors: {
      heavy: "#bdc3c7",
      medium: "#d1d5db",
      light: "#ecf0f1",
    },

    // 天體顏色
    celestialColors: {
      sun: "#f1c40f",
      sunGlow: "#f39c12",
      moon: "#f5f6fa",
      moonShadow: "rgba(245, 246, 250, 0.4)",
    },

    // 環境氛圍色
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

    // 動態背景色
    dynamicBg: {
      rain: { light: "#c7d2e0", dark: "#4a5568" },
      cloud: "#cbd5e1",
    },

    // 按鈕漸層
    buttonGradients: {
      primary: {
        light: "from-[#5D737E] to-[#3F5561]",
        dark: "from-sky-800 to-blue-900",
      },
    },

    // 輸入框顏色
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

    // 連結顏色
    linkColors: {
      hover: {
        light: "#5D737E",
        dark: "sky-300",
      },
    },

    // 文字陰影
    textShadow: {
      light: "0 1px 1px rgba(255,255,255,0.5)",
      dark: "0 2px 4px rgba(0,0,0,0.3)",
    },

    // 圓角系統
    borderRadius: {
      small: "rounded-xl",
      card: "rounded-2xl",
      modal: "rounded-3xl",
      full: "rounded-full",
    },

    // 間距系統
    spacing: {
      cardSmall: "p-3",
      card: "p-4",
      cardLarge: "p-5",
    },

    // ========== 🆕 字體系統 (Typography System) ==========
    // 【說明】
    // 統一的字體層級系統，確保視覺層次清晰一致
    // 【使用方式】
    // const typo = tripConfig.theme.typography.h1;
    // className={typo.class} 或分別使用 typo.size, typo.weight, typo.leading
    typography: {
      h1: {
        size: "text-2xl", // 24px - 主標題
        weight: "font-bold",
        leading: "leading-tight",
        class: "text-2xl font-bold leading-tight",
      },
      h2: {
        size: "text-xl", // 20px - 次標題
        weight: "font-bold",
        leading: "leading-snug",
        class: "text-xl font-bold leading-snug",
      },
      h3: {
        size: "text-lg", // 18px - 卡片標題
        weight: "font-semibold",
        leading: "leading-normal",
        class: "text-lg font-semibold leading-normal",
      },
      body: {
        size: "text-base", // 16px - 內文
        weight: "font-normal",
        leading: "leading-relaxed",
        class: "text-base font-normal leading-relaxed",
      },
      caption: {
        size: "text-sm", // 14px - 輔助文字
        weight: "font-normal",
        leading: "leading-normal",
        class: "text-sm font-normal leading-normal",
      },
      label: {
        size: "text-xs", // 12px - 標籤、極小文字
        weight: "font-medium",
        leading: "leading-tight",
        class: "text-xs font-medium leading-tight",
      },
    },

    // ========== 🆕 陰影系統 (Shadow System) ==========
    // 【說明】
    // 統一的陰影層級，提供清晰的視覺深度
    // 【使用方式】
    // className={tripConfig.theme.shadows.card}
    shadows: {
      subtle: "shadow-sm", // 微妙提升 - 小按鈕、標籤
      card: "shadow-md", // 卡片陰影 - 一般卡片
      elevated: "shadow-lg", // 懸浮元素 - hover 狀態、浮動按鈕
      modal: "shadow-xl", // 彈窗陰影 - 對話框、彈出層
      inner: "shadow-inner", // 內陰影 - 輸入框
      none: "shadow-none", // 無陰影
    },

    // ========== 🆕 過渡動畫系統 (Transition System) ==========
    // 【說明】
    // 統一的過渡動畫配置，確保動畫流暢一致
    // 【使用方式】
    // className={tripConfig.theme.transitions.normal}
    transitions: {
      fast: "transition-all duration-150 ease-out", // 快速 - 小元素互動
      normal: "transition-all duration-300 ease-in-out", // 標準 - 一般過渡
      slow: "transition-all duration-500 ease-in-out", // 緩慢 - 大型動畫
      colors: "transition-colors duration-300 ease-in-out", // 顏色 - 主題切換
    },

    // ========== 🆕 互動狀態系統 (Interaction States) ==========
    // 【說明】
    // 統一的互動回饋樣式，提升使用體驗
    // 【使用方式】
    // className={`${tripConfig.theme.interactions.hover} ${tripConfig.theme.interactions.active}`}
    interactions: {
      hover: "hover:scale-105", // 懸停放大
      active: "active:scale-95", // 點擊縮小
      focus: "focus:outline-none focus:ring-2 focus:ring-offset-2", // 焦點環
      disabled: "disabled:opacity-50 disabled:cursor-not-allowed", // 禁用狀態
    },

    // ========== 🆕 語音按鈕顏色 (Voice Button Colors) ==========
    // 【說明】
    // 語音輸入按鈕的專用顏色配置
    // 【使用方式】
    // const voiceBtn = tripConfig.theme.voiceButton.chinese;
    // className={listeningLang === "zh-TW" ? voiceBtn.active.light : voiceBtn.inactive.light}
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

    // ========== 🆕 組件樣式系統 (Component Styles - Pro Max Edition) ==========
    // 【說明】
    // 統一所有 UI 組件的樣式定義，支援日/夜模式動態切換
    // 【使用方式】
    // const styles = tripConfig.theme.componentStyles.itineraryCard;
    // className={isDarkMode ? styles.dark : styles.light}
    // 【好處】
    // - 單一變更點：修改主題時，所有組件自動同步
    // - 視覺一致性：卡片、導航、對話框遵循相同毛玻璃規則
    // - 可讀性最優：日/夜模式自動調整對比度
    //
    componentStyles: {
      // 行程卡片 (Day Overview, Event Cards)
      itineraryCard: {
        light:
          "bg-white/85 backdrop-blur-lg backdrop-saturate-180 border border-white/30 rounded-2xl shadow-lg shadow-black/5",
        dark: "bg-[#1F1F1F]/92 backdrop-blur-lg backdrop-saturate-180 border border-white/15 rounded-2xl shadow-xl shadow-black/40",
      },

      // 導航按鈕 (Day Navigation Tabs)
      navButton: {
        light:
          "bg-white/25 backdrop-blur-3xl backdrop-saturate-150 border border-white/20 rounded-xl hover:bg-white/35 transition-all duration-300",
        dark: "bg-[#2A2A2A]/50 backdrop-blur-3xl backdrop-saturate-150 border border-white/10 rounded-xl hover:bg-[#3A3A3A]/60 transition-all duration-300",
      },

      // 導航容器背景
      navContainer: {
        light: "bg-gradient-to-r from-white/10 via-white/5 to-white/10",
        dark: "bg-gradient-to-r from-[#2A2A2A]/40 via-[#1F1F1F]/30 to-[#2A2A2A]/40",
      },

      // 對話泡泡 - 使用者端
      chatUserBubble: {
        light: "bg-[#5D737E] text-white shadow-md",
        dark: "bg-sky-800 text-white shadow-lg",
      },

      // 對話泡泡 - 模型端
      chatModelBubble: {
        light:
          "bg-white/88 backdrop-blur-lg border border-white/25 text-stone-700 shadow-md shadow-black/4",
        dark: "bg-neutral-800/88 backdrop-blur-lg border border-white/12 text-neutral-200 shadow-lg shadow-black/50",
      },

      // 對話容器背景
      chatContainer: {
        light: "bg-[#F9F9F6]/80",
        dark: "bg-black/30 backdrop-blur-sm",
      },

      // 資訊卡片 (Flight, Hotel, Checklist)
      infoCard: {
        light:
          "bg-white/80 backdrop-blur-md border border-white/25 rounded-2xl shadow-md",
        dark: "bg-[#262626]/85 backdrop-blur-md border border-white/12 rounded-2xl shadow-lg",
      },

      // 標籤與分類 (Tags)
      tagBase: {
        light:
          "rounded-full px-3 py-1 text-sm font-medium shadow-sm backdrop-blur-sm",
        dark: "rounded-full px-3 py-1 text-sm font-medium shadow-md backdrop-blur-sm",
      },

      // 輸入框與焦點狀態
      inputField: {
        light:
          "bg-white/70 backdrop-blur-sm border border-stone-200/50 rounded-xl focus:border-[#5D737E] focus:ring-2 focus:ring-[#5D737E]/20",
        dark: "bg-[#262626]/60 backdrop-blur-sm border border-white/10 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20",
      },

      // 按鈕 - 主要 (Primary Action)
      buttonPrimary: {
        light:
          "bg-gradient-to-br from-[#5D737E] to-[#3F5561] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all",
        dark: "bg-gradient-to-br from-sky-700 to-blue-900 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all",
      },

      // 按鈕 - 次要 (Secondary Action)
      buttonSecondary: {
        light:
          "bg-white/40 backdrop-blur-md border border-white/25 hover:bg-white/50 active:scale-95 transition-all",
        dark: "bg-[#2A2A2A]/50 backdrop-blur-md border border-white/10 hover:bg-[#3A3A3A]/60 active:scale-95 transition-all",
      },

      // 模態框背景 (Modal Backdrop)
      modalBackdrop: {
        light: "bg-black/20 backdrop-blur-sm",
        dark: "bg-black/50 backdrop-blur-sm",
      },

      // 模態框容器
      modalContent: {
        light:
          "bg-white/95 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl",
        dark: "bg-[#1F1F1F]/98 backdrop-blur-lg border border-white/15 rounded-3xl shadow-2xl shadow-black/50",
      },

      // 分隔線
      divider: {
        light: "border-stone-200/30",
        dark: "border-white/10",
      },

      // 懸停效果 - 卡片提升
      cardHover: {
        light:
          "hover:shadow-xl hover:shadow-black/8 transition-all duration-300",
        dark: "hover:shadow-2xl hover:shadow-black/60 transition-all duration-300",
      },

      // 加載狀態
      loadingOverlay: {
        light: "bg-white/60 backdrop-blur-md",
        dark: "bg-[#1F1F1F]/80 backdrop-blur-md",
      },

      // 成功/警告/錯誤提示
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

      // 主背景漸層
      mainBackground: {
        light: "bg-gradient-to-br from-[#F5F7FA] via-[#FDFBF7] to-white",
        dark: "bg-gradient-to-br from-[#0F0F0F] via-[#1A1A1A] to-[#1F1F1F]",
      },

      // 頁面容器
      pageContainer: {
        light: "bg-[#F5F7FA] text-stone-800",
        dark: "bg-[#0F0F0F] text-neutral-200",
      },
    },
  },

  // ========== 語言與語音設定 ==========
  // validator 需要 language.code 與 language.name
  language: {
    code: "ja-JP",
    label: "日",
    name: "日文",
  },
};

// ============================================================================
// 6. 行前檢查清單 (Pre-departure checklist)
// ============================================================================
export const checklistData = [
  { id: 1, text: "護照（核對效期及旅行社要求）", checked: false },
  { id: 2, text: "VJW 入境申報 QR Code (建議截圖)", checked: false },
  { id: 3, text: "E-SIM / 漫遊開通", checked: false },
  {
    id: 4,
    text: "確認團號、集合時間與往返航班",
    checked: false,
  },
  { id: 5, text: "日幣現金 & 信用卡 (確認海外開通)", checked: false },
  { id: 6, text: "交通卡 (Suica) 與零錢包（扭蛋用零錢另算）", checked: false },
  { id: 7, text: "旅遊保險 (包含不便險/醫療)", checked: false },
  { id: 8, text: "常備藥物 (退燒、感冒、止瀉、OK繃)", checked: false },
  { id: 9, text: "各類充電器 (手機、手錶) & 行動電源", checked: false },
  {
    id: 10,
    text: "防寒：洋蔥式穿搭、防水外套、毛帽、圍巾、手套",
    checked: false,
  },
  { id: 11, text: "濕紙巾、面紙 & 乾洗手 (隨身清潔)", checked: false },
  { id: 12, text: "輕便雨衣／雪地備用襪 & 塑膠袋", checked: false },
  { id: 13, text: "雪靴 / 防滑鞋 (建議噴防水噴霧)", checked: false },
  { id: 14, text: "機上/車上娛樂 (畫筆、貼紙書、耳機)", checked: false },
  { id: 15, text: "保濕乳液 & 護唇膏 (預防乾燥)", checked: false },
  { id: 16, text: "隨身垃圾袋 (日本少垃圾桶)", checked: false },
  { id: 17, text: "暖暖包 (貼式/手持)", checked: false },
  { id: 18, text: "行李秤重器", checked: false },
  { id: 19, text: "居家收尾 (倒垃圾 & 關電源)", checked: false },
  { id: 20, text: "護照影本 & 大頭照備份", checked: false },
  {
    id: 21,
    text: "退稅新制：護照＋退款方式，出境前先持出確認再託運",
    checked: false,
  },
  {
    id: 22,
    text: "名取購物：扭蛋預算每人 2–3 顆，與 LOFT 擇一安排",
    checked: false,
  },
  {
    id: 23,
    text: "享受旅程：第 3 天前往森吉山，山頂景觀依天候而定",
    checked: false,
  },
  {
    id: 24,
    text: "請向領隊確認：住宿正確館名、小費、自費與餐食代金",
    checked: false,
  },
];
